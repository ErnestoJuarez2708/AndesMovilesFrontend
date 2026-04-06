import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

const colors = {
  amber900: '#92400e',
  amber50: '#fffbeb',
  stone50: '#f5f5f4',
  stone100: '#e7e5e4',
  stone200: '#d6d3d1',
  stone300: '#d6d3d1',
  stone400: '#a8a29e',
  stone500: '#78716c',
  stone600: '#57534e',
  stone700: '#44403c',
  stone800: '#292524',
  stone900: '#1c1917',
  white: '#ffffff',
  amber500: '#d97706',
  amber600: '#d97706',
};

interface Comment {
  id: number;
  texto: string;
  rating: number;
  created_at: string;
  usuario: {
    nombre: string;
  };
}

export default function CommentsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, token } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchComments();
    }
  }, [id]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${API_URL}/api/comentarios/${id}`);
      const comentariosArray = Array.isArray(response.data.comentarios)
        ? response.data.comentarios
        : Array.isArray(response.data)
        ? response.data
        : [];

      setComments(comentariosArray);
    } catch (err: any) {
      console.error('Error fetching comments:', err);
      setError('No se pudieron cargar los comentarios');
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!newComment.trim() || !user || !id || !token) return;

    setSubmitting(true);
    setError(null);

    try {
      const response = await axios.post(
        `${API_URL}/api/comentarios`,
        {
          leyenda_id: id,
          texto: newComment.trim(),
          rating: rating,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newComentario = response.data;
      setComments([newComentario, ...comments]);
      setNewComment('');
      setRating(5);
    } catch (err: any) {
      console.error('Error al enviar comentario:', err);
      setError(
        err.response?.data?.error || 'Error al enviar comentario. Intenta de nuevo.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const renderCommentItem = ({ item }: { item: Comment }) => (
    <View style={styles.commentCard}>
      <View style={styles.commentHeader}>
        <View style={styles.userAvatar}>
          <Ionicons name="person" size={16} color={colors.stone500} />
        </View>
        <View style={styles.commentMeta}>
          <Text style={styles.userName}>{item.usuario?.nombre || 'Usuario'}</Text>
          <Text style={styles.commentDate}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>
      </View>

      <View style={styles.ratingContainer}>
        {[...Array(5)].map((_, i) => (
          <Ionicons
            key={i}
            name={i < item.rating ? 'star' : 'star-outline'}
            size={14}
            color={i < item.rating ? colors.amber500 : colors.stone300}
          />
        ))}
      </View>

      <Text style={styles.commentText}>{item.texto}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.amber50} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Comentarios y Opiniones</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Comments List */}
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.amber900} />
            <Text style={styles.loadingText}>Cargando comentarios...</Text>
          </View>
        ) : (
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCommentItem}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Aún no hay comentarios.</Text>
                <Text style={styles.emptySubtext}>¡Sé el primero!</Text>
              </View>
            }
            scrollEnabled
          />
        )}

        {/* Comment Input */}
        <View style={styles.inputContainer}>
          {user ? (
            <View style={styles.formContainer}>
              {error && (
                <Text style={styles.errorMessage}>{error}</Text>
              )}

              <View style={styles.ratingSection}>
                <Text style={styles.ratingLabel}>Tu calificación:</Text>
                <View style={styles.ratingButtons}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => setRating(star)}
                    >
                      <Ionicons
                        name={star <= rating ? 'star' : 'star-outline'}
                        size={22}
                        color={
                          star <= rating ? colors.amber500 : colors.stone300
                        }
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Escribe tu opinión..."
                  placeholderTextColor={colors.stone500}
                  value={newComment}
                  onChangeText={setNewComment}
                  editable={!submitting}
                  multiline
                  maxLength={500}
                />
                <TouchableOpacity
                  onPress={handleSubmit}
                  disabled={!newComment.trim() || submitting}
                  style={[
                    styles.sendButton,
                    (!newComment.trim() || submitting) && styles.sendButtonDisabled,
                  ]}
                >
                  <Ionicons
                    name="send"
                    size={18}
                    color={
                      newComment.trim() && !submitting ? colors.white : colors.stone300
                    }
                  />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.notAuthContainer}>
              <Text style={styles.notAuthText}>
                Debes iniciar sesión para dejar un comentario.
              </Text>
              <TouchableOpacity
                onPress={() => router.replace('/(auth)/login')}
                style={styles.loginLink}
              >
                <Text style={styles.loginLinkText}>Iniciar Sesión</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.stone50,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.amber900,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.amber50,
    letterSpacing: 0.3,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.stone500,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  commentCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.stone100,
    marginBottom: 4,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.stone200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentMeta: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.stone800,
  },
  commentDate: {
    fontSize: 12,
    color: colors.stone400,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 8,
  },
  commentText: {
    fontSize: 13,
    color: colors.stone600,
    lineHeight: 18,
  },
  emptyContainer: {
    paddingVertical: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.stone500,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 12,
    color: colors.stone400,
  },
  inputContainer: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.stone200,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  formContainer: {
    gap: 12,
  },
  errorMessage: {
    color: '#dc2626',
    fontSize: 12,
  },
  ratingSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.stone600,
  },
  ratingButtons: {
    flexDirection: 'row',
    gap: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    backgroundColor: colors.stone100,
    borderRadius: 12,
    paddingRight: 8,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: colors.stone900,
    maxHeight: 80,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.amber600,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.stone300,
  },
  notAuthContainer: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  notAuthText: {
    fontSize: 13,
    color: colors.stone600,
    marginBottom: 8,
  },
  loginLink: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  loginLinkText: {
    color: colors.amber900,
    fontWeight: '600',
    fontSize: 13,
    textDecorationLine: 'underline',
  },
});
