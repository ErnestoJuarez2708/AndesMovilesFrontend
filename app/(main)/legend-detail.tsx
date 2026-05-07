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
  Platform,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { GlobalHeader } from '@/components/ui/GlobalHeader';
import { Colors, Spacing, BorderRadius } from '@/constants';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
const { width: screenWidth } = Dimensions.get('window');

interface Legend {
  id: number;
  titulo: string;
  descripcion: string;
  imagen_url: string;
  autor_referencia?: string;
  youtube_video_id?: string;
}

/**
 * Component to render description with drop cap styling
 * First letter of each paragraph is large and orange
 */
function RenderDescriptionWithDropCap({ text }: { text: string }) {
  if (!text) return null;

  // Split by paragraph (double newline or specific markers)
  const paragraphs = text.split(/\n\n+|\r\n\r\n+/).filter(p => p.trim());

  return (
    <>
      {paragraphs.map((para, idx) => {
        const trimmed = para.trim();
        if (!trimmed) return null;

        const firstChar = trimmed[0];
        const rest = trimmed.slice(1);

        return (
          <View key={idx} style={styles.paragraphContainer}>
            <View style={styles.dropCapContainer}>
              <Text style={styles.dropCap}>{firstChar}</Text>
              <Text style={styles.paragraphText}>{rest}</Text>
            </View>
          </View>
        );
      })}
    </>
  );
}

/**
 * Extract YouTube video ID from various URL formats
 */
function extractYoutubeId(urlOrId: string): string | null {
  if (!urlOrId) return null;

  // If it's already just an ID (11 chars, alphanumeric + - _)
  if (/^[a-zA-Z0-9_-]{11}$/.test(urlOrId)) {
    return urlOrId;
  }

  // Extract from various YouTube URL formats
  let match;
  
  // Format: https://youtube.com/shorts/VIDEO_ID or https://www.youtube.com/shorts/VIDEO_ID
  match = urlOrId.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (match) return match[1];

  // Format: https://youtu.be/VIDEO_ID
  match = urlOrId.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (match) return match[1];

  // Format: https://www.youtube.com/watch?v=VIDEO_ID
  match = urlOrId.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/);
  if (match) return match[1];

  // Format: youtube.com/watch?v=VIDEO_ID (without https://)
  match = urlOrId.match(/v=([a-zA-Z0-9_-]{11})/);
  if (match) return match[1];

  return null;
}

/**
 * YouTube Short video player using WebView
 */
