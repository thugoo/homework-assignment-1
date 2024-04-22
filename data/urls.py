from django.urls import path
from .views import tasks

app_name = "data"

urlpatterns = [
    path("tasks", tasks),
]
