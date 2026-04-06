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

interface ButtonProps {
  onPress: () => void;
  title?: string;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  children?: React.ReactNode;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

const colors = {
  primary: '#b45309',
  secondary: '#92400e',
  tertiary: '#78716c',
  danger: '#dc2626',
  white: '#ffffff',
  stone50: '#f5f5f4',
  stone100: '#f5f5f4',
};

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
  const styles = StyleSheet.create({
    container: {
      borderRadius: 12,
      overflow: 'hidden',
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingHorizontal: size === 'small' ? 12 : size === 'large' ? 24 : 16,
      paddingVertical: size === 'small' ? 8 : size === 'large' ? 16 : 12,
      backgroundColor: variant === 'primary' ? colors.primary : 
                      variant === 'secondary' ? colors.secondary :
                      variant === 'danger' ? colors.danger : colors.tertiary,
      opacity: disabled ? 0.6 : 1,
    },
    text: {
      color: variant === 'tertiary' ? colors.stone50 : colors.white,
      fontSize: size === 'small' ? 14 : size === 'large' ? 18 : 16,
      fontWeight: '600',
    },
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.container, style]}
    >
      <View style={styles.button}>
        {loading ? (
          <ActivityIndicator size="small" color={colors.white} />
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
