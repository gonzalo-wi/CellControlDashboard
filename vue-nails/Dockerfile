# Build stage
FROM node:18-alpine as build-stage

# Instalar dependencias del sistema
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Configurar npm para producción
ENV NODE_ENV=production
ENV CI=false

# Copiar package files
COPY package*.json ./

# Instalar dependencias (con legacy peer deps para evitar conflictos)
RUN npm ci --legacy-peer-deps --no-audit --prefer-offline

# Copiar código fuente
COPY . .

# Build de producción
RUN npm run build

# Verificar que dist fue creado
RUN ls -la /app/dist || (echo "ERROR: dist folder not created" && exit 1)

# Production stage
FROM nginx:alpine as production-stage

# Copiar archivos compilados
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copiar configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto 5174
EXPOSE 5174

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5174 || exit 1

CMD ["nginx", "-g", "daemon off;"]
