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

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

const colors = {
  amber700: '#b45309',
  amber300: '#fcd34d',
  stone50: '#f5f5f4',
  stone100: '#e7e5e4',
  stone300: '#d6d3d1',
  stone500: '#78716c',
  stone600: '#57534e',
  stone800: '#292524',
  stone900: '#1c1917',
  white: '#ffffff',
};

interface Legend {
  id: number;
  titulo: string;
  descripcion: string;
  imagen_url: string;
}

export default function CatalogScreen() {
  const router = useRouter();
  const { logout, token } = useAuth();
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
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.amber700} />
        <Text style={styles.loadingText}>Cargando leyendas...</Text>
      </View>
    );
  }

  if (error && legends.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle" size={48} color={colors.stone500} />
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity
          onPress={fetchLegends}
          style={styles.retryButton}
        >
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Ionicons name="location" size={24} color={colors.amber700} />
          <Text style={styles.title}>Leyendas de La Paz</Text>
        </View>
        <TouchableOpacity
          onPress={handleLogout}
          style={styles.logoutButton}
        >
          <Ionicons name="log-out" size={24} color={colors.stone500} />
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>
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
          renderItem={({ item }) => (
            <LegendCard
              legend={item}
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
    </View>
  );
}

interface LegendCardProps {
  legend: Legend;
  onPress: () => void;
}

function LegendCard({ legend, onPress }: LegendCardProps) {
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
          <Text style={styles.cardTag}>Leyenda</Text>
          <Text style={styles.cardTitle}>{legend.titulo}</Text>
          <Text style={styles.cardDescription} numberOfLines={2}>
            {legend.descripcion.substring(0, 120)}...
          </Text>
        </View>
        <View style={styles.cardButton}>
          <Ionicons name="chevron-forward" size={20} color={colors.white} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.stone100,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.stone100,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: colors.white,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.stone800,
    fontFamily: 'Georgia',
  },
  logoutButton: {
    padding: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.stone600,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 16,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.stone500,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.stone500,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: colors.amber700,
    borderRadius: 12,
  },
  retryButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  emptyText: {
    fontSize: 16,
    color: colors.stone500,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.stone400,
  },
  cardContainer: {
    height: 224,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    marginVertical: 4,
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
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  cardTextContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  cardTag: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.amber300,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 4,
    fontFamily: 'Georgia',
  },
  cardDescription: {
    fontSize: 13,
    color: '#d1d5db',
    lineHeight: 18,
  },
  cardButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
});
