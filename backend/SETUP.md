# 🔧 Configuración del Backend

## Variables de Entorno

Para que el backend funcione correctamente, necesitas crear un archivo `.env` en el directorio `backend/` con las siguientes variables:

### Archivo `.env` requerido

Crea un archivo `.env` en `backend/.env` con el siguiente contenido:

```env
# Server
PORT=3000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/skillfast

# JWT
JWT_SECRET=skillfast-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=skillfast-super-secret-refresh-key-change-in-production
JWT_REFRESH_EXPIRES_IN=7d

# OAuth Google (opcional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# Stripe (opcional)
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# PayPal (opcional)
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
PAYPAL_MODE=sandbox

# Frontend URL
FRONTEND_URL=http://localhost:4200

# WebRTC Signaling
WEBRTC_SIGNALING_PORT=3001
```

## Pasos de Configuración

1. **Crear archivo `.env`**:
   ```bash
   cd backend
   cp .env.example .env
   # O crea el archivo manualmente con el contenido de arriba
   ```

2. **Configurar MongoDB**:
   - Asegúrate de tener MongoDB corriendo en `localhost:27017`
   - O actualiza `MONGODB_URI` con tu conexión de MongoDB

3. **Configurar JWT Secrets**:
   - Genera secretos seguros para producción
   - Para desarrollo, puedes usar los valores por defecto

4. **Opcional - Configurar OAuth Google**:
   - Ve a [Google Cloud Console](https://console.cloud.google.com/)
   - Crea un proyecto y configura OAuth
   - Obtén `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET`
   - Configura callback URL: `http://localhost:3000/auth/google/callback`

5. **Opcional - Configurar Stripe**:
   - Crea una cuenta en [Stripe](https://stripe.com/)
   - Obtén tus API keys de prueba
   - Configura webhooks en el dashboard de Stripe

## Iniciar el Backend

```bash
cd backend
npm install
npm run start:dev
```

El servidor estará disponible en `http://localhost:3000`

## Notas Importantes

- ⚠️ **NUNCA** subas el archivo `.env` al repositorio
- 🔒 Para producción, usa secretos fuertes y únicos
- 📝 Puedes usar `.env.example` como plantilla
- 🗄️ Asegúrate de que MongoDB esté corriendo antes de iniciar el backend

## Valores por Defecto

Si no configuras las variables de entorno, el backend usará valores por defecto para desarrollo:
- `JWT_SECRET`: `skillfast-super-secret-jwt-key-change-in-production`
- `JWT_REFRESH_SECRET`: `skillfast-super-secret-refresh-key-change-in-production`
- `MONGODB_URI`: `mongodb://localhost:27017/skillfast`

**⚠️ IMPORTANTE**: Cambia estos valores en producción por seguridad.

