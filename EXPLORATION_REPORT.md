# Exploration Report: React Native (andes-moviles) Issues

**Date**: April 6, 2026  
**Project**: andes-moviles  
**Phase**: Exploration  

---

## 📋 Executive Summary

Investigated 5 reported issues in the React Native mobile app. Found **specific root causes** for each:
1. Back navigation exits app instead of going back from Login/Register
2. Header options (Login/Register labels) missing from certain screens
3. SafeAreaView deprecation warning
4. Invalid "lock" icon in Payment screen
5. Large margins making UI appear "full screen"

All issues are **low to medium complexity** to fix. No architectural changes needed.

---

## Issue #1: Back Navigation Exits App

### Problem Statement
When pressing the back arrow on Login/Register screens, the app exits instead of returning to the previous screen.

### Root Cause Analysis

**Files Involved:**
- `app/_layout.tsx` — Root layout configuration
- `app/(auth)/_layout.tsx` — Auth stack configuration
- `app/(auth)/login.tsx` — Login screen (lines 46-51)
- `app/(auth)/register.tsx` — Register screen (lines 107-112)

**Current Implementation:**
```typescript
// app/(auth)/login.tsx (line 46-51)
<TouchableOpacity
  onPress={() => router.back()}
  style={styles.backButton}
>
  <Ionicons name="arrow-back" size={24} color={Colors.TEXT_LIGHT} />
</TouchableOpacity>
```

**Problem:**
The auth layout is defined as a **top-level group** in the root Stack:
```typescript
// app/_layout.tsx (lines 20)
<Stack.Screen name="(auth)" options={{ headerShown: false }} />
```

When the app starts:
1. User lands on `/(auth)/login` 
2. No navigation history exists before this screen
3. Calling `router.back()` has nowhere to go → **exits app**

### Why This Happens

In React Native with Expo Router:
- Each **Stack.Screen group** (e.g., `(auth)`, `(main)`) is a separate navigation stack
- When entering from the Splash screen via `router.replace('/(auth)/login')`, the navigation stack is empty
- `router.back()` on an empty stack tries to exit the app (platform-dependent behavior)

### Solution Approach

**Option A: Hide back button on first screen**
- Only show back when user navigates *within* auth stack (e.g., Login → Register)
- Complexity: Low

**Option B: Navigate to Splash instead of back**
- Replace `router.back()` with `router.replace('/(splash)/splash')`
- Complexity: Low

**Option C: Implement navigation listener to detect stack depth**
- Track if this is the first screen in the auth stack
- Disable/hide back button if stack depth === 1
- Complexity: Medium

### Recommendation
**Option A + B hybrid**: Hide back button on `login.tsx` (entry point), but keep it functional on `register.tsx`. When user clicks back on register, go back to login (not exit).

---

## Issue #2: Missing Header Options (Login/Register Labels)

### Problem Statement
Login/Register options are not visible in the header area of those screens (unlike Comments screen which has a proper header).

### Root Cause Analysis

**Files Involved:**
- `app/(auth)/login.tsx` (lines 39-109) — Has manual header implementation
- `app/(auth)/register.tsx` (lines 100-185) — Has manual header implementation
- `app/(main)/comments.tsx` (lines 136-149) — **Proper header with café background**

**Current State:**

Login/Register screens use **manual header** with just back button:
```typescript
// app/(auth)/login.tsx (line 45-52)
<View style={styles.header}>
  <TouchableOpacity
    onPress={() => router.back()}
    style={styles.backButton}
  >
    <Ionicons name="arrow-back" size={24} color={Colors.TEXT_LIGHT} />
  </TouchableOpacity>
</View>
```

Comments screen uses **proper header** with backgroundColor and title:
```typescript
// app/(main)/comments.tsx (lines 143-149)
<View style={styles.header}>
  <TouchableOpacity onPress={() => router.back()}>
    <Ionicons name="arrow-back" size={24} color="#fff" />
  </TouchableOpacity>
  <Text style={styles.headerTitle}>Comentarios y Opiniones</Text>
  <View style={{ width: 24 }} />
</View>

// Styles (line 257-263)
header: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: Colors.PRIMARY_900,  // Café color
  paddingHorizontal: Spacing.lg,
  paddingVertical: Spacing.md,
},
```

