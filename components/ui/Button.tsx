import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import { Colors, Spacing, BorderRadius } from '@/constants';

interface ButtonProps {
  onPress: () => void;
  title?: string;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  children?: React.ReactNode;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export function Button({
  onPress,
  title,
  loading = false,
  disabled = false,
  variant = 'primary',
  size = 'medium',
  children,
  icon,
  style,
}: ButtonProps) {
  // Determine button colors based on variant
  const variantStyles = {
    primary: {
      backgroundColor: Colors.PRIMARY,
      textColor: '#fff',
    },
    secondary: {
      backgroundColor: Colors.SECONDARY,
      textColor: '#fff',
    },
    danger: {
      backgroundColor: Colors.ERROR,
      textColor: '#fff',
    },
    ghost: {
      backgroundColor: 'transparent',
      textColor: Colors.PRIMARY,
    },
  };

  // Determine size styles
  const sizeStyles = {
    small: {
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      fontSize: 12,
    },
    medium: {
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
      fontSize: 14,
    },
    large: {
      paddingHorizontal: Spacing.xl,
      paddingVertical: Spacing.lg,
      fontSize: 16,
    },
  };

  const currentVariant = variantStyles[variant];
  const currentSize = sizeStyles[size];

  const styles = StyleSheet.create({
    container: {
      borderRadius: BorderRadius.md,
      overflow: 'hidden',
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.md,
      paddingHorizontal: currentSize.paddingHorizontal,
      paddingVertical: currentSize.paddingVertical,
      backgroundColor: currentVariant.backgroundColor,
      opacity: disabled ? 0.6 : 1,
      borderWidth: variant === 'ghost' ? 1 : 0,
      borderColor: variant === 'ghost' ? Colors.PRIMARY : 'transparent',
    },
    text: {
      color: currentVariant.textColor,
      fontSize: currentSize.fontSize,
      fontWeight: '600',
    },
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[styles.container, style]}
    >
      <View style={styles.button}>
        {loading ? (
          <ActivityIndicator size="small" color={currentVariant.textColor} />
        ) : (
          <>
            {icon}
            {title && <Text style={styles.text}>{title}</Text>}
            {children}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}
