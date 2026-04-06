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
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

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

export default function RegisterScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (error) setError('');
  };

  const handleSubmit = async () => {
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (!formData.username.trim()) {
      setError('El nombre de usuario es requerido');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        nombre: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
      };

      const response = await axios.post(`${API_URL}/api/auth/register`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { token } = response.data;

      // Auto-login after registration
      await login(formData.email, formData.password);
      router.replace('/(main)/catalog');
    } catch (err: any) {
      console.error('Error en el registro:', err);

      let errorMessage = 'Ocurrió un error al registrarse. Intenta nuevamente.';

      if (err.response) {
        const backendError = err.response.data?.message || err.response.data?.error;
        if (backendError) {
          errorMessage = backendError;
        } else if (err.response.status === 409) {
          errorMessage = 'El email ya está en uso';
        } else if (err.response.status === 400) {
          errorMessage = 'Datos inválidos. Verifica los campos';
        }
      } else if (err.request) {
        errorMessage =
          'No se pudo conectar al servidor. Verifica tu conexión o si el backend está corriendo';
      }

      setError(errorMessage);
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
              <Text style={styles.title}>Crear Cuenta</Text>
              <Text style={styles.subtitle}>Únete a la comunidad de Andes Móviles</Text>
            </View>

            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.form}>
              <Input
                label="Nombre de usuario"
                placeholder="juan_p"
                value={formData.username}
                onChangeText={(value) => handleChange('username', value)}
                required
              />

              <Input
                label="Correo electrónico"
                placeholder="juan@correo.com"
                value={formData.email}
                onChangeText={(value) => handleChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                required
              />

              <Input
                label="Contraseña"
                placeholder="••••••••"
                value={formData.password}
                onChangeText={(value) => handleChange('password', value)}
                secureTextEntry
                required
              />

              <Input
                label="Confirmar contraseña"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChangeText={(value) => handleChange('confirmPassword', value)}
                secureTextEntry
                required
              />

              <Button
                title={loading ? 'Creando cuenta...' : 'Registrarse'}
                onPress={handleSubmit}
                loading={loading}
                disabled={loading}
                icon={!loading && <Ionicons name="person-add" size={20} color={colors.white} />}
                style={styles.submitButton}
              />
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>¿Ya tienes cuenta? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                <Text style={styles.linkText}>Iniciar Sesión</Text>
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
    backgroundColor: colors.red50,
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 24,
  },
  errorText: {
    fontSize: 14,
    color: colors.red600,
    fontWeight: '500',
    textAlign: 'center',
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
