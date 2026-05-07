import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { GlobalHeader } from '@/components/ui/GlobalHeader';
import { Colors, Spacing, BorderRadius } from '@/constants';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

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
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, token } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    
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

    fetchComments();
  }, [id]);

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
          <Ionicons name="person" size={16} color={Colors.TEXT_LIGHT} />
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
            color={i < item.rating ? Colors.WARNING : Colors.STONE_300}
          />
        ))}
      </View>

      <Text style={styles.commentText}>{item.texto}</Text>
    </View>
  );

  const handleBackPress = () => {
    if (navigation.canGoBack()) {
      router.back();
    } else {
      router.replace('/(main)/catalog');
    }
  };

  return (
    <View style={styles.container}>
      <GlobalHeader
        back={true}
        title="Comentarios y Opiniones"
        onBackPress={handleBackPress}
        user={user}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={0}
      >
        <View style={styles.mainContent}>
          {/* Comments List */}
          {loading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color={Colors.PRIMARY} />
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
                            star <= rating ? Colors.WARNING : Colors.STONE_300
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
                    placeholderTextColor={Colors.TEXT_LIGHT}
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
                        newComment.trim() && !submitting ? '#fff' : Colors.STONE_300
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
        </View>
      </KeyboardAvoidingView>
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
  },
  keyboardView: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: 14,
    color: Colors.TEXT_LIGHT,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  commentCard: {
    backgroundColor: '#fff',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.STONE_100,
    marginBottom: Spacing.xs,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.STONE_200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentMeta: {
    flex: 1,
  },
  userName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.STONE_800,
  },
  commentDate: {
    fontSize: 12,
    color: Colors.TEXT_LIGHT,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  commentText: {
    fontSize: 14,
    color: Colors.STONE_700,
    lineHeight: 20,
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
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.STONE_200,
    backgroundColor: '#fff',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  formContainer: {
    gap: Spacing.md,
  },
  errorMessage: {
    color: Colors.ERROR,
    fontSize: 13,
    marginBottom: Spacing.sm,
  },
  ratingSection: {
    gap: Spacing.sm,
  },
  ratingLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.STONE_800,
  },
  ratingButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  inputWrapper: {
    position: 'relative',
    borderWidth: 1,
    borderColor: Colors.STONE_200,
    borderRadius: BorderRadius.lg,
    paddingRight: 40,
    minHeight: 100,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: 14,
    color: Colors.STONE_700,
    textAlignVertical: 'top',
  },
  sendButton: {
    position: 'absolute',
    bottom: Spacing.md,
    right: Spacing.md,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.STONE_200,
  },
  notAuthContainer: {
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.xl,
  },
  notAuthText: {
    fontSize: 14,
    color: Colors.TEXT_LIGHT,
    textAlign: 'center',
  },
  loginLink: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.PRIMARY,
    borderRadius: BorderRadius.lg,
  },
  loginLinkText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
