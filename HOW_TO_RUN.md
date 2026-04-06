# Andes Móviles - React Native (Expo)

## 📱 Descripción

Aplicación móvil React Native usando Expo para descubrir y comentar sobre leyendas de La Paz, Bolivia.

Traducción completa del proyecto React `Bolivianlegendsmobileapp` a React Native.

## ⚠️ IMPORTANTE: Configuración de Network

### Error: "Network Error" al login

Si ves el error `[AxiosError: Network Error]`, **el problema es que React Native no puede conectar al backend**.

**Solución:**

1. Obtén tu IP local:
   ```bash
   # Windows
   ipconfig
   # Busca "Dirección IPv4"
   
   # macOS/Linux
   ifconfig | grep inet
   ```

2. Actualiza el `.env` en la raíz del proyecto:
   ```
   EXPO_PUBLIC_API_URL=http://192.168.0.21:3000
   ```
   (Reemplaza `192.168.0.21` con TU IP local)

3. Asegúrate que el backend está corriendo:
   ```bash
   # En otra terminal
   npm run dev
   # o el comando que uses para tu backend
   ```

4. Reinicia Expo:
   ```bash
   expo start
   # Presiona 'r' para recargar
   ```

**Por qué ocurre:**
- `localhost` en React Native (Android/iOS) no resuelve a `127.0.0.1`
- Necesitas la IP actual de tu máquina en la red local
- El emulador/simulador se ejecuta en un ambiente aislado

## 🚀 Inicio Rápido

### Prerequisitos
- Node.js 16+
- npm o yarn
- Expo CLI: `npm install -g expo-cli`

### Instalación

```bash
# Clonar/entrar al proyecto
cd andes-moviles

# Instalar dependencias (ya están instaladas, pero para referencia)
npm install
```

### Ejecutar la Aplicación

```bash
# Iniciar Expo
expo start
# o
npx expo start

# Luego elegir:
# - 'i' para abrir en iOS Simulator
# - 'a' para abrir en Android Emulator  
# - 'w' para abrir en web
# - 'r' para recargar
# - 'm' para ver menú
# - 'q' para salir
```

### Con Emulador Android

```bash
# Asegúrate que Android Emulator está corriendo
emulator -avd YourAVDName

# En otra terminal
cd andes-moviles
expo start

# Presiona 'a' para conectar a Android
```

### Con Emulador iOS (solo macOS)

```bash
# Asegúrate que Xcode Command Line Tools esté instalado
xcode-select --install

# En terminal
cd andes-moviles
expo start

# Presiona 'i' para conectar a iOS
```

## 🏗️ Estructura del Proyecto

```
andes-moviles/
├── app/
│   ├── _layout.tsx                 # Root layout con AuthProvider
│   ├── (splash)/splash.tsx         # Pantalla de bienvenida (2.5s)
│   ├── (auth)/
│   │   ├── login.tsx               # Login
│   │   └── register.tsx            # Registro
│   ├── (main)/
│   │   ├── catalog.tsx             # Catálogo de leyendas
│   │   ├── legend-detail.tsx       # Detalle de leyenda
│   │   ├── comments.tsx            # Comentarios
│   │   └── payment.tsx             # Pago simulado
│   └── _layout.tsx                 # Configuración de rutas
├── context/
│   └── AuthContext.tsx             # Context de autenticación
├── components/
│   └── ui/
│       ├── Button.tsx              # Componente botón
│       └── Input.tsx               # Componente input
├── assets/
│   └── images/splash-logo.png      # Logo del splash
├── .env                            # Variables de entorno
└── package.json
```

## 🔌 Configuración del Backend

El proyecto espera un backend en:
```
EXPO_PUBLIC_API_URL=http://localhost:3000
```

### Endpoints Esperados

```
POST   /api/auth/login              # Login
POST   /api/auth/register           # Registro
GET    /api/leyendas                # Listar leyendas
GET    /api/leyendas/:id            # Detalle de leyenda
GET    /api/comentarios/:id         # Listar comentarios
POST   /api/comentarios             # Crear comentario
GET    /api/pagos/descargar-demo/:id # Descargar demo
```

