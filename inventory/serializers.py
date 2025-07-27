from rest_framework import serializers
from .models import Product, StockTransaction, StockDetail
from rest_framework.validators import UniqueValidator

class ProductSerializer(serializers.ModelSerializer):
    code = serializers.CharField(
        validators=[UniqueValidator(queryset=Product.objects.all())]
    )

    class Meta:
        model = Product
        fields = '__all__'

class StockDetailSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        source='product',
        write_only=True
    )

    class Meta:
        model = StockDetail
        fields = ['id', 'product', 'product_id', 'quantity']

    def validate_quantity(self, value):
        if value < 0:
            raise serializers.ValidationError("Quantity cannot be negative.")
        return value

class StockTransactionSerializer(serializers.ModelSerializer):
    details = StockDetailSerializer(many=True)

    class Meta:
        model = StockTransaction
        fields = ['id', 'transaction_type', 'reference', 'date', 'remarks', 'created_at', 'details']

    def create(self, validated_data):
        details_data = validated_data.pop('details')
        transaction = StockTransaction.objects.create(**validated_data)
        for detail_data in details_data:
            StockDetail.objects.create(transaction=transaction, **detail_data)
        return transaction
