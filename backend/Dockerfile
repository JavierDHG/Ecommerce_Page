FROM python:3.11-slim

WORKDIR /app/backend

# Instalar dependencias del sistema
RUN apt-get update && \
    apt-get install -y --no-install-recommends postgresql-client && \
    rm -rf /var/lib/apt/lists/*

# Copiar archivos de configuración primero (mejor uso de cache de Docker)
COPY ./requirements.txt ./
COPY entrypoint.sh /entrypoint.sh

# Instalar dependencias de Python
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el resto del proyecto
COPY . .

EXPOSE 8000

# Configurar entrypoint y comando
ENTRYPOINT ["/entrypoint.sh"]
CMD ["gunicorn", "django_ecommerce_api.wsgi:application", "--bind", "0.0.0.0:8000"]