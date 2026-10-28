from django.db import models

class Donation(models.Model):
    PAYMENT_CHOICES = [('Cash', 'Cash'), ('Online', 'Online'), ('Cheque', 'Cheque')]
    STATUS_CHOICES = [('Received', 'Received'), ('Pending', 'Pending')]
    APPROVAL_CHOICES = [('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected')]

    donor_name = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()
    payment_mode = models.CharField(max_length=20, choices=PAYMENT_CHOICES, default='Cash', blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Received')
    notes = models.TextField(blank=True, null=True)

    approval_status = models.CharField(max_length=20, choices=APPROVAL_CHOICES, default='pending')
    created_by_admin = models.BooleanField(default=False)
    admin_notes = models.TextField(blank=True, null=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.donor_name} - {self.amount}"