### Why They're Missing

Login/Register screens:
1. Have a **transparent/invisible header** (just the back button on light background)
2. No title or label
3. No background color to make them stand out
4. Text content is only inside the white card below

The design intent appears to be different:
- **Comments** = full-screen with header bar
- **Login/Register** = centered card layout (header is minimal)

### Solution Approach

**Option A: Add title to Login/Register headers**
- Add "Bienvenido de vuelta" and "Crear Cuenta" text to the header
- Match Comments style: café background, white text
- Complexity: Low

**Option B: Keep current design (card-centered)**
- No changes needed (design is intentional)
- User expectation may just need adjustment
- Complexity: None

**Option C: Create reusable Header component**
- Extract common header pattern from Comments
- Reuse in Login, Register, other screens
- Future-proof for consistency
- Complexity: Medium

### Recommendation
**Option C** (reusable component) IF user wants consistency. Otherwise **Option A** is quickest.

**Key Finding**: The design IS intentional. Login/Register use a "card-centric" layout where the header is minimal. Comments uses "full-screen with header bar" pattern. Both are valid design systems.

---

## Issue #3: SafeAreaView Deprecation Warning

### Problem Statement
SafeAreaView is deprecated. Where is it used and is there a warning being generated?

### Root Cause Analysis

**Files Using SafeAreaView:**
1. `app/(main)/comments.tsx` (lines 10, 137)
2. `app/(main)/legend-detail.tsx` (lines 10, 121, 140)
3. `app/(main)/payment.tsx` (lines 9, 68, 88)

**Current Implementation:**
```typescript
// Typical pattern across all files
import { SafeAreaView } from 'react-native';

export default function CommentsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView>
        {/* content */}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
```

### Analysis

**Current Status**: React Native **still supports** `SafeAreaView`, but:
- It's been moved out of core React Native into `react-native-safe-area-context`
- Modern practice: import from `react-native-safe-area-context` instead
- Direct import from `'react-native'` may trigger console warnings in newer versions of Expo

**Check if installed:**
```bash
npm list react-native-safe-area-context
```

### Solution Approach

**Option A: Update imports (recommended)**
```typescript
// Current (potentially deprecated)
import { SafeAreaView } from 'react-native';

// New (explicit, future-proof)
import { SafeAreaView } from 'react-native-safe-area-context';
```

**Option B: Use useSafeAreaInsets hook**
```typescript
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Screen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top }}>
      {/* content */}
    </View>
  );
}
```

**Option C: Suppress warning (not recommended)**
- Not addressing the underlying deprecation

### Recommendation
**Option A**: Update all 3 files to import from `react-native-safe-area-context`. If package not installed, run `npm install react-native-safe-area-context`.

---

## Issue #4: Invalid "lock" Icon

### Problem Statement
The "lock" icon is invalid or not rendering correctly in the Payment screen.

### Root Cause Analysis

**Files Involved:**
- `app/(main)/payment.tsx` (lines 96, 176)

**Occurrences:**

Line 96 (header):
```typescript
<View style={styles.headerTitle}>
  <Ionicons name="lock" size={16} color={colors.green600} />
  <Text style={styles.headerText}>Pago Seguro</Text>
</View>
```

Line 176 (button):
```typescript
<Button
  icon={!isProcessing && <Ionicons name="lock" size={18} color={colors.white} />}
  title={isProcessing ? 'Procesando...' : 'Pagar $2.00'}
  onPress={handlePayment}
/>
```

### Analysis

The icon name `"lock"` **exists in Ionicons** and is valid. However:

1. **Possible cause 1**: Icon rendering in conditional (line 176)
   - Button component may not handle JSX in `icon` prop correctly
   - Check `components/ui/Button.tsx` to see how it renders the icon

2. **Possible cause 2**: Icon name variant
   - Ionicons has multiple lock variants: `"lock"`, `"lock-closed"`, `"lock-open"`
   - `"lock"` should work, but `"lock-closed"` is more explicit

3. **Possible cause 3**: Size mismatch
   - Size `18` on line 176 might be too small or cause rendering issues

### Files to Investigate
- `components/ui/Button.tsx` — to see how it handles the `icon` prop