function YouTubeShortPlayer({ urlOrId }: { urlOrId: string }) {
  const videoId = extractYoutubeId(urlOrId);

  if (!videoId) {
    console.warn('Invalid YouTube URL or ID:', urlOrId);
    return null;
  }

  return (
    <View style={styles.youtubeContainer}>
      <TouchableOpacity 
        style={styles.youtubePlaceholder}
        onPress={() => {
          const url = `https://www.youtube.com/watch?v=${videoId}`;
          Linking.openURL(url);
        }}
      >
        <View style={styles.youtubePlayButton}>
          <Ionicons name="play" size={60} color="#fff" />
        </View>
        <Text style={styles.youtubePlayText}>Tocar para ver video</Text>
      </TouchableOpacity>
    </View>
  );
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
        console.log('Legend loaded:', response.data);
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
          title="Cargando..."
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
          title="Error"
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
    <SafeAreaView style={styles.container}>
      <GlobalHeader
        back={true}
        title={legend.titulo}
        onBackPress={handleBackPress}
        user={user}
      />

      <View style={styles.mainContainer}>
        {/* Scrollable Content */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContentContainer}
          showsVerticalScrollIndicator={true}
        >
          {/* Hero Image */}
          <View style={styles.heroContainer}>
            <Image 
              source={{ uri: legend.imagen_url }} 
              style={styles.heroImage}
              resizeMode="cover"
            />
            <View style={styles.heroOverlay} />
          </View>

          {/* Content Container with Dark Background */}
          <View style={styles.contentContainer}>
            {/* Tags */}
            <View style={styles.tagsContainer}>
              <View style={styles.tagHistoria}>
                <Ionicons name="bookmark" size={12} color={Colors.WARNING} />
                <Text style={styles.tagText}>HISTORIA COMPLETA</Text>
              </View>
              <View style={styles.tagBolivia}>
                <Text style={styles.tagBoliviaText}>BOLIVIA</Text>
              </View>
            </View>

            {/* Title and Subtitle */}
            <Text style={styles.title}>{legend.titulo}</Text>
            <Text style={styles.subtitle}>{legend.autor_referencia || 'La leyenda ancestral'}</Text>

            {/* YouTube Shorts Video Player */}
            {legend.youtube_video_id && (
              <YouTubeShortPlayer urlOrId={legend.youtube_video_id} />
            )}

            {/* Description with Drop Cap styling */}
            <View style={styles.descriptionContainer}>
              <RenderDescriptionWithDropCap text={legend.descripcion} />
            </View>

            {/* Extra padding to prevent overlap with bottom buttons */}
            <View style={styles.bottomPadding} />
          </View>
        </ScrollView>

        {/* Fixed Bottom Actions Bar */}
        <View style={styles.actionsBar}>
          {/* Top Row: Demo and Comprar buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              onPress={handleDemoDownload}
              disabled={downloading}
              style={styles.demoButton}
            >
              {downloading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Ionicons name="game-controller" size={18} color="#fff" />
                  <Text style={styles.demoButtonText}>Demo</Text>
                </>
              )}
            </TouchableOpacity>

            <Button
              title="Comprar $2"
              onPress={handleFullClick}
              icon={<Ionicons name="bag" size={18} color="#fff" />}
              style={styles.comprarButton}
            />
          </View>

          {/* Bottom Row: Comunidad y Reseñas button */}
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: '/(main)/comments',
                params: { id: legend.id.toString() },
              })
            }
            style={styles.communityButton}
          >
            <Ionicons name="chatbubble-ellipses" size={18} color="#fff" />
            <Text style={styles.communityButtonText}>Comunidad y reseñas</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 0,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  heroContainer: {
    position: 'relative',
    width: '100%',
    height: 280,
    backgroundColor: Colors.STONE_300,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  contentContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
    backgroundColor: '#000',
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
    alignItems: 'center',
  },
  tagHistoria: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: 'rgba(255, 140, 0, 0.15)',
    borderWidth: 1,
    borderColor: Colors.WARNING,
    borderRadius: BorderRadius.full,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.WARNING,
    letterSpacing: 0.5,
  },
  tagBolivia: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: 'rgba(150, 150, 150, 0.3)',
    borderRadius: BorderRadius.full,
  },
  tagBoliviaText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.STONE_400,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: Spacing.xs,
    fontFamily: 'Georgia',
  },
  subtitle: {
    fontSize: 14,
    fontStyle: 'italic',
    color: Colors.WARNING,
    marginBottom: Spacing.lg,
    fontFamily: 'Georgia',
  },
  youtubeContainer: {
    width: '100%',
    marginBottom: Spacing.xl,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
  },
  youtubePlayButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 140, 0, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  youtubePlayText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginTop: Spacing.sm,
  },
  youtubePlaceholder: {
    width: '100%',
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
  },
  descriptionContainer: {
    marginBottom: Spacing.xl,
  },
  paragraphContainer: {
    marginBottom: Spacing.lg,
  },
  dropCapContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  dropCap: {
    fontSize: 52,
    fontWeight: '700',
    color: Colors.WARNING,
    lineHeight: 52,
    marginRight: Spacing.sm,
    fontFamily: 'Georgia',
    marginTop: -6,
  },
  paragraphText: {
    flex: 1,
    fontSize: 14,
    color: '#d1d5db',
    lineHeight: 22,
    fontWeight: '400',
  },
  bottomPadding: {
    height: 30,
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
  /* Fixed Actions Bar */
  actionsBar: {
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(100, 100, 100, 0.3)',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    gap: Spacing.md,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    width: '100%',
  },
  demoButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    backgroundColor: 'rgba(80, 80, 80, 0.9)',
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(150, 150, 150, 0.3)',
  },
  demoButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  comprarButton: {
    flex: 1,
  },
  communityButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(150, 150, 150, 0.3)',
  },
  communityButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
});
