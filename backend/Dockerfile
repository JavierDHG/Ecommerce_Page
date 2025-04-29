# Usar una imagen base oficial de Python (ajusta la versión si es necesario)
FROM python:3.11-slim
# Establecer el directorio de trabajo en el contenedor
# Aquí estará tu aplicación Django dentro del contenedor
WORKDIR /app/backend 


# Instala el cliente de PostgreSQL
RUN apt-get update && \
    apt-get install -y --no-install-recommends postgresql-client && \
    rm -rf /var/lib/apt/lists/*

# Copiar el archivo 'requirements.txt' al contenedor
COPY requirements.txt .

# Instalar las dependencias de Python que están en 'requirements.txt'
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código del proyecto Django al contenedor
COPY . /app/

# Copia el script y dale permisos directamente en el Dockerfile
COPY wait-for-db.sh /wait-for-db.sh
RUN chmod +x /wait-for-db.sh

# Exponer el puerto que usará el servidor Django (puerto 8000)
EXPOSE 8000

# Configurar el comando para ejecutar Django
# Ejecuta 'python manage.py runserver 0.0.0.0:8000' para iniciar el servidor
CMD ["gunicorn", "backend.django_ecommerce_api.wsgi:application", "--bind", "0.0.0.0:8000"]