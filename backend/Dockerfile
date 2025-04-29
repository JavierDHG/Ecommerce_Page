FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends postgresql-client && \
    rm -rf /var/lib/apt/lists/*

# Copiar el archivo 'requirements.txt' primero para instalar dependencias
COPY ./requirements.txt ./

# Instalar dependencias desde el archivo de backend
RUN pip install --no-cache-dir -r backend/requirements.txt

COPY . .

COPY wait-for-db.sh /wait-for-db.sh
RUN chmod +x /wait-for-db.sh

EXPOSE 8000

WORKDIR /app/backend

CMD ["gunicorn", "django_ecommerce_api.wsgi:application", "--bind", "0.0.0.0:8000"]
