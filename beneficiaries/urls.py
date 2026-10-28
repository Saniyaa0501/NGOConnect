from django.urls import path
from . import views

urlpatterns = [
    path('', views.beneficiary_list),
    path('<int:pk>/', views.beneficiary_detail),
    path('<int:pk>/review/', views.beneficiary_review),
]