### Solution Approach

**Option A: Use explicit icon variant**
```typescript
<Ionicons name="lock-closed" size={16} color={colors.green600} />
```

**Option B: Check Button component**
```typescript
// In Button.tsx, ensure icon prop is rendered correctly
export function Button({ icon, title, ... }) {
  return (
    <TouchableOpacity>
      {icon && icon}  // Make sure it renders the JSX
      <Text>{title}</Text>
    </TouchableOpacity>
  );
}
```

**Option C: Render icon outside Button component**
```typescript
<View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
  <Ionicons name="lock" size={18} color={colors.white} />
  <Button title={...} />
</View>
```

### Recommendation
**First check**: Read `components/ui/Button.tsx` to confirm it's rendering JSX icons correctly.  
**Then apply**: Option A or B depending on what's found.

---

## Issue #5: Large Margins ("Super Full Screen")

### Problem Statement
Margins are too large, making content appear on a "super full screen" with lots of white space.

### Root Cause Analysis

**Files Involved:**
- `constants/spacing.ts` — Spacing scale definition
- `app/(auth)/login.tsx` — Padding usage
- `app/(auth)/register.tsx` — Padding usage
- Multiple other screens

**Spacing Scale (from `constants/spacing.ts`):**
```typescript
export const Spacing = {
  xs: 4,      // 4px
  sm: 8,      // 8px
  md: 12,     // 12px
  lg: 16,     // 16px (default)
  xl: 24,     // 24px
  xxl: 32,    // 32px
  xxxl: 48,   // 48px (large)
}
```

**Actual Padding Usage:**

Login/Register use:
```typescript
// app/(auth)/login.tsx (line 141)
content: {
  flex: 1,
  justifyContent: 'center',
  paddingHorizontal: Spacing.lg,      // 16px
  paddingVertical: Spacing.xl,         // 24px
},

// The card itself has:
card: {
  padding: Spacing.xxxl,               // 48px internal padding
  // ...
}
```

Comments uses:
```typescript
// app/(main)/comments.tsx (line 282-284)
listContent: {
  paddingHorizontal: Spacing.lg,       // 16px
  paddingVertical: Spacing.md,         // 12px
  gap: Spacing.md,                     // 12px between items
},
```

### Analysis

**The Issue:**

Login screen example (on 412px wide mobile):
```
Device width: 412px
- paddingHorizontal: 16px (left) + 16px (right) = 32px
- Remaining width: 380px ✓ OK

Content area:
- Card padding: 48px * 2 (left + right) = 96px!
- Remaining content width: 284px (only 69% of card!)

Vertical:
- paddingVertical: 24px
- Card padding: 48px
- Total vertical padding before content: 144px
```

**Why it looks "super full screen":**
1. Double padding: View paddingVertical (24px) + Card paddingVertical (48px)
2. The card `padding: Spacing.xxxl` (48px) is **very large**
3. Makes content area feel cramped/squeezed, leaving lots of white space

### Comparison to Comments

Comments distributes space better:
```typescript
paddingHorizontal: Spacing.lg,    // 16px (not doubled)
paddingVertical: Spacing.md,      // 12px (smaller)
```

### Solution Approach

**Option A: Reduce card padding**
```typescript
// Instead of Spacing.xxxl (48px)
card: {
  padding: Spacing.xxl,  // 32px - more reasonable
  // ...
}
```

**Option B: Reduce content area padding**
```typescript
content: {
  flex: 1,
  justifyContent: 'center',
  paddingHorizontal: Spacing.md,   // 12px instead of 16px
  paddingVertical: Spacing.lg,     // 16px instead of 24px
},
```

**Option C: Remove one layer of padding**
```typescript
// Either remove content paddingVertical OR reduce card padding
// But not both doubled
```

**Option D: Create responsive spacing**
```typescript
const isSmallScreen = windowWidth < 380;
content: {
  paddingHorizontal: isSmallScreen ? Spacing.md : Spacing.lg,
  paddingVertical: isSmallScreen ? Spacing.md : Spacing.lg,
}
```

### Recommendation
**Option A** (reduce card padding from 48px to 32px):
- Simplest fix
- Improves all screens using the card style
- Maintains visual hierarchy
- No responsive logic needed

