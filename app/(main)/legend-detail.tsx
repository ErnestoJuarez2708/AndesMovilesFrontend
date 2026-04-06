import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

const colors = {
  amber700: '#b45309',
  amber100: '#fef3c7',
  amber900: '#92400e',
  stone50: '#f5f5f4',
  stone100: '#e7e5e4',
  stone200: '#d6d3d1',
  stone300: '#d6d3d1',
  stone500: '#78716c',
  stone700: '#44403c',
  stone800: '#292524',
  stone900: '#1c1917',
  white: '#ffffff',
  green600: '#16a34a',
};

interface Legend {
  id: number;
  titulo: string;
  descripcion: string;
  imagen_url: string;
}

export default function LegendDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [legend, setLegend] = useState<Legend | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchLegend();
  }, [id]);

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
    router.push('/(main)/payment');
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.amber700} />
        <Text style={styles.loadingText}>Cargando leyenda...</Text>
      </View>
    );
  }

  if (error || !legend) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error || 'Leyenda no encontrada'}</Text>
          <Button
            title="Volver al Catálogo"
            onPress={() => router.replace('/(main)/catalog')}
            style={styles.retryButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView scrollEnabled style={styles.scrollView}>
        {/* Header with back button */}
        <View style={styles.headerImage}>
          <Image source={{ uri: legend.imagen_url }} style={styles.image} />
          <View style={styles.headerOverlay} />
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.detailTitle}>{legend.titulo}</Text>
          </View>
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
            <ActivityIndicator size="small" color={colors.amber900} />
          ) : (
            <>
              <Ionicons name="game-controller" size={20} color={colors.amber900} />
              <Text style={styles.demoButtonText}>Jugar Demo</Text>
            </>
          )}
        </TouchableOpacity>

        <Button
          title="Completo ($2)"
          onPress={handleFullClick}
          icon={<Ionicons name="card" size={20} color={colors.white} />}
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
        <Ionicons name="chatbubble-ellipses" size={20} color={colors.stone800} />
        <Text style={styles.commentsButtonText}>Ver Comentarios</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.stone50,
  },
  scrollView: {
    flex: 1,
    paddingBottom: 160,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  headerImage: {
    position: 'relative',
    height: 320,
    backgroundColor: colors.stone300,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(28, 25, 23, 0.4)',
  },
  backButton: {
    position: 'absolute',
    top: 12,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  titleContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'rgba(28, 25, 23, 0.6)',
  },
  detailTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
    fontFamily: 'Georgia',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  description: {
    fontSize: 16,
    color: colors.stone700,
    lineHeight: 24,
    fontFamily: 'Georgia',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.stone500,
  },
  errorText: {
    fontSize: 16,
    color: colors.stone500,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    marginTop: 16,
  },
  actionsContainer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.stone50,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.stone200,
  },
  demoButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: colors.amber100,
    borderRadius: 12,
  },
  demoButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.amber900,
  },
  fullButton: {
    flex: 1,
  },
  commentsButton: {
    position: 'absolute',
    bottom: 12,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: colors.stone200,
    borderRadius: 12,
  },
  commentsButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.stone800,
  },
});
