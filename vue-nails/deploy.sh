#!/bin/bash

# Script de despliegue para servidor Debian 192.168.0.250
# Ejecutar desde el servidor Debian

SERVER_IP="192.168.0.250"
CONTAINER_NAME="estadisticas-vue"
IMAGE_NAME="estadisticas-frontend"
PORT="5174"

echo "🚀 Iniciando despliegue de Estadísticas Frontend..."

# Detener y eliminar contenedor existente si existe
if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
    echo "🛑 Deteniendo contenedor existente..."
    docker stop $CONTAINER_NAME
    docker rm $CONTAINER_NAME
fi

# Eliminar imagen anterior
if [ "$(docker images -q $IMAGE_NAME)" ]; then
    echo "🗑️  Eliminando imagen anterior..."
    docker rmi $IMAGE_NAME
fi

# Construir nueva imagen
echo "🔨 Construyendo imagen Docker..."
docker build -t $IMAGE_NAME .

# Ejecutar contenedor
echo "▶️  Ejecutando contenedor..."
docker run -d \
  --name $CONTAINER_NAME \
  -p $PORT:$PORT \
  --restart unless-stopped \
  $IMAGE_NAME

# Verificar estado
echo "✅ Verificando estado del contenedor..."
docker ps | grep $CONTAINER_NAME

echo ""
echo "✨ Despliegue completado!"
echo "📍 Aplicación disponible en: http://$SERVER_IP:$PORT"
echo ""
echo "📋 Comandos útiles:"
echo "  - Ver logs: docker logs -f $CONTAINER_NAME"
echo "  - Detener: docker stop $CONTAINER_NAME"
echo "  - Reiniciar: docker restart $CONTAINER_NAME"
echo "  - Estado: docker ps | grep $CONTAINER_NAME"
