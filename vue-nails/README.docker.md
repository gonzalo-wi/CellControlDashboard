# Despliegue Docker - Estadísticas Frontend

## 🚀 Despliegue en Servidor Debian (192.168.0.250)

### Prerequisitos
- Docker y Docker Compose instalados en el servidor Debian
- Acceso SSH al servidor
- Puerto 5174 disponible

### Opción 1: Despliegue con Docker Compose (Recomendado)

```bash
# Desde tu máquina local, copiar archivos al servidor
scp -r . usuario@192.168.0.250:/opt/estadisticas-frontend/

# Conectar al servidor
ssh usuario@192.168.0.250

# Ir al directorio
cd /opt/estadisticas-frontend

# Construir y ejecutar
docker-compose up -d --build

# Ver logs
docker-compose logs -f
```

### Opción 2: Despliegue con Script

```bash
# Desde el servidor Debian
cd /opt/estadisticas-frontend

# Dar permisos de ejecución al script
chmod +x deploy.sh

# Ejecutar despliegue
./deploy.sh
```

### Opción 3: Comandos Docker Manuales

```bash
# Construir imagen
docker build -t estadisticas-frontend .

# Ejecutar contenedor
docker run -d \
  --name estadisticas-vue \
  -p 5174:5174 \
  --restart unless-stopped \
  estadisticas-frontend
```

## 🔧 Configuración

### Variables de Entorno

Puedes configurar la URL de la API modificando el archivo `src/services/config.js` o usando variables de entorno:

```bash
# En docker-compose.yml
environment:
  - VITE_API_HOST=http://192.168.0.55:8082
```

### Puerto Personalizado

Si necesitas cambiar el puerto, modifica:
1. `nginx.conf` - línea `listen 5174;`
2. `docker-compose.yml` - sección `ports`
3. `Dockerfile` - línea `EXPOSE`

## 📋 Comandos Útiles

### Ver logs en tiempo real
```bash
docker logs -f estadisticas-vue
```

### Detener contenedor
```bash
docker stop estadisticas-vue
# O con docker-compose
docker-compose down
```

### Reiniciar contenedor
```bash
docker restart estadisticas-vue
# O con docker-compose
docker-compose restart
```

### Ver estado
```bash
docker ps | grep estadisticas
```

### Entrar al contenedor
```bash
docker exec -it estadisticas-vue sh
```

### Actualizar aplicación
```bash
# Con docker-compose
docker-compose down
docker-compose up -d --build

# O con el script
./deploy.sh
```

## 🌐 Acceso

Una vez desplegado, la aplicación estará disponible en:
- **URL**: http://192.168.0.250:5174
- **Puerto**: 5174

## 🔒 Seguridad

### Nginx Headers
El archivo `nginx.conf` incluye headers de seguridad básicos:
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection

### HTTPS (Opcional)
Para producción, considera agregar un reverse proxy con SSL:

```bash
# Ejemplo con Nginx en el host
server {
    listen 443 ssl;
    server_name estadisticas.tudominio.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:5174;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🐛 Troubleshooting

### El contenedor no inicia
```bash
# Ver logs de error
docker logs estadisticas-vue

# Verificar puerto en uso
netstat -tulpn | grep 5174
```

### Error de construcción
```bash
# Limpiar cache de Docker
docker builder prune -a

# Reconstruir sin cache
docker build --no-cache -t estadisticas-frontend .
```

### Problemas con la API
- Verificar que el backend esté accesible en `http://192.168.0.55:8082`
- Revisar configuración en `src/services/config.js`
- Verificar credenciales de autenticación (admin/admin123)

## 📦 Estructura de Archivos Docker

```
vue-nails/
├── Dockerfile          # Configuración multi-stage build
├── docker-compose.yml  # Orquestación de contenedor
├── nginx.conf          # Configuración del servidor web
├── .dockerignore       # Archivos excluidos del build
├── deploy.sh           # Script automatizado de despliegue
└── README.docker.md    # Esta documentación
```

## 🔄 CI/CD (Opcional)

Para automatizar despliegues, puedes crear un webhook o usar GitHub Actions:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Debian Server

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Copy files to server
        uses: appleboy/scp-action@master
        with:
          host: 192.168.0.250
          username: ${{ secrets.SSH_USER }}
          key: ${{ secrets.SSH_KEY }}
          source: "."
          target: "/opt/estadisticas-frontend"
      
      - name: Deploy with docker-compose
        uses: appleboy/ssh-action@master
        with:
          host: 192.168.0.250
          username: ${{ secrets.SSH_USER }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /opt/estadisticas-frontend
            docker-compose down
            docker-compose up -d --build
```

## 📊 Monitoreo

### Recursos del contenedor
```bash
# Ver uso de CPU y RAM
docker stats estadisticas-vue

# Inspeccionar contenedor
docker inspect estadisticas-vue
```

### Health Check
Puedes agregar un health check al `Dockerfile`:

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5174 || exit 1
```
