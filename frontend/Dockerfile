# Usar una imagen base oficial de Node.js
FROM node:22-alpine
# Usar una imagen base oficial de Node.js (ajusta la versión si es necesario)

# Establecer el directorio de trabajo dentro del contenedor
# Aquí estará tu aplicación React/Vite dentro del contenedor
WORKDIR /app 

# Copiar el archivo 'package.json' y 'package-lock.json' (o 'yarn.lock' si usas Yarn)
COPY package*.json ./



# Instalar las dependencias del proyecto
# O puedes usar 'yarn install' si usas Yarn
# Actualiza npm primero
# Fuerza instalar dependencias opcionales
RUN npm install -g npm@latest && \
    npm install --include=optional

# Copiar el resto del código del proyecto
COPY . .

# Construir la aplicación para producción (si estás listo para la producción)
# Esto crea los archivos estáticos en la carpeta 'dist'
# RUN npm run build  

# Exponer el puerto que usará Vite (puerto 5173 por defecto)
EXPOSE 5174

# Configurar el comando para ejecutar el servidor de desarrollo de Vite
# Esto arrancará Vite en modo desarrollo
CMD ["npm", "run", "dev"]
