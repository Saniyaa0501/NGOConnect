from django.db import models


class Event(models.Model):
    STATUS_CHOICES = [
        ("Active", "Active"),
        ("Upcoming", "Upcoming"),
        ("Completed", "Completed"),
    ]

    title = models.CharField(max_length=200)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Upcoming"
    )

    date = models.DateField()

    time = models.TimeField()

    location = models.CharField(max_length=200)

    description = models.TextField()

    budget = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    image = models.URLField(blank=True)

    def __str__(self):
        return self.title


class Expense(models.Model):
    CATEGORY_CHOICES = [
        ("Venue", "Venue"),
        ("Food", "Food"),
        ("Materials", "Materials"),
        ("Transport", "Transport"),
        ("Other", "Other"),
    ]

    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name="expenses"
    )

    name = models.CharField(max_length=200)

    date = models.DateField()

    category = models.CharField(
        max_length=50,
        choices=CATEGORY_CHOICES
    )

    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    def __str__(self):
        return self.name
