# 🚀 SkillFast - Marketplace de Expertos On-Demand

SkillFast es una plataforma web que conecta usuarios con expertos profesionales a través de videollamadas, llamadas de audio o chat, con un sistema de pago por minuto.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Stack Tecnológico](#stack-tecnológico)
- [Arquitectura](#arquitectura)
- [Instalación](#instalación)
- [Uso](#uso)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)

## ✨ Características

### 🔐 Autenticación
- Registro/Login con email y contraseña
- OAuth con Google
- Sistema de roles (Cliente, Experto, Administrador)
- JWT con access y refresh tokens

### 👤 Perfiles
- **Cliente**: Datos personales, historial de sesiones
- **Experto**: Perfil público, categorías, skills, tarifa por minuto, disponibilidad

### 🔍 Búsqueda y Match
- Filtrar expertos por categoría, precio, rating, disponibilidad
- IA opcional para match automático

### 💬 Sesiones
- Chat en tiempo real (WebSockets)
- Llamadas de voz (WebRTC)
- Videollamadas (WebRTC)
- Temporizador de consumo
- Cargos automáticos por minuto

### 💳 Pagos
- Integración con Stripe/PayPal
- Cálculo automático de minutos
- Liquidación para expertos

### ⭐ Reviews
- Sistema de calificaciones
- Comentarios en sesiones
- Historial de reviews

### 👨‍💼 Panel Admin
- Gestión de usuarios y expertos
- Reportes y estadísticas
- Auditoría del sistema

## 🛠️ Stack Tecnológico

### Backend
- **Framework**: NestJS
- **Base de datos**: MongoDB con Mongoose
- **Real-time**: WebSockets (Socket.io)
- **Videollamadas**: WebRTC
- **Autenticación**: JWT + Passport
- **Pagos**: Stripe

### Frontend
- **Framework**: Angular 17
- **Comunicación**: Socket.io Client
- **WebRTC**: API nativa del navegador
- **Pagos**: Stripe.js

## 🏗️ Arquitectura

Ver [ARCHITECTURE.md](./ARCHITECTURE.md) para detalles completos de la arquitectura.

```
Frontend (Angular) ←→ REST API (NestJS) ←→ MongoDB
         ↕
    WebSockets
         ↕
    WebRTC P2P
```

## 📦 Instalación

### Prerrequisitos

- Node.js 20+
- Docker y Docker Compose (opcional)
- MongoDB (si no usas Docker)

### Opción 1: Docker (Recomendado)

```bash
# Clonar repositorio
git clone <repository-url>
cd proyect

# Copiar variables de entorno
cp backend/.env.example backend/.env
# Editar backend/.env con tus credenciales

# Iniciar todos los servicios
docker-compose up -d

# El backend estará en http://localhost:3000
# El frontend estará en http://localhost:4200
# MongoDB estará en localhost:27017
```

### Opción 2: Instalación Manual

#### Backend

```bash
cd backend
npm install
cp .env.example .env
# Editar .env con tus credenciales
npm run start:dev
```

#### Frontend

```bash
cd frontend
npm install
npm start
```

#### MongoDB

Asegúrate de tener MongoDB corriendo en `localhost:27017` o actualiza `MONGODB_URI` en el archivo `.env`.

## 🚀 Uso

### Desarrollo

1. **Backend**: `http://localhost:3000`
   - Swagger Docs: `http://localhost:3000/api/docs`
   - Health Check: `http://localhost:3000/api/health`

2. **Frontend**: `http://localhost:4200`

### Variables de Entorno

#### Backend (.env)

```env
# Server
PORT=3000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/skillfast

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_REFRESH_EXPIRES_IN=7d

# OAuth Google
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# Stripe
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Frontend URL
FRONTEND_URL=http://localhost:4200
```

## 📚 API Documentation

La documentación Swagger está disponible en:
- **Desarrollo**: `http://localhost:3000/api/docs`

### Endpoints Principales

#### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/refresh` - Refrescar token
- `GET /api/auth/google` - Login con Google

#### Usuarios
- `GET /api/users/profile` - Obtener perfil
- `PUT /api/users/profile` - Actualizar perfil

#### Expertos
- `GET /api/experts` - Listar expertos (con filtros)
- `GET /api/experts/:id` - Obtener experto
- `POST /api/experts` - Crear perfil de experto
- `PUT /api/experts/profile` - Actualizar perfil de experto

#### Sesiones
- `POST /api/sessions` - Crear sesión
- `GET /api/sessions` - Listar sesiones
- `PUT /api/sessions/:id/start` - Iniciar sesión
- `PUT /api/sessions/:id/end` - Finalizar sesión

#### Pagos
- `POST /api/payments/create` - Crear pago
- `POST /api/payments/confirm` - Confirmar pago
- `GET /api/payments/transactions` - Obtener transacciones

#### Reviews
- `POST /api/reviews` - Crear review
- `GET /api/reviews` - Listar reviews
- `GET /api/reviews/expert/:expertId` - Reviews de un experto

#### Admin
- `GET /api/admin/dashboard` - Dashboard con estadísticas
- `GET /api/admin/users` - Listar usuarios
- `GET /api/admin/experts` - Listar expertos
- `PUT /api/admin/users/:id/role` - Cambiar rol de usuario

## 🐳 Deployment

Ver [DEPLOYMENT.md](./DEPLOYMENT.md) para instrucciones detalladas de deployment.

### Docker Production

```bash
# Build de imágenes
docker-compose -f docker-compose.prod.yml build

# Iniciar servicios
docker-compose -f docker-compose.prod.yml up -d
```

## 🧪 Testing

### Backend

```bash
cd backend
npm run test
npm run test:e2e
```

### Frontend

```bash
cd frontend
npm run test
```

## 📝 Roadmap

Ver [ROADMAP.md](./ROADMAP.md) para el roadmap completo del proyecto.

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👥 Autores

- **SkillFast Team**

## 🙏 Agradecimientos

- NestJS Community
- Angular Team
- MongoDB Community