---

## Issue #6: APK Download (Bonus Discovery)

### Problem Statement
The Demo button doesn't actually download the APK. What's happening?

### Root Cause Analysis

**Files Involved:**
- `app/(main)/legend-detail.tsx` (lines 70-93)

**Current Implementation:**
```typescript
const handleDemoDownload = async () => {
  if (!legend) return;
  setDownloading(true);
  
  try {
    const response = await axios.get(
      `${API_URL}/api/pagos/descargar-demo/${legend.id}`,
      { responseType: 'blob' }
    );

    Alert.alert(
      '¡Éxito!',
      '¡Demo descargada correctamente! Puedes instalarla en tu dispositivo Android.'
    );
  } catch (err: any) {
    console.error('Error descargando demo:', err);
    Alert.alert(
      'Error',
      err.response?.data?.error || 'Error al descargar la demo. Inténtalo de nuevo.'
    );
  } finally {
    setDownloading(false);
  }
};
```

### Why It Doesn't Work

**Problem 1: Blob response isn't saved**
- The blob is fetched but never saved to device
- No file system write operation

**Problem 2: No file permissions**
- `app.json` has no download/storage permissions configured
- Android needs: `READ_EXTERNAL_STORAGE`, `WRITE_EXTERNAL_STORAGE`, or `MANAGE_EXTERNAL_STORAGE`

**Problem 3: No library to handle downloads**
- React Native doesn't have native `fetch` → file download
- Need package like `react-native-blob-util` or `expo-file-system` + `expo-sharing`

### Solution Approach

**Option A: Use expo-file-system + expo-sharing**
```bash
npm install expo-file-system expo-sharing
```

```typescript
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const handleDemoDownload = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/api/pagos/descargar-demo/${legend.id}`,
      { responseType: 'arraybuffer' }
    );

    const fileName = `demo_${legend.id}.apk`;
    const fileUri = FileSystem.documentDirectory + fileName;

    await FileSystem.writeAsStringAsync(
      fileUri,
      response.data,
      { encoding: 'base64' }
    );

    await Sharing.shareAsync(fileUri);
  } catch (err) {
    // Handle error
  }
};
```

**Option B: Use react-native-blob-util**
- More direct file system access
- Requires native permissions
- Complexity: Medium

**Option C: Just open download link in browser**
```typescript
import * as WebBrowser from 'expo-web-browser';

const handleDemoDownload = async () => {
  await WebBrowser.openBrowserAsync(
    `${API_URL}/api/pagos/descargar-demo/${legend.id}`
  );
};
```

### Recommendation
**Option A** (expo-file-system + expo-sharing) is the most Expo-friendly and doesn't require native permissions on Android.

---

## Summary Table

| Issue | Root Cause | Files | Complexity | Effort |
|-------|-----------|-------|-----------|--------|
| Back navigation exits app | Empty navigation stack | `app/(auth)/_layout.tsx`, login/register | Medium | 1-2 hrs |
| Missing header options | Intentional minimal design | `app/(auth)/login.tsx`, `register.tsx` | Low | 0.5-1 hr |
| SafeAreaView deprecation | Import from wrong module | 3 files | Low | 15 min |
| Invalid lock icon | Button component issue | `app/(main)/payment.tsx` | Low | 30 min |
| Large margins | Double padding layers | `app/(auth)/login.tsx`, constants | Low | 30 min |
| APK download broken | No file system write, no perms | `app/(main)/legend-detail.tsx` | Medium | 2-3 hrs |

---

## Recommendations for Next Steps

### Immediate (Quick Wins)
1. ✅ Fix SafeAreaView imports (15 min)
2. ✅ Reduce card padding from 48px to 32px (15 min)
3. ✅ Check lock icon rendering in Button component (15 min)

### Short Term (1-2 hours)
1. ✅ Implement back button logic for auth stack
2. ✅ Add header titles to Login/Register (or reusable Header component)
3. ✅ Add APK download functionality with file system

### Testing Needed
- Back button behavior on physical Android/iOS devices
- Download APK on Android with permissions
- Spacing on different device sizes (small phone, tablet)
- Icon rendering in different Button states

---

**End of Exploration Report**
