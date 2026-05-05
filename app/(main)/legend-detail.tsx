import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { GlobalHeader } from '@/components/ui/GlobalHeader';
import { Colors, Spacing, BorderRadius } from '@/constants';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

interface Legend {
  id: number;
  titulo: string;
  descripcion: string;
  imagen_url: string;
}

export default function LegendDetailScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [legend, setLegend] = useState<Legend | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchLegend = async () => {
      if (!id) {
        setError('No se recibió ID de la leyenda');
        setLoading(false);
        return;
      }

      const numericId = parseInt(id);
      if (isNaN(numericId) || numericId <= 0) {
        setError(`ID inválido: "${id}"`);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${API_URL}/api/leyendas/${numericId}`);
        setLegend(response.data);
      } catch (err: any) {
        console.error('Error al cargar leyenda:', err);
        setError(err.response?.data?.error || err.message || 'Error al cargar la leyenda');
      } finally {
        setLoading(false);
      }
    };

    fetchLegend();
  }, [id]);

  const handleDemoDownload = async () => {
    if (!legend) return;

    setDownloading(true);
    try {
      const url = `${API_URL}/api/pagos/descargar-demo/${legend.id}`;
      
      const canOpen = await Linking.canOpenURL(url);
      
      if (canOpen) {
        await Linking.openURL(url);
        Alert.alert(
          '¡Descarga Iniciada!',
          'La descarga de la demo ha comenzado. Puedes instalarla en tu dispositivo Android.'
        );
      } else {
        Alert.alert(
          'Error',
          'No se pudo iniciar la descarga. Por favor, intenta de nuevo.'
        );
      }
    } catch (err: any) {
      console.error('Error descargando demo:', err);
      Alert.alert(
        'Error',
        'Error al descargar la demo. Inténtalo de nuevo.'
      );
    } finally {
      setDownloading(false);
    }
  };

  const handleFullClick = () => {
    if (!user) {
      Alert.alert(
        'Inicia Sesión',
        'Debes iniciar sesión para comprar el juego completo.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Ir a Login', onPress: () => router.replace('/(auth)/login') },
        ]
      );
      return;
    }
    if (!legend?.id) {
      Alert.alert('Error', 'ID del minijuego no disponible');
      return;
    }
    router.push({
      pathname: '/(main)/payment',
      params: { microjuegoId: legend.id.toString() }
    });
  };

  const handleBackPress = () => {
    if (navigation.canGoBack()) {
      router.back();
    } else {
      router.replace('/(main)/catalog');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <GlobalHeader
          back={true}
          title={legend?.titulo || 'Cargando...'}
          onBackPress={handleBackPress}
          user={user}
        />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.PRIMARY} />
          <Text style={styles.loadingText}>Cargando leyenda...</Text>
        </View>
      </View>
    );
  }

  if (error || !legend) {
    return (
      <View style={styles.container}>
        <GlobalHeader
          back={true}
          onBackPress={handleBackPress}
          user={user}
        />
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error || 'Leyenda no encontrada'}</Text>
          <Button
            title="Volver al Catálogo"
            onPress={() => router.replace('/(main)/catalog')}
            style={styles.retryButton}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GlobalHeader
        back={true}
        title={legend.titulo}
        onBackPress={handleBackPress}
        user={user}
      />

      <View style={styles.mainContent}>
        <ScrollView scrollEnabled style={styles.scrollView}>
          {/* Hero Image - now BELOW header (not absolute over) */}
          <View style={styles.heroContainer}>
            <Image source={{ uri: legend.imagen_url }} style={styles.heroImage} />
            <View style={styles.heroOverlay} />
          </View>

          {/* Description */}
          <View style={styles.contentContainer}>
            <Text style={styles.description}>{legend.descripcion}</Text>
          </View>
        </ScrollView>

        {/* Fixed Bottom Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            onPress={handleDemoDownload}
            disabled={downloading}
            style={styles.demoButton}
          >
            {downloading ? (
              <ActivityIndicator size="small" color={Colors.PRIMARY_900} />
            ) : (
              <>
                <Ionicons name="game-controller" size={20} color={Colors.PRIMARY_900} />
                <Text style={styles.demoButtonText}>Jugar Demo</Text>
              </>
            )}
          </TouchableOpacity>

          <Button
            title="Completo ($2)"
            onPress={handleFullClick}
            icon={<Ionicons name="card" size={20} color="#fff" />}
            style={styles.fullButton}
          />
        </View>

        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: '/(main)/comments',
              params: { id: legend.id.toString() },
            })
          }
          style={styles.commentsButton}
        >
          <Ionicons name="chatbubble-ellipses" size={20} color={Colors.STONE_800} />
          <Text style={styles.commentsButtonText}>Ver Comentarios</Text>
        </TouchableOpacity>
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
    position: 'relative',
  },
  scrollView: {
    flex: 1,
    paddingBottom: 160,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  heroContainer: {
    position: 'relative',
    height: 320,
    backgroundColor: Colors.STONE_300,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(28, 25, 23, 0.2)',
  },
  contentContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
  },
  description: {
    fontSize: 16,
    color: Colors.STONE_700,
    lineHeight: 24,
    fontFamily: 'Georgia',
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: 16,
    color: Colors.TEXT_LIGHT,
  },
  errorText: {
    fontSize: 16,
    color: Colors.TEXT_LIGHT,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  retryButton: {
    marginTop: Spacing.lg,
  },
  actionsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: Colors.STONE_200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  demoButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    backgroundColor: Colors.PRIMARY_100,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  demoButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.PRIMARY_900,
  },
  fullButton: {
    flex: 1,
  },
  commentsButton: {
    position: 'absolute',
    bottom: 80,
    right: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: '#fff',
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.STONE_200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  commentsButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.STONE_800,
  },
});
