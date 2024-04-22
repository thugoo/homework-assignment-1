from django.db import models

STATUS_WAITING = "waiting"
STATUS_INSTALLING = "installing"
STATUS_DONE = "done"
STATUS_FAILED = "failed"
STATUS_SUCCESS = "success"

TASK_CHOICES = [
    (STATUS_WAITING, "Waiting"),
    (STATUS_INSTALLING, "Installing"),
    (STATUS_DONE, "Done"),
    (STATUS_FAILED, "Failed"),
    (STATUS_SUCCESS, "Success"),
]

FIREWALL = "firewall"
ROUTER = "router"
SWITCH = "switch"
LOADBALANCER = "loadbalancer"

DEVICE_TYPES = [
    (ROUTER, "Firewall"),
    (ROUTER, "Router"),
    (SWITCH, "Switch"),
    (LOADBALANCER, "Loadbalancer"),
]


class Device(models.Model):
    device_type = models.CharField(max_length=15, choices=DEVICE_TYPES)
    name = models.CharField(max_length=15)


class Task(models.Model):
    # id autofilled
    status = models.CharField(max_length=15, choices=TASK_CHOICES, default=STATUS_WAITING)
    name = models.CharField(max_length=15)
    active = models.BooleanField()
    start_date = models.DateTimeField(default=None, blank=True, null=True)
    end_date = models.DateTimeField(default=None, blank=True, null=True)
    device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name="device",
                               related_query_name="device")

    class Meta:
        ordering = ["-start_date"]
