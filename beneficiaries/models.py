from django.db import models

class Beneficiary(models.Model):
    GENDER_CHOICES = [('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')]
    SUPPORT_CHOICES = [('Food', 'Food'), ('Education', 'Education'), ('Medical', 'Medical'), ('Other', 'Other')]
    APPROVAL_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    name = models.CharField(max_length=100)
    age = models.IntegerField()
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    contact = models.CharField(max_length=15)
    address = models.TextField()
    support_type = models.CharField(max_length=20, choices=SUPPORT_CHOICES)
    priority_score = models.IntegerField(default=0)

    approval_status = models.CharField(max_length=20, choices=APPROVAL_CHOICES, default='pending')
    created_by_admin = models.BooleanField(default=False)
    admin_notes = models.TextField(blank=True, null=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.name