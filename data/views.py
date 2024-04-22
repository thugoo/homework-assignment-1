from rest_framework.decorators import api_view
from rest_framework.request import Request

from .lib import StandardResultsSetPagination
from .serializers import TaskSerializer, TaskSerializerFilter

from .models import Task


@api_view(["GET"])
def tasks(request: Request):
    order = request.GET.get("sort")
    paginator = StandardResultsSetPagination()
    events_query = Task.objects.all()
    events_query = TaskSerializerFilter(request.GET, queryset=events_query).qs
    if order:
        events_query = events_query.order_by(order)
    events_query = paginator.paginate_queryset(events_query, request)
    ser = TaskSerializer(events_query, many=True)
    response = paginator.get_paginated_response(ser.data)
    return response
