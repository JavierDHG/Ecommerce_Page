from rest_framework import serializers
from .models import Category,Product

class ProductSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all()
    )
    category_name = serializers.StringRelatedField(source="category", read_only=True)

    class Meta:
        model = Product
        fields = ["id", "title", "description", "price", "stock", "category", "category_name", "image"]

# se encarga de serializar los productos (convierte tipos de datos de python a json)
# serializer.ModelSerializer es una clase que nos permite serializar los productos
# en pocas palabras se encarga de selecionar los productos
class CategorySerializer(serializers.ModelSerializer):
    # products es para seleccionar los productos de la categoría actual y mostrarlos en la vista
    # se debe llamar igual que el campo en el modelo related_name = 'products'
    products = ProductSerializer(many=True, read_only=True)  # gracias a related_name='products'
    # la clase Meta es una clase que nos permite seleccionar los productos
    class Meta:
        # model es para seleccionar el modelo
        model = Category
        # se encarga de seleccionar todos los productos
        fields = "__all__"