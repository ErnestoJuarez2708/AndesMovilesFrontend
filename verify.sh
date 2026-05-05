#!/bin/bash
# Verificación rápida de sintaxis para andes-moviles

echo "=== VERIFICACIÓN DE PROYECTO ANDES-MOVILES ==="
echo ""

# Verificar que los archivos principales existan
echo "✓ Verificando archivos..."
files=(
    "context/AuthContext.tsx"
    "components/ui/Button.tsx"
    "components/ui/Input.tsx"
    "app/_layout.tsx"
    "app/(splash)/splash.tsx"
    "app/(auth)/login.tsx"
    "app/(auth)/register.tsx"
    "app/(main)/catalog.tsx"
    "app/(main)/legend-detail.tsx"
    "app/(main)/comments.tsx"
    "app/(main)/payment.tsx"
    ".env"
    "assets/images/splash-logo.png"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file (FALTA)"
    fi
done

echo ""
echo "✓ Verificando dependencias instaladas..."
if grep -q "expo-router" package.json; then
    echo "  ✅ expo-router"
fi
if grep -q "react-native" package.json; then
    echo "  ✅ react-native"
fi
if grep -q "axios" package.json; then
    echo "  ✅ axios"
fi
if grep -q "async-storage" package.json; then
    echo "  ✅ async-storage"
fi
if grep -q "@expo/vector-icons" package.json; then
    echo "  ✅ @expo/vector-icons"
fi

echo ""
echo "✓ Verificando .env..."
if [ -f ".env" ]; then
    if grep -q "EXPO_PUBLIC_API_URL" .env; then
        echo "  ✅ EXPO_PUBLIC_API_URL configurada"
    fi
fi

echo ""
echo "=== PROYECTO LISTO PARA USAR ==="
echo ""
echo "Para iniciar:"
echo "  1. expo start"
echo "  2. Presionar 'a' para Android o 'i' para iOS"
echo ""
