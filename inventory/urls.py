from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, StockTransactionViewSet, InventoryView, InventoryAtDateView

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'transactions', StockTransactionViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('inventory/', InventoryView.as_view(), name='inventory'),
    path('inventory-at-date/', InventoryAtDateView.as_view(), name='inventory-at-date'),
] 