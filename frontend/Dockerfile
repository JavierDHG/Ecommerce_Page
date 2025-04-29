# --- Fase de construcción ---
    FROM node:22-alpine as build

    WORKDIR /app
    COPY package*.json ./
    RUN npm install --include=optional
    COPY . .
    RUN npm run build  # Genera la carpeta /app/dist
    
    # --- Fase de producción ---
    FROM nginx:alpine
    
    # Copiar archivos construidos
    COPY --from=build /app/dist /usr/share/nginx/html
    
    # Copiar configuración de Nginx
    COPY nginx.conf /etc/nginx/conf.d/default.conf
    
    EXPOSE 80
    CMD ["nginx", "-g", "daemon off;"]