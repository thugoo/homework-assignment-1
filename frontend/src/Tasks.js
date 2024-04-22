import './Tasks.css';
import { GlobalFilter } from './GlobalFilter';
import axios from "axios";
import React, { useState, useEffect, useMemo } from "react";
import { useFilters, useGlobalFilter, usePagination, useSortBy, useTable } from "react-table";
import Multiselect from "multiselect-react-dropdown";
import DatePicker from "react-date-picker"


/**
 * This function generates a table with global filtering and pagination added for navigating.
 * @returns A component containing the global filter, table and pagination UI.
 */
export function Tasks() {

    const [data, setData] = useState([]);
    const [count, setCount] = useState([]);
    

    /**
     * This constant handles the data fetching for the table. Utilises lazy loading to reduce page load times.
     * @param {number} pageSize page size, e.g. pageSize=25 loads 25 rows of data on a single page.
     * @param {number} pageIndex page index, e.g. pageIndex=5 with pageSize=25 loads rows starting at 126. row.
     */
    const fetchData = async ({pageSize, pageIndex}) => {
        const response = await axios
        .get(`/api/tasks?size=${pageSize}&page=${pageIndex + 1}`)
        .catch(err => console.log(err));
        if (response) {
            const data = response.data.results;
            const count = response.data.count;
            setCount(count);
            setData(data);
        }
    };
    

    /**
     * This function returns a Multiselect component for filtering table rows by given filters, supports selecting multiple filters.
     * @param {Array} filterValue holds currently selected filters.
     * @method setFilter sets given values as filters.
     * @param {Array} preFilteredRows holds all table rows of a given page, used to calculate the options for filtering.
     * @param {String} id column id, used to calculate the options for filtering.
     * @returns {Multiselect} Multiselect component.
     */
    function SelectColumnFilter({
        column: { filterValue, setFilter, preFilteredRows, id },
    }) {

        const options = React.useMemo(() => {
        const options = new Set()
        preFilteredRows.forEach(row => {
            options.add(row.values[id])
        })
        return [...options.values()]
        }, [id, preFilteredRows])
    
        return (
            <Multiselect
            style={{
                searchBox: {
                    margin: 4,
                    padding: 0,
                }
            }}
                showArrow
                customArrow={true}
                showCheckbox
                hideSelectedList
                isObject={false}
                // If all filters for given column are removed, automatically puts all filters on, since without filters no rows would be displayed.
                onRemove={(selectedList) => setFilter(selectedList.length !== 0 ? selectedList : options || undefined)}
                onSelect={(selectedList) => setFilter(selectedList.length !== 0 ? selectedList : options || undefined)}
                options={options}
                selectedValues={filterValue === undefined ? options : filterValue}
                placeholder=""
            />
        )
    }


    /**
     * This function returns a DatePicker component for filtering table rows by a selected date.
     * @method setFilter sets given date as a filter.
     * @returns {DatePicker} DatePicker component.
     */
    function SelectDateFilter({
        column: { setFilter },
    }) {
        const [value, onChange] = useState(new Date());
        return (
            <DatePicker 
                onChange={(selectedDate) => {
                        onChange(selectedDate)
                        setFilter(selectedDate || undefined)}}
                value={value}
            />
        )
    }


    /**
     * Filters rows by given start date.
     * @param {Array} rows holds given table rows for filtering.
     * @param {String} id column id, used to get the column values from the rows.
     * @param {Array} filterValue holds currently selected filter (Date object).
     * @returns 
     */
    const startDateFilter = (rows, id, filterValue) => {
        return rows.filter(row => {
            const rowValue = new Date(Date.parse(row.values[id]))
            return filterValue.getDate() <= rowValue.getDate();
        })
    }


    /**
     * Filters rows by given end date.
     * @param {Array} rows holds given table rows for filtering.
     * @param {String} id column id, used to get the column values from the rows.
     * @param {Array} filterValue holds currently selected filter (Date object).
     * @returns 
     */
    const endDateFilter = (rows, id, filterValue) => {
        return rows.filter(row => {
            const rowValue = new Date(Date.parse(row.values[id]))
            return filterValue.getDate() >= rowValue.getDate();
        })
    }


    /**
     * Filters rows by given filters, supports selecting multiple filters.
     * @param {Array} rows holds given table rows for filtering.
     * @param {String} id column id, used to get the column values from the rows.
     * @param {Array} filterValue holds currently selected filters (Array of strings).
     * @returns 
     */
    const multiFilter = (rows, id, filterValue) => {
          return rows.filter(row => {
            const rowValue = row.values[id];
            return filterValue.includes(rowValue);
          });
        };
        

    const columns = useMemo(() => [
        {
            Header: "Device type",
            accessor: "device.device_type",
            Filter: SelectColumnFilter,
            filter: multiFilter,
        },
        {
            Header: "Device name",
            accessor: "device.name",
        },
        {
            Header: "Status",
            accessor: "status",
        },
        {
            Header: "Name",
            accessor: "name",
            Filter: SelectColumnFilter,
            filter: multiFilter,
        },
        {
            Header: "Active",
            accessor: (data) => data.active ? "Active" : "Not active",
            Filter: SelectColumnFilter,
            filter: multiFilter,
        },
        {
            Header: "Start date",
            accessor: (data) => data.start_date.replace('T', ' ').replace('Z', ''),
            Filter: SelectDateFilter,
            filter: startDateFilter
        },
        {
            Header: "End date",
            accessor: (data) => data.end_date.replace('T', ' ').replace('Z', ''),
            Filter: SelectDateFilter,
            filter: endDateFilter
        },
    ], []);


    const { getTableProps, 
        getTableBodyProps, 
        headerGroups,
        prepareRow, 
        preGlobalFilteredRows, 
        setGlobalFilter, 
        state, 
        page,
        canPreviousPage, 
        canNextPage, 
        pageCount,
        gotoPage, 
        nextPage, 
        previousPage,
        state: { pageIndex, pageSize } 
    } = useTable(
            { 
                columns, 
                data,
                initialState: { pageIndex: 0, pageSize: 25 },
                manualPagination: true,
                // To prevent reloading the table with inital states and filters, e.g. when changing pages.
                autoResetPage: false,
                autoResetFilters: false,
                pageCount: Math.ceil(count / 25),
            },
            useFilters,
            useGlobalFilter,
            useSortBy,
            usePagination,
        );

    useEffect(() => {
        fetchData({ pageIndex, pageSize });
    }, [pageIndex, pageSize]);

    // For having the asc/desc sort available only to these columns.
    const canBeSorted = ["Device name", "Start date", "End date"]
    // For alternating the color of the rows for better readability.
    const isEven = (index) => index % 2 === 0;
    
    return (
        <>
            <GlobalFilter 
                preGlobalFilteredRows={preGlobalFilteredRows} 
                setGlobalFilter={setGlobalFilter} 
                globalFilter={state.globalFilter} 
            />
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th>
                                    {column.render('Header')}
                                    {canBeSorted.includes(column.Header) ?
                                    <button className="sort-button"
                                    {...column.getHeaderProps(canBeSorted.includes(column.Header) ? column.getSortByToggleProps() : "")}>
                                        {canBeSorted.includes(column.Header) ? (column.isSorted ? (column.isSortedDesc ? " ▼" : " ▲") : "-") : ""}
                                    </button> : ""}
                                    <div>{column.Filter != null ? column.render('Filter') : ""}</div>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map((row, index) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()} className={isEven(index) ? "uneven" : "even"}>
                                {row.cells.map(cell => {
                                    return (
                                        <td {...cell.getCellProps()}>
                                            {cell.render('Cell')}
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <div className="pagination">
                <button onClick={
                    () => {
                        gotoPage(0)
                    }
                } disabled={!canPreviousPage}>
                    {'<<'}
                </button>{' '}
                <button onClick={
                    () => {
                        previousPage()
                    }
                } disabled={!canPreviousPage}>
                    {'<'}
                </button>{' '}
                <button onClick={
                    () => {
                        nextPage()
                    }
                } disabled={!canNextPage}>
                    {'>'}
                </button>{' '}
                <button onClick={
                    () => {
                        gotoPage(pageCount - 1)
                    }
                } disabled={!canNextPage}>
                    {'>>'}
                </button>{' '}
                <span>
                    Page{' '}
                <strong>
                    {pageIndex + 1} of {pageCount}
                </strong>{' '}
                </span>
                <span>
                    | Go to page:{' '}
                <input
                    type="number"
                    defaultValue={pageIndex + 1}
                    onChange={e => {
                        const page = e.target.value ? Number(e.target.value) - 1 : 0
                        gotoPage(page)
                    }}
                    style={{ width: '100px' }}
                />
                </span>{' '}
            </div>
        </>
    )
}