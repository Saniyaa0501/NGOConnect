from django.urls import path
from . import views

urlpatterns = [
    path('', views.donation_list),
    path('<int:pk>/', views.donation_detail),
    path('<int:pk>/review/', views.donation_review),
]