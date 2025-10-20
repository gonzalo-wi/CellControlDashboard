# Build stage
FROM node:18-alpine as build-stage

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Build de producción
RUN npm run build

# Production stage
FROM nginx:alpine as production-stage

# Copiar archivos compilados
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copiar configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto 5174
EXPOSE 5174

CMD ["nginx", "-g", "daemon off;"]
