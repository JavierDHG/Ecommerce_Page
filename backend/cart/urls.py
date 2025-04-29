from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CartItemView, CartView

router = DefaultRouter()
router.register(r'cart_items', CartItemView, basename='cart_item')
router.register(r'carts', CartView, basename='cart')

urlpatterns = [
    path('api/v1/', include(router.urls)),
]