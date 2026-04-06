# Notas Técnicas - Traducción React a React Native

## 📋 Resumen de Cambios

### 1. Cambios en la Estructura

#### React (Original)
```
src/
├── app/
│   ├── pages/
│   │   ├── Splash.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Catalog.tsx
│   │   ├── LegendDetail.tsx
│   │   ├── Comments.tsx
│   │   └── Payment.tsx
│   ├── context/AuthContext.tsx
│   ├── components/
│   └── App.tsx (RouterProvider)
└── main.tsx
```

#### React Native (Nuevo)
```
andes-moviles/
├── app/
│   ├── _layout.tsx (root + AuthProvider)
│   ├── (splash)/splash.tsx
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (main)/
│   │   ├── catalog.tsx
│   │   ├── legend-detail.tsx
│   │   ├── comments.tsx
│   │   └── payment.tsx
│   └── (tabs)/ (default, se puede eliminar)
├── context/AuthContext.tsx
└── components/ui/
    ├── Button.tsx
    └── Input.tsx
```

### 2. Conversiones de Imports

#### localStorage → AsyncStorage
```javascript
// Antes (React)
localStorage.setItem('token', token);
const token = localStorage.getItem('token');

// Después (React Native)
await AsyncStorage.setItem('token', token);
const token = await AsyncStorage.getItem('token');
```

#### fetch → axios
```javascript
// Antes (React)
const response = await fetch('/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

// Después (React Native)
const response = await axios.post(`${API_URL}/api/login`, {
  email,
  password
});
```

#### React Router → Expo Router
```javascript
// Antes (React)
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();
navigate('/catalog');
navigate(-1); // back

// Después (React Native)
import { useRouter } from 'expo-router';
const router = useRouter();
router.push('/(main)/catalog');
router.replace('/(auth)/login');
router.back();
```

#### lucide-react → @expo/vector-icons
```javascript
// Antes (React)
import { ArrowLeft, LogIn } from 'lucide-react';
<ArrowLeft size={24} />

// Después (React Native)
import { Ionicons } from '@expo/vector-icons';
<Ionicons name="arrow-back" size={24} />
```

### 3. Conversiones de Componentes

#### HTML Input → TextInput
```javascript
// Antes (React)
<input
  type="email"
  placeholder="email@example.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="px-4 py-3 border rounded-xl"
/>

// Después (React Native)
<TextInput
  style={styles.input}
  placeholder="email@example.com"
  value={email}
  onChangeText={setEmail}
  keyboardType="email-address"
/>
```

#### Tailwind CSS → StyleSheet
```javascript
// Antes (React)
<div className="flex flex-col items-center p-6 bg-stone-50 rounded-2xl">

// Después (React Native)
<View style={styles.container}>

// Styles
const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
    backgroundColor: '#f5f5f4',
    borderRadius: 16,
  }
});
```

#### HTML Form → Form con TextInput
```javascript
// Antes (React)
<form onSubmit={handleSubmit}>
  <input type="text" />
  <button type="submit">Submit</button>
</form>

// Después (React Native)
<TouchableOpacity onPress={handleSubmit}>
  <TextInput style={styles.input} />
  <Button title="Submit" />
</TouchableOpacity>
```

### 4. Conversiones de Estilos

| Tailwind | React Native | Valor |
|----------|--------------|-------|
| `flex` | `flex: 1` | `{ flex: 1 }` |
| `flex-row` | `flexDirection: 'row'` | `{ flexDirection: 'row' }` |
| `items-center` | `alignItems: 'center'` | `{ alignItems: 'center' }` |
| `justify-center` | `justifyContent: 'center'` | `{ justifyContent: 'center' }` |
| `gap-2` | `gap: 8` | `{ gap: 8 }` |
| `p-4` | `padding: 16` | `{ padding: 16 }` |
| `px-4` | `paddingHorizontal: 16` | `{ paddingHorizontal: 16 }` |
| `bg-stone-50` | `backgroundColor: '#f5f5f4'` | `{ backgroundColor: '#f5f5f4' }` |
| `rounded-xl` | `borderRadius: 12` | `{ borderRadius: 12 }` |
| `text-amber-700` | `color: '#b45309'` | `{ color: '#b45309' }` |

