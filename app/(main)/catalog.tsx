import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { GlobalHeader } from '@/components/ui/GlobalHeader';
import { Colors, Spacing, BorderRadius } from '@/constants';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

interface Legend {
  id: number;
  titulo: string;
  descripcion: string;
  imagen_url: string;
  categoria?: string; // 'destacado' o 'leyenda'
}

export default function CatalogScreen() {
  const router = useRouter();
  const { logout, user } = useAuth();
  const [legends, setLegends] = useState<Legend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLegends = async () => {
    try {
      setError(null);
      const response = await axios.get(`${API_URL}/api/leyendas`, {
        timeout: 10000,
      });
      setLegends(response.data);
    } catch (err: any) {
      console.error('Error al cargar leyendas:', err);
      
      let errorMessage = 'Error desconocido';
      if (err.response) {
        errorMessage = err.response?.data?.message || 'Error al cargar las leyendas';
      } else if (err.request) {
        errorMessage = `No se pudo conectar a ${API_URL}. Verifica tu conexión.`;
      } else {
        errorMessage = err.message || 'Error al cargar las leyendas';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLegends();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchLegends();
  };

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <GlobalHeader
          back={false}
          user={user}
          onLogout={handleLogout}
          onLoginPress={() => router.replace('/(auth)/login')}
          onRegisterPress={() => router.push('/(auth)/register')}
        />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.PRIMARY} />
          <Text style={styles.loadingText}>Cargando leyendas...</Text>
        </View>
      </View>
    );
  }

  if (error && legends.length === 0) {
    return (
      <View style={styles.container}>
        <GlobalHeader
          back={false}
          user={user}
          onLogout={handleLogout}
          onLoginPress={() => router.replace('/(auth)/login')}
          onRegisterPress={() => router.push('/(auth)/register')}
        />
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle" size={48} color={Colors.TEXT_LIGHT} />
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity
            onPress={fetchLegends}
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GlobalHeader
        back={false}
        user={user}
        onLogout={handleLogout}
        onLoginPress={() => router.replace('/(auth)/login')}
        onRegisterPress={() => router.push('/(auth)/register')}
      />

      <View style={styles.mainContent}>
        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Ionicons name="location" size={24} color={Colors.PRIMARY_900} />
          <Text style={styles.sectionTitle}>Leyendas de La Paz</Text>
        </View>

        {/* Section Description */}
        <Text style={styles.sectionDescription}>
          Descubre las historias milenarias, mitos y tradiciones que envuelven a la ciudad maravilla y sus alrededores.
        </Text>

        {/* Legends List */}
        {legends.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay leyendas disponibles aún.</Text>
            <Text style={styles.emptySubtext}>Más sectores próximamente...</Text>
          </View>
        ) : (
          <FlatList
            data={legends}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => (
              <LegendCard
                legend={item}
                isHighlighted={index === 0}
                onPress={() => router.push({
                  pathname: '/(main)/legend-detail',
                  params: { id: item.id.toString() },
                })}
              />
            )}
            contentContainerStyle={styles.listContent}
            scrollEnabled
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}

        {/* Footer Text */}
        {legends.length > 0 && (
          <Text style={styles.footerText}>Más sectores próximamente...</Text>
        )}
      </View>
    </View>
  );
}

interface LegendCardProps {
  legend: Legend;
  isHighlighted?: boolean;
  onPress: () => void;
}

function LegendCard({ legend, isHighlighted = false, onPress }: LegendCardProps) {
  const tagText = isHighlighted ? 'DESTACADO' : 'LEYENDA';
  const tagColor = isHighlighted ? Colors.WARNING : Colors.PRIMARY_100;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.cardContainer}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: legend.imagen_url }}
        style={styles.cardImage}
      />
      <View style={styles.cardOverlay} />
      <View style={styles.cardContent}>
        <View style={styles.cardTextContainer}>
          <Text style={[styles.cardTag, { color: tagColor }]}>{tagText}</Text>
          <Text style={styles.cardTitle}>{legend.titulo}</Text>
          <Text style={styles.cardDescription} numberOfLines={1}>
            {legend.descripcion}
          </Text>
        </View>
        <View style={styles.cardButton}>
          <Ionicons name="chevron-forward" size={24} color="#fff" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.STONE_50,
  },
  mainContent: {
    flex: 1,
    backgroundColor: Colors.STONE_50,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.PRIMARY_900,
    fontFamily: 'Georgia',
  },
  sectionDescription: {
    fontSize: 14,
    color: Colors.STONE_600,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    lineHeight: 20,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: 16,
    color: Colors.TEXT_LIGHT,
  },
  errorText: {
    marginTop: Spacing.md,
    fontSize: 16,
    color: Colors.TEXT_LIGHT,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.PRIMARY,
    borderRadius: BorderRadius.md,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    gap: Spacing.lg,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.TEXT_LIGHT,
    marginBottom: Spacing.sm,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.STONE_400,
  },
  footerText: {
    fontSize: 14,
    color: Colors.TEXT_LIGHT,
    textAlign: 'center',
    paddingVertical: Spacing.lg,
  },
  cardContainer: {
    height: 224,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  cardImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  cardTextContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  cardTag: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: Spacing.xs,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: Spacing.xs,
    fontFamily: 'Georgia',
  },
  cardDescription: {
    fontSize: 13,
    color: '#d1d5db',
    lineHeight: 18,
  },
  cardButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(100, 100, 100, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.lg,
  },
});
