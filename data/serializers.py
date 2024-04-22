from rest_framework import serializers
import rest_framework_filters as filters


from .models import Task, Device


class DeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        fields = ('device_type', 'name')


class TaskSerializer(serializers.ModelSerializer):
    device = DeviceSerializer(required=False)

    class Meta:
        model = Task
        fields = ('id', 'status', 'active', 'name', 'start_date', 'end_date', 'device')


class DeviceFilter(filters.FilterSet):
    device_type = filters.CharFilter(lookup_expr="icontains")
    name = filters.CharFilter(lookup_expr="icontains")

    class Meta:
        model = Device
        fields = ("device_type", "name")


class TaskSerializerFilter(filters.FilterSet):
    id = filters.CharFilter(lookup_expr="icontains")
    status = filters.CharFilter(lookup_expr="icontains")
    name = filters.CharFilter(lookup_expr="icontains")
    active = filters.CharFilter(lookup_expr="icontains")
    device = filters.RelatedFilter(DeviceFilter, queryset=Device.objects.all())

    class Meta:
        model = Task
        fields = {
            "id": ["exact", "icontains"],
            "status": ["icontains"],
            "active": ["icontains"],
            "device": [],
            "start_date": ["lt", "gte"],
            "end_date": ["lt", "gte"],
        }

