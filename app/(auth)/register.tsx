import React, { useState, useRef } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { GlobalHeader } from '@/components/ui/GlobalHeader';
import { Colors, Spacing, BorderRadius } from '@/constants';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export default function RegisterScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { login } = useAuth();
  const scrollRef = useRef<ScrollView>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

      await axios.post(`${API_URL}/api/auth/register`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

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
      <GlobalHeader
        back={true}
        onBackPress={() => {
          if (navigation.canGoBack()) {
            router.back();
          } else {
            router.replace('/(splash)/splash');
          }
        }}
        onLoginPress={() => router.replace('/(auth)/login')}
        onRegisterPress={() => router.replace('/(auth)/register')}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
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

              <View>
                <View>
                  <Input
                    label="Contraseña"
                    placeholder="••••••••"
                    value={formData.password}
                    onChangeText={(value) => handleChange('password', value)}
                    secureTextEntry={!showPassword}
                    required
                  />
                </View>
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIconButton}
                >
                  <Ionicons 
                    name={showPassword ? "eye" : "eye-off"} 
                    size={20} 
                    color={Colors.TEXT_LIGHT}
                  />
                </TouchableOpacity>
              </View>

              <View>
                <View>
                  <Input
                    label="Confirmar contraseña"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChangeText={(value) => handleChange('confirmPassword', value)}
                    secureTextEntry={!showConfirmPassword}
                    required
                  />
                </View>
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeIconButton}
                >
                  <Ionicons 
                    name={showConfirmPassword ? "eye" : "eye-off"} 
                    size={20} 
                    color={Colors.TEXT_LIGHT}
                  />
                </TouchableOpacity>
              </View>

              <Button
                title={loading ? 'Creando cuenta...' : 'Registrarse'}
                onPress={handleSubmit}
                loading={loading}
                disabled={loading}
                icon={!loading && <Ionicons name="person-add" size={20} color="#fff" />}
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: BorderRadius.xl,
    padding: Spacing.xxxl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: Colors.STONE_100,
  },
  titleContainer: {
    marginBottom: Spacing.xxxl,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.PRIMARY_900,
    marginBottom: Spacing.sm,
    fontFamily: 'Georgia',
  },
  subtitle: {
    fontSize: 14,
    color: Colors.TEXT_LIGHT,
  },
  errorContainer: {
    backgroundColor: Colors.ERROR_LIGHT,
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.xl,
  },
  errorText: {
    fontSize: 14,
    color: Colors.ERROR,
    fontWeight: '500',
  },
  form: {
    gap: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  eyeIconButton: {
    position: 'absolute',
    right: Spacing.md,
    top: '50%',
    transform: [{ translateY: -10 }],
    padding: Spacing.sm,
    zIndex: 5,
  },
  submitButton: {
    marginTop: Spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.xxxl,
  },
  footerText: {
    fontSize: 14,
    color: Colors.TEXT_LIGHT,
  },
  linkText: {
    fontSize: 14,
    color: Colors.PRIMARY,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
