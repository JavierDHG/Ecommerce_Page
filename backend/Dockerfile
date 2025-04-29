FROM python:3.11-slim

# Establecer el directorio base
WORKDIR /app

# Instala el cliente de PostgreSQL
RUN apt-get update && \
    apt-get install -y --no-install-recommends postgresql-client && \
    rm -rf /var/lib/apt/lists/*

# Copiar los archivos del proyecto al contenedor
COPY . .

# Instalar dependencias desde el archivo de backend
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copiar y dar permisos al script
COPY wait-for-db.sh /wait-for-db.sh
RUN chmod +x /wait-for-db.sh

# Exponer puerto
EXPOSE 8000

# Cambiar al directorio correcto donde vive el proyecto Django
WORKDIR /app/backend

# Comando para iniciar Gunicorn
CMD ["gunicorn", "django_ecommerce_api.wsgi:application", "--bind", "0.0.0.0:8000"]
