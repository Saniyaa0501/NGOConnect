from rest_framework.routers import DefaultRouter
from .views import EventViewSet, ExpenseViewSet


router = DefaultRouter()

router.register("events", EventViewSet, basename="event")
router.register("expenses", ExpenseViewSet, basename="expense")


urlpatterns = router.urls
