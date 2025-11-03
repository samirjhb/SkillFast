# 🚀 Guía de Deployment - SkillFast

## 📋 Tabla de Contenidos

- [Requisitos](#requisitos)
- [Preparación](#preparación)
- [Deployment con Docker](#deployment-con-docker)
- [Deployment Manual](#deployment-manual)
- [Variables de Entorno Producción](#variables-de-entorno-producción)
- [MongoDB Production](#mongodb-production)
- [Stripe Production](#stripe-production)
- [Monitoring y Logs](#monitoring-y-logs)

## 📦 Requisitos

- Servidor con Docker y Docker Compose (o Node.js 20+ y MongoDB)
- Dominio configurado (opcional pero recomendado)
- Certificado SSL (para HTTPS)
- Cuentas de servicios:
  - MongoDB Atlas (o MongoDB local)
  - Stripe (para pagos)
  - Google Cloud Console (para OAuth)

## 🔧 Preparación

### 1. Variables de Entorno

Crea archivos `.env` en producción con valores seguros:

```bash
# Backend .env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/skillfast
JWT_SECRET=<generate-strong-secret>
JWT_REFRESH_SECRET=<generate-strong-secret>
FRONTEND_URL=https://yourdomain.com
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

### 2. Seguridad

- **Nunca** commits archivos `.env` al repositorio
- Usa secretos fuertes para JWT
- Habilita HTTPS en producción
- Configura CORS correctamente
- Usa rate limiting

## 🐳 Deployment con Docker

### Opción 1: Docker Compose

```bash
# 1. Clonar repositorio
git clone <repository-url>
cd proyect

# 2. Configurar variables de entorno
cp backend/.env.example backend/.env
# Editar backend/.env

# 3. Build y start
docker-compose -f docker-compose.prod.yml up -d --build

# 4. Verificar logs
docker-compose logs -f
```

### docker-compose.prod.yml

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7.0
    restart: always
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_USER}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}
    networks:
      - skillfast-network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    restart: always
    environment:
      NODE_ENV: production
      MONGODB_URI: ${MONGODB_URI}
      JWT_SECRET: ${JWT_SECRET}
      # ... otras variables
    depends_on:
      - mongodb
    networks:
      - skillfast-network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    restart: always
    depends_on:
      - backend
    networks:
      - skillfast-network

  nginx:
    image: nginx:alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - backend
      - frontend
    networks:
      - skillfast-network

networks:
  skillfast-network:
    driver: bridge

volumes:
  mongodb_data:
```

## 📦 Deployment Manual

### Backend

```bash
# 1. Instalar dependencias
cd backend
npm ci --production

# 2. Build
npm run build

# 3. Iniciar con PM2
npm install -g pm2
pm2 start dist/main.js --name skillfast-backend

# 4. Configurar auto-start
pm2 startup
pm2 save
```

### Frontend

```bash
# 1. Instalar dependencias
cd frontend
npm ci

# 2. Build para producción
npm run build -- --configuration production

# 3. Servir con Nginx o similar
# Copiar dist/skillfast/* a /var/www/html
```

## 🌐 Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;

    # Frontend
    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSockets
    location /sessions {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

## 🗄️ MongoDB Production

### MongoDB Atlas (Recomendado)

1. Crear cuenta en MongoDB Atlas
2. Crear cluster
3. Configurar usuarios y whitelist IPs
4. Obtener connection string
5. Actualizar `MONGODB_URI` en `.env`

### MongoDB Local

```bash
# Instalar MongoDB
# Configurar replicación si es necesario
# Habilitar autenticación
# Backup automático
```

## 💳 Stripe Production

1. Crear cuenta Stripe
2. Obtener API keys de producción
3. Configurar webhooks:
   - URL: `https://yourdomain.com/api/payments/webhook`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Obtener webhook secret
5. Actualizar variables de entorno

## 📊 Monitoring y Logs

### PM2 Monitoring

```bash
# Ver estado
pm2 status

# Ver logs
pm2 logs skillfast-backend

# Monitoring dashboard
pm2 monit
```

### Docker Logs

```bash
# Ver logs
docker-compose logs -f backend

# Ver logs específicos
docker logs skillfast-backend
```

### Logs Centralizados

Considera usar:
- **Winston** para logging estructurado
- **Sentry** para error tracking
- **New Relic** o **Datadog** para APM

## 🔄 CI/CD

### GitHub Actions Example

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to server
        run: |
          ssh user@server "cd /app && git pull && docker-compose up -d --build"
```

## ✅ Checklist de Deployment

- [ ] Variables de entorno configuradas
- [ ] Base de datos configurada y conectada
- [ ] Stripe configurado con webhooks
- [ ] Google OAuth configurado
- [ ] HTTPS habilitado
- [ ] CORS configurado correctamente
- [ ] Rate limiting habilitado
- [ ] Logs configurados
- [ ] Monitoring activo
- [ ] Backups configurados
- [ ] Tests ejecutados
- [ ] Documentación actualizada

## 🐛 Troubleshooting

### Backend no inicia
- Verificar MongoDB connection
- Verificar variables de entorno
- Ver logs: `docker logs skillfast-backend`

### Frontend no carga
- Verificar que el backend está corriendo
- Verificar CORS settings
- Verificar variables de entorno de API URL

### WebSockets no funcionan
- Verificar que el puerto está abierto
- Verificar configuración de Nginx para WebSockets
- Verificar tokens JWT

## 📞 Soporte

Para problemas de deployment, crear un issue en el repositorio.

