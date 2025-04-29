from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderView, OrderItemView, ShippingView, AvailableOrdersViewSet, mark_order_as_paid, OrderHistoryViewSet, delete_cart

router = DefaultRouter()
router.register(r'orders', OrderView, basename='order')
router.register(r'order_items', OrderItemView, basename='order_item')
router.register(r'shippings', ShippingView, basename='shipping')
router.register(r'orders_available', AvailableOrdersViewSet, basename='available-orders')
router.register(r'orders_history', OrderHistoryViewSet, basename='order_history')

urlpatterns = [
    path('api/v1/', include(router.urls)),
    # Endpoint personalizado para marcar orden como pagada
    path(
        'api/v1/orders/<int:order_id>/pay/', 
        mark_order_as_paid, 
        name='mark_order_as_paid'
    ),
    # Endpoint personalizado para eliminar el carrito
    path(
        'api/v1/carts/<int:cart_id>/delete/', 
        delete_cart, 
        name='delete_cart'
    ),
]
