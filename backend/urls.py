from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/donations/', include('donations.urls')),
    path('api/beneficiaries/', include('beneficiaries.urls')),
    path('api/', include('volunteers.urls')),
     path("api/", include("events.urls")),
]