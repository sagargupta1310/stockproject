from django.contrib import admin
from .models import Product, StockTransaction, StockDetail

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("code", "name", "unit", "created_at")
    search_fields = ("code", "name")

@admin.register(StockTransaction)
class StockTransactionAdmin(admin.ModelAdmin):
    list_display = ("transaction_type", "reference", "date", "created_at")
    search_fields = ("reference",)
    date_hierarchy = "date"

@admin.register(StockDetail)
class StockDetailAdmin(admin.ModelAdmin):
    list_display = ("transaction", "product", "quantity")
    search_fields = ("transaction__reference", "product__code")
