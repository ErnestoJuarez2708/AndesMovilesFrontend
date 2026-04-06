# 🔧 FIX: Network Error en Login

## Error que ves:
```
Login error: [AxiosError: Network Error]
```

## Causa:
En React Native, `localhost` no funciona como en web. El emulador/simulador no puede conectarse a `http://localhost:3000`.

## Solución (3 pasos):

### 1️⃣ Obtén tu IP local

**Windows:**
```bash
ipconfig
```
Busca la línea que dice "Dirección IPv4". Debería ser algo como `192.168.x.x`

**macOS/Linux:**
```bash
ifconfig | grep inet
```
Usa la IP que NO sea `127.0.0.1`

### 2️⃣ Actualiza `.env`

En la raíz de `andes-moviles/`, edita el archivo `.env`:

**ANTES:**
```
EXPO_PUBLIC_API_URL=http://localhost:3000
```

**DESPUÉS:**
```
EXPO_PUBLIC_API_URL=http://192.168.0.21:3000
```
(Reemplaza `192.168.0.21` con TU IP)

### 3️⃣ Reinicia todo

```bash
# Si tu backend está en otro proyecto, asegúrate que corra:
npm run dev

# En la carpeta andes-moviles:
expo start

# En Expo, presiona 'r' para recargar
```

## Verificación:

1. ✅ Backend corriendo en puerto 3000
2. ✅ `.env` tiene tu IP correcta
3. ✅ Estás en la misma red WiFi (o local network)
4. ✅ El emulador/simulador puede "ver" tu máquina

## Comandos útiles:

```bash
# Ver si puerto 3000 está abierto
netstat -an | grep 3000

# Probar conexión desde terminal
curl http://192.168.0.21:3000/api/leyendas

# Reiniciar Expo (desde el app)
press 'r' en la terminal de expo
```

## ¿Aún no funciona?

- Verifica que la IP no cambie (IP estática recomendada)
- Intenta `http://[TU_IP]:3000` en el navegador primero
- Si es Android Emulator, a veces `10.0.2.2:3000` funciona mejor
- Si es iOS Simulator, intenta `127.0.0.1:3000`

---

**El cambio está hecho ✅**
- El `.env` ya está actualizado a tu IP: `192.168.0.21:3000`
- El error handling en AuthContext es mejor ahora
- El splash va directo al catálogo sin pedir login