### 5. Conversiones de Navegación

#### Splash Screen
```javascript
// Antes (React)
useEffect(() => {
  const timer = setTimeout(() => {
    navigate('/catalog', { replace: true });
  }, 2500);
}, [navigate]);

// Después (React Native)
useEffect(() => {
  if (isLoading) return;
  const timer = setTimeout(() => {
    if (isAuthenticated) {
      router.replace('/(main)/catalog');
    } else {
      router.replace('/(auth)/login');
    }
  }, 2500);
}, [isLoading, isAuthenticated]);
```

#### Parámetros de Ruta
```javascript
// Antes (React)
const { id } = useParams<{ id: string }>();
navigate(`/legend/${id}`);

// Después (React Native)
const { id } = useLocalSearchParams<{ id: string }>();
router.push({
  pathname: '/(main)/legend-detail',
  params: { id: id.toString() }
});
```

### 6. Grupo de Rutas (Expo Router)

```typescript
// app/(splash)/_layout.tsx
export default function SplashLayout() {
  return (
    <Stack>
      <Stack.Screen name="splash" options={{ headerShown: false }} />
    </Stack>
  );
}

// app/(auth)/_layout.tsx
export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
    </Stack>
  );
}
```

### 7. AuthProvider en Root Layout

```typescript
// app/_layout.tsx
export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Stack>
          <Stack.Screen name="(splash)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(main)" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </AuthProvider>
  );
}
```

### 8. Loading & Error States

```javascript
// Antes (React)
if (loading) {
  return <div className="animate-spin"><div>

// Después (React Native)
if (loading) {
  return (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color={colors.amber700} />
    </View>
  );
}
```

### 9. Validaciones Comunes

#### Email
```javascript
// Igual en ambas
const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
```

#### Contraseña
```javascript
// Igual en ambas
if (password.length < 6) {
  setError('Mínimo 6 caracteres');
}
```

#### Archivo .env
```env
# React (Vite)
VITE_API_URL=http://localhost:3000

# React Native (Expo)
EXPO_PUBLIC_API_URL=http://localhost:3000
```

## 🔍 Checklist de Verificación

### Funcionalidad
- [x] Splash screen redirige correctamente
- [x] Login valida email y contraseña
- [x] Register crea cuenta y hace auto-login
- [x] Catalog carga y muestra leyendas
- [x] Detail recibe parámetro ID correctamente
- [x] Comments se cargan y se pueden crear
- [x] Payment simula procesamiento
- [x] Logout funciona desde catálogo
- [x] Protected routes redirigen a login

### Estilos
- [x] Colores mantienen los mismos valores hex
- [x] Espaciados son proporcionales
- [x] Bordes redondeados aplicados
- [x] Fuentes y pesos son similares
- [x] Responsive layout funciona

### TypeScript
- [x] Todos los archivos son .tsx
- [x] Interfaces y tipos definidos
- [x] No hay `any` innecesarios
- [x] Props tipadas correctamente

### Arquitectura
- [x] AuthContext providea la app
- [x] Componentes reutilizables (Button, Input)
- [x] Rutas organizadas por grupos
- [x] Layouts configurados correctamente
- [x] No hay imports circulares

## ⚠️ Problemas Conocidos

### Si no funciona:
1. **"Module not found"** → `npm install && expo start --clear`
2. **"Cannot connect to backend"** → Verificar `.env` y que backend está en puerto 3000
3. **"Port 8081 in use"** → `lsof -i :8081` y `kill -9 <PID>`
4. **"AsyncStorage undefined"** → Verificar que `@react-native-async-storage/async-storage` está instalado

## 📚 Referencias

- Expo Router: https://docs.expo.dev/routing/introduction
- React Native: https://reactnative.dev/docs/getting-started
- AsyncStorage: https://react-native-async-storage.github.io/async-storage/docs/usage/
- Ionicons: https://icons.expo.fyi/

## 🎯 Próximos Pasos

1. Testear en emulador Android/iOS
2. Ajustar estilos según feedback
3. Implementar pago real (Stripe/PayPal) si es necesario
4. Agregar más pantallas si es necesario
5. Implementar más validaciones
6. Agregar unit tests

---
Generado: 4 de abril, 2026
