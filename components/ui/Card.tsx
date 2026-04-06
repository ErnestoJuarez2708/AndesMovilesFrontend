/**
 * Card Component
 * Reusable container with padding, border-radius, shadow, and background
 */

import React from 'react';
import { View, StyleSheet, type ViewProps } from 'react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants';

export interface CardProps extends ViewProps {
  /** Variant determines padding and styling */
  variant?: 'default' | 'compact' | 'elevated';
  /** Shadow intensity */
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /** Background color override */
  backgroundColor?: string;
  children?: React.ReactNode;
}

export const Card = React.forwardRef<View, CardProps>(
  (
    {
      variant = 'default',
      shadow = 'md',
      backgroundColor = Colors.STONE_50,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const variantStyles = StyleSheet.create({
      default: {
        padding: Spacing.xl,
      },
      compact: {
        padding: Spacing.md,
      },
      elevated: {
        padding: Spacing.xl,
      },
    });

    const getShadowStyle = () => {
      const shadowMap: Record<string, any> = {
        none: {},
        sm: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
        },
        md: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 6,
          elevation: 5,
        },
        lg: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.2,
          shadowRadius: 12,
          elevation: 8,
        },
        xl: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 20 },
          shadowOpacity: 0.25,
          shadowRadius: 24,
          elevation: 12,
        },
      };
      return shadowMap[shadow] || shadowMap.md;
    };

    return (
      <View
        ref={ref}
        style={[
          styles.container,
          variantStyles[variant],
          {
            backgroundColor,
            ...getShadowStyle(),
          },
          style,
        ]}
        {...props}
      >
        {children}
      </View>
    );
  }
);

Card.displayName = 'Card';

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
});
