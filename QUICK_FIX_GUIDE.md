# 🔧 Guía Rápida: Qué Cambiar en Cada Archivo

## Issue #1: Back Navigation Exit (Media)

### File: `app/(auth)/_layout.tsx`

**Opción A: Agregar listener para detectar pantalla inicial**
```typescript
// ANTES
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false, animation: 'slide_from_right' }} />
      <Stack.Screen name="register" options={{ headerShown: false, animation: 'slide_from_right' }} />
    </Stack>
  );
}

// DESPUÉS
import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function AuthLayout() {
  const router = useRouter();

  useEffect(() => {
    // Prevenir accidental back exit
    const unsubscribe = router?.canGoBack?.(() => {
      // Si no hay historial, ir a splash
      if (!router.canGoBack()) {
        router.replace('/(splash)/splash');
      }
    });
    return unsubscribe;
  }, [router]);

  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false, animation: 'slide_from_right' }} />
      <Stack.Screen name="register" options={{ headerShown: false, animation: 'slide_from_right' }} />
    </Stack>
  );
}
```

**Opción B (MÁS SIMPLE): Cambiar back button a ir a Splash**

### File: `app/(auth)/login.tsx`

```typescript
// ANTES (línea 46-51)
<TouchableOpacity
  onPress={() => router.back()}
  style={styles.backButton}
>
  <Ionicons name="arrow-back" size={24} color={Colors.TEXT_LIGHT} />
</TouchableOpacity>

// DESPUÉS
<TouchableOpacity
  onPress={() => router.replace('/(auth)/login')}  // Ir a login (o Splash)
  style={styles.backButton}
>
  <Ionicons name="arrow-back" size={24} color={Colors.TEXT_LIGHT} />
</TouchableOpacity>
```

### File: `app/(auth)/register.tsx`

```typescript
// ANTES (línea 107-112)
<TouchableOpacity
  onPress={() => router.back()}
  style={styles.backButton}
>
  <Ionicons name="arrow-back" size={24} color={Colors.TEXT_LIGHT} />
</TouchableOpacity>

// DESPUÉS
<TouchableOpacity
  onPress={() => router.back()}  // Aquí SÍ funciona porque hay historial
  style={styles.backButton}
>
  <Ionicons name="arrow-back" size={24} color={Colors.TEXT_LIGHT} />
</TouchableOpacity>
```

---

## Issue #2: Header Options (Baja)

### File: `app/(auth)/login.tsx`

```typescript
// ANTES (línea 45-52)
<View style={styles.header}>
  <TouchableOpacity
    onPress={() => router.back()}
    style={styles.backButton}
  >
    <Ionicons name="arrow-back" size={24} color={Colors.TEXT_LIGHT} />
  </TouchableOpacity>
</View>

// DESPUÉS (copiar patrón de Comments)
<View style={styles.header}>
  <TouchableOpacity
    onPress={() => router.back()}
    style={styles.backButton}
  >
    <Ionicons name="arrow-back" size={24} color="#fff" />
  </TouchableOpacity>
  <Text style={styles.headerTitle}>Bienvenido de vuelta</Text>
  <View style={{ width: 24 }} />
</View>

// AGREGAR STYLES (después del último style):
headerTitle: {
  fontSize: 16,
  fontWeight: '700',
  color: '#FFFBEB',
  letterSpacing: 0.3,
},

// CAMBIAR header style:
header: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: Colors.PRIMARY_900,  // ← Agregar color
  paddingHorizontal: Spacing.lg,
  paddingVertical: Spacing.md,
},
```

### File: `app/(auth)/register.tsx`

```typescript
// Mismo cambio que login.tsx, pero con:
<Text style={styles.headerTitle}>Crear Cuenta</Text>
```

---

## Issue #3: SafeAreaView Deprecation (Muy Baja)

### File: `app/(main)/comments.tsx`

```typescript
// ANTES (línea 10)
import { SafeAreaView } from 'react-native';

// DESPUÉS
import { SafeAreaView } from 'react-native-safe-area-context';
```

### File: `app/(main)/legend-detail.tsx`

```typescript
// ANTES (línea 10)
import { SafeAreaView } from 'react-native';

// DESPUÉS
import { SafeAreaView } from 'react-native-safe-area-context';
```

### File: `app/(main)/payment.tsx`

