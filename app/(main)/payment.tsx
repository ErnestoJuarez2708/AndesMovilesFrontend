import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/Button';

const colors = {
  stone900: '#1c1917',
  stone800: '#292524',
  stone300: '#d6d3d1',
  stone200: '#d6d3d1',
  stone50: '#f5f5f4',
  white: '#ffffff',
  green600: '#16a34a',
  green100: '#dcfce7',
};

export default function PaymentScreen() {
  const router = useRouter();
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

  if (isSuccess) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={60} color={colors.green600} />
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
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.stone800} />
          </TouchableOpacity>
          <View style={styles.headerTitle}>
            <Ionicons name="lock" size={16} color={colors.green600} />
            <Text style={styles.headerText}>Pago Seguro</Text>
          </View>
          <View style={{ width: 24 }} />
        </View>

        {/* Payment Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total a pagar</Text>
          <Text style={styles.summaryAmount}>$2.00 USD</Text>
          <Text style={styles.summaryProduct}>Juego Completo: La Leyenda del Lago Titicaca</Text>
        </View>

        {/* Payment Form */}
        <View style={styles.formContainer}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Número de Tarjeta</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="card" size={18} color={colors.stone300} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="0000 0000 0000 0000"
                placeholderTextColor={colors.stone300}
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
                placeholderTextColor={colors.stone300}
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
                placeholderTextColor={colors.stone300}
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
              placeholderTextColor={colors.stone300}
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
            icon={!isProcessing && <Ionicons name="lock" size={18} color={colors.white} />}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.stone50,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.stone200,
    backgroundColor: colors.white,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.stone800,
  },
  summaryCard: {
    margin: 16,
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.stone200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryLabel: {
    fontSize: 13,
    color: colors.stone300,
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.stone800,
  },
  summaryProduct: {
    fontSize: 13,
    color: colors.stone300,
    marginTop: 8,
  },
  formContainer: {
    paddingHorizontal: 16,
    gap: 16,
  },
  formGroup: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.stone800,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.stone300,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: colors.white,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.stone800,
  },
  rowContainer: {
    flexDirection: 'row',
  },
  payButton: {
    marginTop: 8,
    marginBottom: 24,
  },
  cardBrands: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 16,
  },
  brandPlaceholder: {
    width: 40,
    height: 24,
    backgroundColor: colors.stone300,
    borderRadius: 4,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  successIcon: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.stone800,
    marginBottom: 8,
    fontFamily: 'Georgia',
  },
  successMessage: {
    fontSize: 16,
    color: colors.stone300,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  successButton: {
    width: '100%',
  },
});
