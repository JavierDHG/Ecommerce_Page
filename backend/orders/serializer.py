from rest_framework import serializers
from .models import Order, OrderItem, Shipping
from ecommerce.serializer import ProductSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    product_title = serializers.CharField(source='product.title', read_only=True)
    product_price = serializers.DecimalField( max_digits=10, decimal_places=2, source='product.price', read_only=True)
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_title', 'quantity', 'order', 'product_price']

class ShippingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shipping
        fields = ['address', 'city', 'postal_code', 'country', 'order']
        read_only_fields = ['user']

    def validate_order(self, value):
        # Verifica si ya hay un envío para esa orden
        if Shipping.objects.filter(order=value).exists():
            raise serializers.ValidationError("Ya existe un envío para esta orden.")
        return value

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    shipping = ShippingSerializer(read_only=True)
    class Meta:
        model = Order
        fields = ["id", "user", "total_price", "created_at", "items", "is_paid", "shipping"]
        read_only_fields = ["user", "created_at", "is_paid"]