```typescript
// ANTES (línea 9)
import { SafeAreaView } from 'react-native';

// DESPUÉS
import { SafeAreaView } from 'react-native-safe-area-context';
```

**Verificar que está instalado:**
```bash
npm list react-native-safe-area-context
# Si no, instalar:
npm install react-native-safe-area-context
```

---

## Issue #4: Lock Icon (Baja)

⚠️ **PRIMERO**: Leer `components/ui/Button.tsx` para ver cómo renderiza `icon` prop.

### Opción 1: Si Button NO renderiza JSX

File: `app/(main)/payment.tsx`

```typescript
// ANTES (línea 171-178)
<Button
  title={isProcessing ? 'Procesando...' : 'Pagar $2.00'}
  onPress={handlePayment}
  loading={isProcessing}
  disabled={isProcessing}
  icon={!isProcessing && <Ionicons name="lock" size={18} color={colors.white} />}
  style={styles.payButton}
/>

// DESPUÉS
<View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
  {!isProcessing && <Ionicons name="lock" size={18} color={colors.white} />}
  <Button
    title={isProcessing ? 'Procesando...' : 'Pagar $2.00'}
    onPress={handlePayment}
    loading={isProcessing}
    disabled={isProcessing}
    style={styles.payButton}
  />
</View>
```

### Opción 2: Si Button SÍ renderiza JSX, usar variante explícita

```typescript
// Cambiar de:
icon={!isProcessing && <Ionicons name="lock" size={18} color={colors.white} />}

// A:
icon={!isProcessing && <Ionicons name="lock-closed" size={18} color={colors.white} />}
```

---

## Issue #5: Large Margins (Muy Baja)

### File: `app/(auth)/login.tsx`

```typescript
// ANTES (línea 144-147)
card: {
  backgroundColor: '#fff',
  borderRadius: BorderRadius.xl,
  padding: Spacing.xxxl,  // ← 48px
  // ...
},

// DESPUÉS
card: {
  backgroundColor: '#fff',
  borderRadius: BorderRadius.xl,
  padding: Spacing.xxl,  // ← Cambiar a 32px
  // ...
},
```

### File: `app/(auth)/register.tsx`

```typescript
// ANTES (línea 224)
padding: Spacing.xxxl,  // ← 48px

// DESPUÉS
padding: Spacing.xxl,  // ← Cambiar a 32px
```

---

## 🎁 Bonus: APK Download (Baja - Quick Fix)

### File: `app/(main)/legend-detail.tsx`

**OPCIÓN RÁPIDA (WebBrowser - 10 min):**

```bash
npm install expo-web-browser
```

```typescript
// AGREGAR IMPORT (línea 15)
import * as WebBrowser from 'expo-web-browser';

// REEMPLAZAR handleDemoDownload (línea 70-93)
const handleDemoDownload = async () => {
  if (!legend) return;

  try {
    await WebBrowser.openBrowserAsync(
      `${API_URL}/api/pagos/descargar-demo/${legend.id}`
    );
  } catch (err: any) {
    console.error('Error abriendo descarga:', err);
    Alert.alert(
      'Error',
      'No se pudo abrir la descarga. Intenta nuevamente.'
    );
  }
};
```

---

## ✅ Checklist de Cambios

### Quick Wins (hoy - 30 min)
- [ ] SafeAreaView imports en 3 archivos (15 min)
- [ ] Reducir card padding de 48→32px en login + register (5 min)
- [ ] Leer Button.tsx y fix lock icon (10 min)

### Medium (próxima sesión - 1-2 hrs)
- [ ] Back navigation en auth stack (30 min)
- [ ] Header options en Login/Register (30 min)
- [ ] APK download con WebBrowser (10 min)

---

## 📝 Testing After Changes

```
1. SafeAreaView changes:
   - npm start
   - Revisar console para warnings
   
2. Padding changes:
   - Ver que el contenido se vea mejor en Login/Register
   - Revisar en emulador small + large screen
   
3. Back navigation:
   - Presionar back en Login → no debe salir app
   - Presionar back en Register → debe ir a Login
   
4. Lock icon:
   - Verificar que se vea en Payment screen
   - Revisar en estado loading y normal
   
5. APK download:
   - Presionar "Jugar Demo" en legend-detail
   - Debe abrir navegador (WebBrowser option)
```

---

**Generado**: 6 de abril, 2026
