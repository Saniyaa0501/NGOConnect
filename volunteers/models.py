from django.db import models
class Volunteer(models.Model):
    AVAILABILITY_CHOICES = [
        ('Weekdays', 'Weekdays'),
        ('Weekends', 'Weekends'),
        ('Flexible', 'Flexible'),
    ]
    STATUS_CHOICES = [('Active', 'Active'), ('Inactive', 'Inactive')]
    APPROVAL_CHOICES = [('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected')]

    name = models.CharField(max_length=120)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    availability = models.CharField(max_length=20, choices=AVAILABILITY_CHOICES)
    skills = models.CharField(max_length=255, blank=True, null=True)
    preferred_location = models.CharField(max_length=150, blank=True, null=True)
    hours_contributed = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Active')
    joined_on = models.DateField()

    approval_status = models.CharField(max_length=20, choices=APPROVAL_CHOICES, default='pending')
    created_by_admin = models.BooleanField(default=False)
    admin_notes = models.TextField(blank=True, null=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.name