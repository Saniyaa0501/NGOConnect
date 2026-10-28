from rest_framework import serializers
from .models import Event, Expense


class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = "__all__"


class EventSerializer(serializers.ModelSerializer):
    expenses = ExpenseSerializer(many=True, read_only=True)

    class Meta:
        model = Event
        fields = [
            "id",
            "title",
            "status",
            "date",
            "time",
            "location",
            "description",
            "budget",
            "image",
            "expenses",
        ]
