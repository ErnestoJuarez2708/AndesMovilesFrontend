import { Button } from '@/components/ui/Button';
import { BorderRadius, Colors, Spacing } from '@/constants';
import { GlobalHeader } from '@/components/ui/GlobalHeader';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useNavigation, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import * as Linking from 'expo-linking';
import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export default function PaymentScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { user, token } = useAuth();
  const params = useLocalSearchParams();
  const microjuegoId = params?.microjuegoId as string;

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [downloadToken, setDownloadToken] = useState('');
  const [isLoadingIntent, setIsLoadingIntent] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Crear payment intent al cargar la pantalla
  useEffect(() => {
    crearPaymentIntent();
  }, [microjuegoId]);

  const crearPaymentIntent = async () => {
    try {
      setIsLoadingIntent(true);
      setErrorMessage('');
      
      if (!microjuegoId) {
        throw new Error('ID del minijuego no encontrado');
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/pagos/crear-intent`,
        { microjuego_id: microjuegoId },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data?.clientSecret) {
        setClientSecret(response.data.clientSecret);
      } else {
        throw new Error('No se recibió clientSecret del servidor');
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || 'Error al crear el payment intent';
      setErrorMessage(errorMsg);
      Alert.alert('Error', errorMsg);
    } finally {
      setIsLoadingIntent(false);
    }
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  const formatExpiry = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      setExpiry(`${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`);
    } else {
      setExpiry(cleaned);
    }
  };

  const handlePayment = async () => {
    if (!cardNumber.trim() || !expiry.trim() || !cvc.trim() || !cardHolder.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (!clientSecret) {
      Alert.alert('Error', 'El payment intent no se creó correctamente. Intenta de nuevo.');
      return;
    }

    try {
      setIsProcessing(true);
      setErrorMessage('');

      console.log('[handlePayment] Iniciando pago...');

      // Llamar a /test-completar-compra para simular webhook
      const response = await axios.post(
        `${API_BASE_URL}/api/pagos/test-completar-compra`,
        { microjuego_id: microjuegoId },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('[handlePayment] Respuesta del servidor:', response.data);

      if (response.data?.download_token) {
        console.log('[handlePayment] Token recibido:', response.data.download_token);
        setDownloadToken(response.data.download_token);
        setIsSuccess(true);
        Alert.alert('✅ Pago Completado', 'Ahora puedes descargar el juego completo. Presiona el botón "Descargar Full"');
      } else {
        throw new Error('No se recibió el token de descarga');
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || 'Error al procesar el pago';
      console.error('[handlePayment] Error:', errorMsg);
      setErrorMessage(errorMsg);
      Alert.alert('Error en el Pago', errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadFull = async () => {
    if (!downloadToken) {
      Alert.alert('Error', 'Token de descarga no disponible');
      return;
    }

    try {
      setIsProcessing(true);
      console.log('[handleDownloadFull] Iniciando descarga con token:', downloadToken);
      
      // Crear URL de descarga
      const downloadUrl = `${API_BASE_URL}/api/pagos/descargar-full?token=${downloadToken}`;
      
      console.log('📥 Abriendo URL:', downloadUrl);
      
      // Abrir URL directamente (navegador o app manager)
      await Linking.openURL(downloadUrl);
      
      Alert.alert(
        '✅ Descarga Iniciada',
        'La descarga del APK ha comenzado. Revisa tu carpeta de Descargas.'
      );
    } catch (err: any) {
      const errorMsg = err.message || 'Error al descargar el archivo';
      console.error('❌ Error en descarga:', errorMsg);
      Alert.alert('Error en Descarga', errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackPress = () => {
    if (navigation.canGoBack()) {
      router.back();
    } else {
      router.replace('/(main)/catalog');
    }
  };

  // Pantalla de loading del payment intent
  if (isLoadingIntent) {
    return (
      <View style={styles.container}>
        <GlobalHeader
          back={true}
          title="Pago Seguro"
          onBackPress={handleBackPress}
          user={user}
        />
        <View style={[styles.mainContent, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={Colors.PRIMARY_900} />
          <Text style={{ marginTop: Spacing.lg, color: Colors.TEXT_LIGHT }}>
            Preparando pago...
          </Text>
        </View>
      </View>
    );
  }

  if (isSuccess) {
    return (
      <View style={styles.container}>
        <GlobalHeader
          back={true}
          title="Pago Seguro"
          onBackPress={handleBackPress}
          user={user}
        />
        <View style={styles.mainContent}>
          <View style={styles.successContainer}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark-circle" size={60} color={Colors.SUCCESS} />
            </View>
            <Text style={styles.successTitle}>¡Pago Exitoso!</Text>
            <Text style={styles.successMessage}>
              Gracias por tu compra. La descarga del juego completo está lista.
            </Text>
            
            {/* Botón Descargar Full */}
            <Button
              title={isProcessing ? 'Descargando...' : 'Descargar Full'}
              onPress={handleDownloadFull}
              loading={isProcessing}
              disabled={isProcessing}
              icon={!isProcessing && <Ionicons name="download" size={18} color="#fff" />}
              style={styles.downloadButton}
            />
            
            {/* Botón Volver */}
            <Button
              title="Volver al Catálogo"
              onPress={() => router.replace('/(main)/catalog')}
              style={styles.successButton}
            />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GlobalHeader
        back={true}
        title="Pago Seguro"
        onBackPress={handleBackPress}
        user={user}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Error Banner */}
          {errorMessage && (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={18} color="#dc2626" />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          {/* Summary */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total a pagar</Text>
            <Text style={styles.summaryAmount}>$2.00 USD</Text>
            <Text style={styles.summaryProduct}>
              Juego Completo: La Leyenda del Lago Titicaca
            </Text>
          </View>

          {/* Payment Form */}
          <View style={styles.formContainer}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Número de Tarjeta</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="card" size={18} color={Colors.STONE_300} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="0000 0000 0000 0000"
                  placeholderTextColor={Colors.STONE_300}
                  value={cardNumber}
                  onChangeText={formatCardNumber}
                  keyboardType="numeric"
                  maxLength={19}
                  editable={!isProcessing}
                />
              </View>
            </View>

            <View style={styles.rowContainer}>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.label}>Vencimiento</Text>
                <TextInput
                  style={styles.input}
                  placeholder="MM/YY"
                  placeholderTextColor={Colors.STONE_300}
                  value={expiry}
                  onChangeText={formatExpiry}
                  keyboardType="numeric"
                  maxLength={5}
                  editable={!isProcessing}
                />
              </View>

              <View style={[styles.formGroup, { flex: 1, marginLeft: 16 }]}>
                <Text style={styles.label}>CVC</Text>
                <TextInput
                  style={styles.input}
                  placeholder="123"
                  placeholderTextColor={Colors.STONE_300}
                  value={cvc}
                  onChangeText={setCvc}
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                  editable={!isProcessing}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Nombre en la tarjeta</Text>
              <TextInput
                style={styles.input}
                placeholder="Juan Pérez"
                placeholderTextColor={Colors.STONE_300}
                value={cardHolder}
                onChangeText={setCardHolder}
                editable={!isProcessing}
              />
            </View>

            <Button
              title={isProcessing ? 'Procesando...' : 'Pagar $2.00'}
              onPress={handlePayment}
              loading={isProcessing}
              disabled={isProcessing}
              icon={!isProcessing && <Ionicons name="lock-closed" size={18} color="#fff" />}
              style={styles.payButton}
            />
          </View>

          {/* Card brands */}
          <View style={styles.cardBrands}>
            <View style={styles.brandPlaceholder} />
            <View style={styles.brandPlaceholder} />
            <View style={styles.brandPlaceholder} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.STONE_50,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  errorBanner: {
    backgroundColor: '#fee2e2',
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderLeftWidth: 4,
    borderLeftColor: '#dc2626',
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: '#991b1b',
    fontWeight: '500',
  },
  summaryCard: {
    backgroundColor: Colors.PRIMARY_900,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
    marginBottom: Spacing.xl,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.PRIMARY_100,
    marginBottom: Spacing.sm,
  },
  summaryAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.PRIMARY_100,
    marginBottom: Spacing.md,
    fontFamily: 'Georgia',
  },
  summaryProduct: {
    fontSize: 12,
    color: Colors.PRIMARY_100,
    textAlign: 'center',
    opacity: 0.8,
  },
  formContainer: {
    gap: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  formGroup: {
    gap: Spacing.sm,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.STONE_800,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.STONE_200,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    backgroundColor: '#fff',
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.md,
    fontSize: 14,
    color: Colors.STONE_800,
  },
  rowContainer: {
    flexDirection: 'row',
    gap: 0,
  },
  payButton: {
    marginTop: Spacing.lg,
  },
  downloadButton: {
    marginBottom: Spacing.md,
    backgroundColor: Colors.SUCCESS,
  },
  cardBrands: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.lg,
    marginTop: Spacing.xl,
  },
  brandPlaceholder: {
    width: 50,
    height: 32,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.STONE_200,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  successIcon: {
    marginBottom: Spacing.xl,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.PRIMARY_900,
    marginBottom: Spacing.md,
    fontFamily: 'Georgia',
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 14,
    color: Colors.TEXT_LIGHT,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 20,
  },
  successButton: {
    minWidth: 200,
  },
});
