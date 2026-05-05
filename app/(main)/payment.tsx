import { Button } from '@/components/ui/Button';
import { BorderRadius, Colors, Spacing } from '@/constants';
import { GlobalHeader } from '@/components/ui/GlobalHeader';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useNavigation } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

export default function PaymentScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardHolder, setCardHolder] = useState('');

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

  const handlePayment = () => {
    if (!cardNumber.trim() || !expiry.trim() || !cvc.trim() || !cardHolder.trim()) {
      alert('Por favor completa todos los campos');
      return;
    }

    setIsProcessing(true);

    // Simular procesamiento de pago
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 2000);
  };

  const handleBackPress = () => {
    if (navigation.canGoBack()) {
      router.back();
    } else {
      router.replace('/(main)/catalog');
    }
  };

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
              Gracias por tu compra. La descarga del juego completo ha comenzado.
            </Text>
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

      <View style={styles.mainContent}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.STONE_50,
  },
  mainContent: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
    paddingBottom: Spacing.xxl,
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
