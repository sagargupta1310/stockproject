from django.db import models

# Create your models here.

class Product(models.Model):  # prodmast
    code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    unit = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.code} - {self.name}"

class StockTransaction(models.Model):  # stckmain
    TRANSACTION_TYPES = [
        ("IN", "Stock In"),
        ("OUT", "Stock Out"),
    ]
    transaction_type = models.CharField(max_length=3, choices=TRANSACTION_TYPES)
    reference = models.CharField(max_length=50)
    date = models.DateField()
    remarks = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.transaction_type} - {self.reference} ({self.date})"

class StockDetail(models.Model):  # stckdetail
    transaction = models.ForeignKey(StockTransaction, related_name="details", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.product.code} x {self.quantity} ({self.transaction.reference})"
