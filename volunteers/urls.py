from django.urls import path
from . import views

urlpatterns = [
    path('volunteers/', views.volunteer_list),
    path('volunteers/<int:pk>/', views.volunteer_detail),
    path('volunteers/<int:pk>/review/', views.volunteer_review),
]