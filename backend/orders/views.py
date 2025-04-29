from rest_framework import viewsets, permissions
from .serializer import OrderSerializer, OrderItemSerializer, ShippingSerializer
from .models import Order, OrderItem, Shipping
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import ValidationError
from rest_framework.viewsets import ReadOnlyModelViewSet
from cart.models import Cart
from django.db import transaction


# Create your views here.


class OrderView(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)
    

    def perform_create(self, serializer):
        user = self.request.user

        with transaction.atomic():  # Todo dentro de la transacción
            # Bloquea el carrito para evitar race conditions
            cart = Cart.objects.select_for_update().get(user=user)

            # Calcula el total
            total_price = sum(
                item.product.price * item.quantity
                for item in cart.items.all()
            )

            # Crea la orden
            order = serializer.save(
                user=user,
                total_price=total_price
            )


class OrderItemView(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()  # Se define el queryset general
    serializer_class = OrderItemSerializer
    # Asegura que solo usuarios autenticados puedan acceder
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Filtramos los order_items para que solo traigan los que pertenecen al usuario autenticado
        return OrderItem.objects.filter(order__user=self.request.user)

    def create(self, request, *args, **kwargs):
        # Detectar si el frontend envió una lista o un solo objeto
        is_many = isinstance(request.data, list)

        serializer = self.get_serializer(data=request.data, many=is_many)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        serializer.save()
    

class AvailableOrdersViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Solo órdenes del usuario autenticado que NO tienen envío aún y que estan pagadas
        return Order.objects.filter(user=self.request.user, shipping__isnull=True, is_paid=True)


class ShippingView(viewsets.ModelViewSet):
    queryset = Shipping.objects.all()
    serializer_class = ShippingSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    
class OrderHistoryViewSet(ReadOnlyModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user, is_paid=True).prefetch_related('items__product').order_by('-created_at')


@api_view(['POST'])
def crear_pedido(request):
    user = request.user
    data = request.data  # Solo debería tener 'items'

    try:
        items = data.get('items', [])
        if not items:
            return Response({'error': 'No hay productos en el pedido.'}, status=400)

        with transaction.atomic():
            total_price = 0

            # Validamos y sumamos los precios
            for item in items:
                if 'product_id' not in item or 'quantity' not in item:
                    raise ValidationError("Cada item debe tener 'product_id' y 'quantity'.")
                product = Product.objects.get(id=item['product_id'])
                total_price += product.price * item['quantity']

            # Creamos la orden con el total calculado
            order = Order.objects.create(user=user, total_price=total_price, is_paid=False)

            # Creamos los items, asociando el OrderItem a la orden
            for item in items:
                product = Product.objects.get(id=item['product_id'])  # Asegúrate de obtener el producto
                OrderItem.objects.create(
                    order=order,  # Asociamos el OrderItem con la orden
                    product=product,  # Producto relacionado con el item
                    quantity=item['quantity'],  # Cantidad del producto
                )

            return Response({'message': 'Pedido creado con éxito', 'order_id': order.id}, status=201)

    except Product.DoesNotExist:
        return Response({'error': 'Producto no encontrado.'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=400)

# Endpoint para marcar una orden como pagada
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_order_as_paid(request, order_id):
    try:
        # Obtener la orden del usuario actual
        order = Order.objects.get(id=order_id, user=request.user)

        # Marcar como pagada
        order.is_paid = True
        order.save()

        return Response(
            {"status": "success", "message": "Orden pagada correctamente"},
            status=status.HTTP_200_OK
        )

    except Order.DoesNotExist:
        return Response(
            {"error": "Orden no encontrada"},
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['POST'])
def delete_cart(request, cart_id):
    try:
        cart = Cart.objects.get(id=cart_id)
        cart.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Cart.DoesNotExist:
        return Response({"detail": "Carrito no encontrado"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def clear_cart(request):
    try:
        # Elimina todos los elementos del carrito del usuario logueado
        CartItem.objects.filter(user=request.user).delete()
        return Response({"message": "Carrito vaciado exitosamente."}, status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=400)