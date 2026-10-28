from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register),
    path('login/', views.login),
    path('profile/', views.profile),
    path('change-password/', views.change_password),
    path('logout/', views.logout),
    path('public-stats/', views.public_stats),
    path('forgot-password/', views.forgot_password),
]