from rest_framework import viewsets

from .models import Event, Expense
from .serializers import EventSerializer, ExpenseSerializer


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all().order_by("-id")
    serializer_class = EventSerializer


class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all().order_by("-id")
    serializer_class = ExpenseSerializer
