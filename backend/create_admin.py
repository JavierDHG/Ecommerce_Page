# backend/create_admin.py
import os
import django
from django.contrib.auth import get_user_model

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "django_ecommerce_api.settings")
django.setup()

User = get_user_model()

if not User.objects.filter(email="admin@example.com").exists():
    User.objects.create_superuser(
        email="admin@example.com",
        password="admin123",
        username="admin"
    )
    print("✔ Superuser creado.")
else:
    print("⚠ Superuser ya existe.")
