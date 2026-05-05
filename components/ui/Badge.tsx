/**
 * Badge Component
 * Small labeled tag for categorization or status
 */

import React from 'react';
import { View, StyleSheet, type ViewProps } from 'react-native';
import { Colors, Spacing, BorderRadius } from '@/constants';
import { ThemedText } from '../themed-text';

export interface BadgeProps extends ViewProps {
  /** Badge label text */
  label: string;
  /** Badge variant/style */
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral';
  /** Size of badge */
  size?: 'sm' | 'md';
  children?: React.ReactNode;
}

const badgeConfig = {
  primary: {
    backgroundColor: Colors.PRIMARY,
    textColor: '#fff',
  },
  secondary: {
    backgroundColor: Colors.SECONDARY,
    textColor: '#fff',
  },
  success: {
    backgroundColor: Colors.SUCCESS,
    textColor: '#fff',
  },
  warning: {
    backgroundColor: Colors.WARNING,
    textColor: '#fff',
  },
  error: {
    backgroundColor: Colors.ERROR,
    textColor: '#fff',
  },
  neutral: {
    backgroundColor: Colors.STONE_200,
    textColor: Colors.TEXT,
  },
};

export const Badge = React.forwardRef<View, BadgeProps>(
  (
    {
      label,
      variant = 'primary',
      size = 'sm',
      style,
      children,
      ...props
    },
    ref
  ) => {
    const config = badgeConfig[variant];

    const sizeStyles = {
      sm: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
        fontSize: 12,
      },
      md: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        fontSize: 14,
      },
    };

    return (
      <View
        ref={ref}
        style={[
          styles.container,
          {
            backgroundColor: config.backgroundColor,
            ...sizeStyles[size],
          },
          style,
        ]}
        {...props}
      >
        <ThemedText
          style={[
            styles.label,
            {
              color: config.textColor,
              fontSize: sizeStyles[size].fontSize,
            },
          ]}
        >
          {label}
        </ThemedText>
        {children}
      </View>
    );
  }
);

Badge.displayName = 'Badge';

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontWeight: '600',
  },
});
