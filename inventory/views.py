from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Product, StockTransaction
from .serializers import ProductSerializer, StockTransactionSerializer
from django.db.models import Sum, F
from datetime import datetime

# Create your views here.

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class StockTransactionViewSet(viewsets.ModelViewSet):
    queryset = StockTransaction.objects.all().order_by('-date')
    serializer_class = StockTransactionSerializer

class InventoryView(APIView):
    def get(self, request):
        # Calculate inventory for all products
        products = Product.objects.all()
        inventory = []
        for product in products:
            stock_in = product.stockdetail_set.filter(transaction__transaction_type='IN').aggregate(total=Sum('quantity'))['total'] or 0
            stock_out = product.stockdetail_set.filter(transaction__transaction_type='OUT').aggregate(total=Sum('quantity'))['total'] or 0
            inventory.append({
                'product': ProductSerializer(product).data,
                'stock_in': stock_in,
                'stock_out': stock_out,
                'current_stock': stock_in - stock_out
            })
        return Response(inventory)

class InventoryAtDateView(APIView):
    def get(self, request):
        date_str = request.query_params.get('date')
        if not date_str:
            return Response({'error': 'date parameter required (YYYY-MM-DD)'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return Response({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=status.HTTP_400_BAD_REQUEST)
        products = Product.objects.all()
        inventory = []
        for product in products:
            stock_in = product.stockdetail_set.filter(transaction__transaction_type='IN', transaction__date__lte=date).aggregate(total=Sum('quantity'))['total'] or 0
            stock_out = product.stockdetail_set.filter(transaction__transaction_type='OUT', transaction__date__lte=date).aggregate(total=Sum('quantity'))['total'] or 0
            inventory.append({
                'product': ProductSerializer(product).data,
                'stock_in': stock_in,
                'stock_out': stock_out,
                'current_stock': stock_in - stock_out
            })
        return Response(inventory)
