# 🗄️ Configuración de MongoDB

## Problema: "Command find requires authentication"

Este error ocurre cuando MongoDB está configurado con autenticación pero la conexión no incluye las credenciales.

## Soluciones

### Opción 1: MongoDB Local sin Autenticación (Desarrollo)

Si estás usando MongoDB local sin autenticación, actualiza la URI en `.env`:

```env
MONGODB_URI=mongodb://localhost:27017/skillfast
```

### Opción 2: MongoDB con Docker (Con Autenticación)

Si estás usando Docker Compose con MongoDB, usa esta URI:

```env
MONGODB_URI=mongodb://admin:admin123@localhost:27017/skillfast?authSource=admin
```

### Opción 3: MongoDB Local con Autenticación

Si tienes MongoDB local con autenticación habilitada:

```env
MONGODB_URI=mongodb://usuario:contraseña@localhost:27017/skillfast?authSource=admin
```

### Opción 4: MongoDB Atlas (Cloud)

Si estás usando MongoDB Atlas:

```env
MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/skillfast?retryWrites=true&w=majority
```

## Pasos para Configurar

1. **Crear/Editar archivo `.env`** en `backend/`:

```env
# MongoDB - Opción sin autenticación (desarrollo local)
MONGODB_URI=mongodb://localhost:27017/skillfast

# O con autenticación (Docker)
# MONGODB_URI=mongodb://admin:admin123@localhost:27017/skillfast?authSource=admin
```

2. **Reiniciar el backend**:

```bash
cd backend
npm run start:dev
```

3. **Verificar conexión**: El backend debería conectarse sin errores.

## Notas Importantes

- ⚠️ **Nunca** subas el archivo `.env` con credenciales reales al repositorio
- 🔒 Para producción, usa variables de entorno seguras
- 🐳 Si usas Docker, las variables están en `docker-compose.yml`
- 📝 La URI debe incluir `?authSource=admin` si usas autenticación

## Comprobar Estado de MongoDB

```bash
# Verificar si MongoDB está corriendo
mongosh

# O con Docker
docker ps | grep mongo
```

## Solución Rápida

Para desarrollo rápido sin autenticación, simplemente actualiza `.env`:

```env
MONGODB_URI=mongodb://localhost:27017/skillfast
```

Y reinicia el backend.

