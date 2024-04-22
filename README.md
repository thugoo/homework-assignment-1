Task is described in the task_description.pdf file.

## Introduction

This project contains a simple Python Django server with a pre-built local database and a React JS frontend server.

The basic concept is that you run both the backend and frontend server with the frontend server displaying 
data it receives from backend.

## Basic Setup

Required dependencies:
 - python >=3.9
 - pip >=22.x
 - pipenv >=2022.6.x
 - node >=16.x

In root folder
Install dependencies from pipfile (change Python version in Pipfile if your installed version does not match)
```
pipenv shell
pipenv install
```

Build backend static files

`pipenv run manage.py collectstatic`

Run backend server

`pipenv run manage.py runserver`

In frontend folder
Install frontend dependencies

`npm install`

Start frontend server

`npm start`

## Examples


Once you run the backend and/or frontend server you can try out to query tasks with 

[http://127.0.0.1:8000/api/tasks](http://127.0.0.1:8000/api/tasks) - backend

[http://localhost:3000/api/tasks](http://localhost:3000/api/tasks) - frontend


This paginated data query can be modified with query parameters 

 - `size: number of tasks returned per page` - [`http://localhost:3000/api/tasks?size=20`](http://localhost:3000/api/tasks?size=20)

 - `page: page number` - [`http://localhost:3000/api/tasks?page=11`](http://localhost:3000/api/tasks?page=11)

 - `sort: order by field (desc/asc)` - [`http://localhost:3000/api/tasks?sort=id`](http://localhost:3000/api/tasks?sort=id) / [`http://localhost:3000/api/tasks?sort=-id`](http://localhost:3000/api/tasks?sort=-id)

In addition - data can be filtered with query parameters (you can also combine these filters)

 - `status` - [`http://localhost:3000/api/tasks?status=success`](http://localhost:3000/api/tasks?status=success)
 - `name` - [`http://localhost:3000/api/tasks?name=Urmas`](http://localhost:3000/api/tasks?name=Urmas)
 - `active` - [`http://localhost:3000/api/tasks?active=1`](http://localhost:3000/api/tasks?active=1)
 - `start_date/end_date` - [`http://localhost:3000/api/tasks?start_date__gte=2023-03-06T09:57:00`](http://localhost:3000/api/tasks?start_date__gte=2023-03-06T09:57:00)
 - `device name` - [`http://localhost:3000/api/tasks?device__name=testfw01.test`](http://localhost:3000/api/tasks?device__name=testfw01.test)
 - `device_type` - [`http://localhost:3000/api/tasks?device__device_type=firewall`](http://localhost:3000/api/tasks?device__device_type=firewall)
```
__gte -> Greater than or equal
__lt -> Less than
```
