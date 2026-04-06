# Traducción React → React Native (Bolivianlegendsmobileapp → andes-moviles)

## ✅ Traducción Completada

### 📦 Estructura de Carpetas Creada

```
andes-moviles/
├── app/
│   ├── _layout.tsx                    (Root layout con AuthProvider)
│   ├── modal.tsx                      (Modal ejemplo - se puede eliminar)
│   ├── (splash)/
│   │   ├── _layout.tsx               (Splash group layout)
│   │   └── splash.tsx                (Pantalla splash - 2.5s)
│   ├── (auth)/
│   │   ├── _layout.tsx               (Auth group layout)
│   │   ├── login.tsx                 (Login screen)
│   │   └── register.tsx              (Register screen)
│   ├── (main)/
│   │   ├── _layout.tsx               (Main group layout)
│   │   ├── catalog.tsx               (Catalog/home screen)
│   │   ├── legend-detail.tsx         (Legend detail - recibe {id})
│   │   ├── comments.tsx              (Comments screen - recibe {id})
│   │   └── payment.tsx               (Payment screen)
│   └── (tabs)/                        (Ejemplo - se puede eliminar)
├── context/
│   └── AuthContext.tsx               (Auth context con AsyncStorage)
├── components/
│   └── ui/
│       ├── Button.tsx                (Custom button component)
│       └── Input.tsx                 (Custom input component)
├── assets/
│   └── images/
│       └── splash-logo.png           (Imagen del splash)
├── .env                              (EXPO_PUBLIC_API_URL)
└── ...
```

### 🔄 Conversiones Realizadas

#### 1. AuthContext (localStorage → AsyncStorage)
- Cambiado `localStorage` a `AsyncStorage`
- Cambiado `fetch` a `axios`
- Tipos TypeScript preservados
- Lógica de login idéntica

#### 2. Componentes UI
- Input.tsx - Reemplaza `<input>` de HTML
- Button.tsx - Reemplaza `<button>` de HTML
- Ambos con estilos nativos y colores hex exactos

#### 3. Pantallas Traducidas

| React | React Native | Ruta |
|-------|--------------|------|
| Splash.tsx | app/(splash)/splash.tsx | /(splash)/splash |
| Login.tsx | app/(auth)/login.tsx | /(auth)/login |
| Register.tsx | app/(auth)/register.tsx | /(auth)/register |
| Catalog.tsx | app/(main)/catalog.tsx | /(main)/catalog |
| LegendDetail.tsx | app/(main)/legend-detail.tsx | /(main)/legend-detail |
| Comments.tsx | app/(main)/comments.tsx | /(main)/comments |
| Payment.tsx | app/(main)/payment.tsx | /(main)/payment |

#### 4. Flujo de Navegación
```
Splash (2.5s)
    ↓
¿Autenticado?
    ├─ SÍ → Catalog
    └─ NO → Login
         ├─ Register
         └─ Login → Catalog
              ├─ Legend Detail (con {id})
              │   ├─ Download Demo
              │   ├─ Full ($2)
              │   └─ Comments
              ├─ Comments (con {id})
              │   └─ Ver comentarios + crear nuevo
              └─ Payment
```

### 🎨 Paleta de Colores (Mantiene exactamente la misma)
```
amber700: #b45309  (naranja/ámbar principal)
amber900: #92400e  (ámbar oscuro)
amber300: #fcd34d  (ámbar claro)
stone50:  #f5f5f4  (fondo claro)
stone500: #78716c  (gris medio)
stone900: #1c1917  (gris oscuro)
red600:   #dc2626  (rojo para errores)
green600: #16a34a  (verde para éxito)
```

### 🔌 Conversiones de Librerías

| React | React Native |
|-------|--------------|
| lucide-react | @expo/vector-icons (Ionicons) |
| react-router-dom useNavigate | expo-router useRouter |
| localStorage | @react-native-async-storage/async-storage |
| fetch API | axios |
| Tailwind CSS | StyleSheet de React Native |
| Loading spinner CSS | ActivityIndicator |
| HTML forms | TextInput de React Native |

### 📝 Variables de Entorno
```env
EXPO_PUBLIC_API_URL=http://localhost:3000
```

### 🚀 Para Correr el Proyecto

```bash
cd andes-moviles
npm install  # (ya instalado)
expo start   # O: npx expo start
```

Opciones después de `expo start`:
- `i` - Abrir en iOS simulator
- `a` - Abrir en Android emulator
- `w` - Abrir en web
- `r` - Recargar
- `m` - Toggle menu
- `q` - Salir

### ✨ Características Implementadas

✅ Splash screen con animación de giro
✅ Login con validaciones
✅ Registro con validaciones
✅ Catálogo de leyendas con FlatList
✅ Detalle de leyenda con imagen hero
✅ Sistema de comentarios con rating
✅ Pantalla de pago (simulada)
✅ Logout desde catálogo
✅ Protected routes (login requerido para pago)
✅ Error handling y loading states
✅ Responsive design
✅ AsyncStorage para persistencia

### ⚠️ Notas Importantes

1. **Testing**: El proyecto está listo para testear con Expo
2. **Backend**: Se espera que esté en http://localhost:3000
3. **Assets**: splash-logo.png está copiado en assets/images/
4. **No-commits**: NO se hicieron commits como pediste
5. **TypeScript**: Todo typed correctamente
6. **Estructura**: Sigue las convenciones de Expo Router

### 🎯 Siguientes Pasos (Opcionales)

- Testear en emulador Android
- Testear en emulador iOS
- Testear en web con Expo
- Ajustar estilos según feedback
- Agregar más validaciones si es necesario
- Implementar pago real (Stripe/PayPal)
- Agregar más pantallas si es necesario

---
Traducción completada: 4 de abril, 2026
Estado: ✅ LISTO PARA USAR
