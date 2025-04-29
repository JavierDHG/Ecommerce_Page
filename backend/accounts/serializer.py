from rest_framework import serializers
from .models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

    def update(self, instance, validated_data):
        # Si la contraseña es parte de los datos validados, actualízala
        if 'password' in validated_data:
            instance.set_password(validated_data['password'])  # Encriptar la nueva contraseña
            validated_data['password'] = instance.password  # Asignar la contraseña encriptada
        return super().update(instance, validated_data)
        
    def delete(self, instance):
        # Eliminar el usuario
        instance.delete()
        return instance

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['id'] = user.id
        token["username"] = user.username  # ✅ Añade username al payload
        token["email"] = user.email  # ✅ Añade email al payload
        token["is_staff"] = user.is_staff  # ✅ Añade is_staff al payload
        return token