import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const colors = {
  amber700: '#b45309',
  amber900: '#92400e',
  stone50: '#f5f5f4',
  stone100: '#e7e5e4',
  stone200: '#d6d3d1',
  stone500: '#78716c',
  stone700: '#44403c',
  stone800: '#292524',
  stone900: '#1c1917',
  white: '#ffffff',
  red600: '#dc2626',
  red50: '#fef2f2',
};

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      await login(email.trim(), password);
      router.replace('/(main)/catalog');
    } catch (err: any) {
      setError(err.message || 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={colors.stone500} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.card}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Bienvenido de vuelta</Text>
              <Text style={styles.subtitle}>Inicia sesión para descubrir y comentar</Text>
            </View>

            {error ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={20} color={colors.red600} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.form}>
              <Input
                label="Correo electrónico"
                placeholder="ejemplo@correo.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                required
              />

              <Input
                label="Contraseña"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                required
              />

              <Button
                title={loading ? 'Ingresando...' : 'Ingresar'}
                onPress={handleSubmit}
                loading={loading}
                disabled={loading}
                icon={!loading && <Ionicons name="log-in" size={20} color={colors.white} />}
                style={styles.submitButton}
              />
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>¿No tienes cuenta? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                <Text style={styles.linkText}>Crear cuenta</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.stone50,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 0,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: colors.stone100,
  },
  titleContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.amber900,
    marginBottom: 8,
    fontFamily: 'Georgia',
  },
  subtitle: {
    fontSize: 14,
    color: colors.stone500,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.red50,
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 24,
    gap: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: colors.red600,
    fontWeight: '500',
  },
  form: {
    gap: 16,
    marginBottom: 24,
  },
  submitButton: {
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  footerText: {
    fontSize: 14,
    color: colors.stone500,
  },
  linkText: {
    fontSize: 14,
    color: colors.amber700,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
