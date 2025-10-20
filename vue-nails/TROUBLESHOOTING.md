# Guía de Troubleshooting - Build Docker

## 🔍 Problema Actual
El comando `npm run build` falla dentro del contenedor Docker.

## 📋 Pasos para Debuggear

### 1. Probar build local en el servidor
```bash
cd ~/CellControlDashboard/vue-nails

# Verificar que node_modules existe
ls -la node_modules

# Si no existe, instalar dependencias
npm install --legacy-peer-deps

# Probar build local
npm run build

# Verificar que se creó la carpeta dist
ls -la dist/
```

### 2. Ver logs detallados del build de Docker
```bash
# Build con output completo
docker build -t estadisticas-frontend . --progress=plain --no-cache 2>&1 | tee build.log

# Revisar el log
cat build.log | grep -i error
```

### 3. Build interactivo para debuggear
```bash
# Entrar al contenedor en la etapa de build
docker build --target build-stage -t debug-build .
docker run -it debug-build sh

# Dentro del contenedor:
cd /app
npm run build
ls -la dist/
```

### 4. Verificar memoria disponible
```bash
# Docker puede quedarse sin memoria
docker info | grep -i memory
free -h
```

### 5. Limpiar cache de Docker
```bash
# Limpiar todo
docker system prune -a --volumes

# Solo limpiar build cache
docker builder prune -a
```

## ⚡ Solución Rápida

Si el problema persiste, usa este Dockerfile alternativo más simple:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 5174
CMD ["nginx", "-g", "daemon off;"]
```

## 🐛 Errores Comunes

### Error: "JavaScript heap out of memory"
```bash
# Aumentar memoria de Node
# Agregar en package.json scripts:
"build": "NODE_OPTIONS='--max-old-space-size=4096' vite build"
```

### Error: "Cannot find module"
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Error: "ENOSPC: System limit for number of file watchers"
```bash
# Aumentar límite (como root)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

## 📊 Verificación Post-Deploy

Una vez que funcione:
```bash
# Ver logs
docker logs -f estadisticas-vue

# Probar endpoint
curl http://192.168.0.250:5174

# Verificar contenedor
docker ps | grep estadisticas
```

## 🔧 Comandos de Recuperación

Si algo sale mal:
```bash
# Detener y eliminar contenedor
docker stop estadisticas-vue
docker rm estadisticas-vue

# Eliminar imagen
docker rmi estadisticas-frontend

# Volver a intentar
docker-compose up -d --build
```
