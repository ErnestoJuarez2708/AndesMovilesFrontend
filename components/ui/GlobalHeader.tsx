import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius } from '@/constants';

interface GlobalHeaderProps {
  /**
   * Show back button (LEFT side)
   * @default false
   */
  back?: boolean;

  /**
   * Callback when back button pressed
   */
  onBackPress?: () => void;

  /**
   * Title to show in CENTER or LEFT (when back=false)
   * @default "Andes Móviles"
   */
  title?: string;

  /**
   * Current authenticated user
   */
  user?: { id?: number; email: string; nombre?: string } | null;

  /**
   * Callback when logout button pressed
   */
  onLogout?: () => void;

  /**
   * Callback to navigate to login page
   */
  onLoginPress?: () => void;

  /**
   * Callback to navigate to register page
   */
  onRegisterPress?: () => void;
}

/**
 * GlobalHeader Component
 * Reusable header component that matches Bolivianlegendsmobileapp
 *
 * Layout:
 * - LEFT: Back button (if back=true) OR "Andes Móviles" title (if back=false)
 * - CENTER: Title (if back=true and title exists)
 * - RIGHT: User info (if logged) OR Auth links (if not logged)
 *
 * Features:
 * - Sticky positioning (bg-amber-900 / PRIMARY_900)
 * - Non-absolute positioning (part of normal layout flow)
 * - Consistent with design system
 *
 * @example
 * // Catalog header (no back button)
 * <GlobalHeader back={false} user={user} onLogout={handleLogout} />
 *
 * // Detail header with back
 * <GlobalHeader
 *   back={true}
 *   title="Legend Title"
 *   onBackPress={handleBack}
 *   user={user}
 *   onLogout={handleLogout}
 * />
 *
 * // Login header (no user)
 * <GlobalHeader
 *   back={true}
 *   onBackPress={handleBack}
 *   onLoginPress={handleLogin}
 *   onRegisterPress={handleRegister}
 * />
 */
export function GlobalHeader({
  back = false,
  onBackPress,
  title = 'Andes Móviles',
  user,
  onLogout,
  onLoginPress,
  onRegisterPress,
}: GlobalHeaderProps) {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* LEFT SIDE: Back button or title */}
      <View style={styles.leftContent}>
        {back ? (
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.PRIMARY_100} />
          </TouchableOpacity>
        ) : (
          <Text style={styles.leftTitle}>{title}</Text>
        )}
      </View>

      {/* CENTER: Title (only when back=true and title exists) */}
      {back && title && (
        <View style={styles.centerContent}>
          <Text style={styles.centerTitle} numberOfLines={1}>
            {title}
          </Text>
        </View>
      )}

       {/* RIGHT SIDE: Auth options or user info */}
       <View style={styles.rightContent}>
         {user ? (
           <View style={styles.userSection}>
             {/* User badge */}
             <View style={styles.userBadge}>
               <Ionicons
                 name="person-circle"
                 size={20}
                 color={Colors.PRIMARY_100}
               />
               <Text style={styles.userEmail} numberOfLines={1}>
                 {user.nombre || user.email}
               </Text>
             </View>

             {/* Logout button */}
             {onLogout && (
               <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
                 <Ionicons
                   name="log-out"
                   size={18}
                   color={Colors.PRIMARY_100}
                 />
               </TouchableOpacity>
             )}
           </View>
         ) : (
           <View style={styles.authLinks}>
             {onLoginPress && (
               <TouchableOpacity onPress={onLoginPress}>
                 <Text style={styles.authLinkText}>Iniciar Sesión</Text>
               </TouchableOpacity>
             )}

             <Text style={styles.authDivider}>|</Text>

             {onRegisterPress && (
               <TouchableOpacity onPress={onRegisterPress}>
                 <Text style={styles.authLinkText}>Registrarse</Text>
               </TouchableOpacity>
             )}
           </View>
         )}
       </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.PRIMARY_900,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  /* LEFT SECTION */
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 0,
    minWidth: 40,
  },
  backButton: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  leftTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.PRIMARY_100,
    fontFamily: 'Georgia',
    letterSpacing: 0.5,
  },

  /* CENTER SECTION */
  centerContent: {
    flex: 1,
    marginHorizontal: Spacing.md,
  },
  centerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.PRIMARY_100,
    textAlign: 'center',
    fontFamily: 'Georgia',
  },

  /* RIGHT SECTION */
  rightContent: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    justifyContent: 'flex-end',
  },

  /* USER INFO */
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  userBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  userEmail: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.PRIMARY_100,
    maxWidth: 100,
  },
  logoutButton: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
  },

  /* AUTH LINKS */
  authLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  authLinkText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.PRIMARY_100,
  },
  authDivider: {
    fontSize: 12,
    color: Colors.PRIMARY_100,
    marginHorizontal: Spacing.xs,
  },
});