## 🎨 Paleta de Colores

```
Ámbar Principal:   #b45309 (amber-700)
Ámbar Oscuro:      #92400e (amber-900)
Ámbar Claro:       #fcd34d (amber-300)
Fondo Claro:       #f5f5f4 (stone-50)
Gris Medio:        #78716c (stone-500)
Gris Oscuro:       #1c1917 (stone-900)
Rojo (errores):    #dc2626 (red-600)
Verde (éxito):     #16a34a (green-600)
```

## 📱 Pantallas

### 1. Splash ✅
- Duración: 2.5 segundos
- Logo animado con rotación suave
- Indicador de carga pulsante
- Redirecciona a Login o Catalog según autenticación

### 2. Login ✅
- Email y contraseña
- Validaciones de entrada
- Manejo de errores
- Link a registro

### 3. Register ✅
- Nombre de usuario, email y contraseña
- Validación de contraseñas coincidentes
- Mínimo 6 caracteres
- Auto-login después del registro

### 4. Catalog ✅
- Lista de leyendas con imagen
- Descripción truncada
- Card con efecto hover
- Logout button
- Pull-to-refresh

### 5. Legend Detail ✅
- Imagen hero
- Descripción completa
- Botón "Jugar Demo"
- Botón "Completo ($2)"
- Link a comentarios

### 6. Comments ✅
- Listar comentarios con rating
- Sistema de estrellas (1-5)
- Crear comentario (solo autenticado)
- Validaciones
- Avatar de usuario

### 7. Payment ✅
- Formulario de tarjeta
- Validaciones de campos
- Simulación de pago (2s)
- Pantalla de éxito

## 🔐 Autenticación

- Tokens almacenados en **AsyncStorage**
- Persistencia entre sesiones
- Protected routes (redirección a login)
- Logout desde catálogo

## 🛠️ Tecnologías Usadas

- **React Native**: Framework móvil
- **Expo**: Herramientas para React Native
- **Expo Router**: Enrutamiento y navegación
- **TypeScript**: Tipado estático
- **AsyncStorage**: Almacenamiento local
- **Axios**: Cliente HTTP
- **@expo/vector-icons**: Íconos (Ionicons)

## 📦 Dependencias Principales

```json
{
  "react-native": "0.81.5",
  "expo": "~51.0.0",
  "expo-router": "^3.4.0",
  "@react-navigation/native": "^6.1.7",
  "@react-native-async-storage/async-storage": "^1.23.1",
  "axios": "^1.6.0",
  "@expo/vector-icons": "^15.1.1"
}
```

## ⚙️ Scripts

```bash
# Iniciar Expo
npm start              # o expo start

# Linter (si está configurado)
npm run lint

# Eject (cuidado: no reversible)
npm run eject
```

## 🧪 Testing

El proyecto está listo para ser testeado:

1. **En emulador Android**: `expo start` → `a`
2. **En emulador iOS**: `expo start` → `i`
3. **En web**: `expo start` → `w`
4. **En dispositivo físico**: Escanear QR con Expo Go

## 🐛 Troubleshooting

### "Cannot find module"
```bash
npm install
expo start --clear
```

### "Port 8081 already in use"
```bash
# Encontrar proceso en puerto 8081
netstat -ano | findstr :8081

# Matar proceso (Windows)
taskkill /PID <PID> /F
```

### "Backend no responde"
- Asegúrate que el backend está en `http://localhost:3000`
- Verifica la variable `.env`
- Si usas emulador Android, usa `10.0.2.2` en lugar de `localhost`

## 📚 Documentación

- [Expo Documentation](https://docs.expo.dev)
- [React Native Docs](https://reactnative.dev)
- [Expo Router Guide](https://docs.expo.dev/routing/introduction)

## 📝 Notas

- La app no tiene commits en git (como se pidió)
- Todos los archivos están en TypeScript
- Estilos usando React Native StyleSheet
- Sigue las convenciones de Expo Router
- Ready para producción después de ajustes

## 👤 Autor

Traducción completada: 4 de abril, 2026

## ✨ Estado

✅ **LISTO PARA USAR** - Todas las funcionalidades implementadas
