/**
 * Alert Component
 * Display warnings, errors, success messages with icon + text
 */

import React from 'react';
import { View, StyleSheet, type ViewProps } from 'react-native';
import { Colors, Spacing, BorderRadius } from '@/constants';
import { ThemedText } from '../themed-text';

export interface AlertProps extends ViewProps {
  /** Type of alert: success, warning, error, info */
  type?: 'success' | 'warning' | 'error' | 'info';
  /** Alert title/heading */
  title?: string;
  /** Alert message content */
  message: string;
  /** Icon or emoji (optional) */
  icon?: string;
  /** Callback when alert is dismissed */
  onDismiss?: () => void;
  children?: React.ReactNode;
}

const alertConfig = {
  success: {
    backgroundColor: Colors.SUCCESS_LIGHT,
    borderColor: Colors.SUCCESS,
    icon: '✓',
  },
  warning: {
    backgroundColor: '#FEF3C7',
    borderColor: Colors.WARNING,
    icon: '⚠',
  },
  error: {
    backgroundColor: Colors.ERROR_LIGHT,
    borderColor: Colors.ERROR,
    icon: '✕',
  },
  info: {
    backgroundColor: Colors.STONE_100,
    borderColor: Colors.STONE_300,
    icon: 'ℹ',
  },
};

export const Alert = React.forwardRef<View, AlertProps>(
  (
    {
      type = 'info',
      title,
      message,
      icon: customIcon,
      onDismiss,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const config = alertConfig[type];
    const icon = customIcon || config.icon;

    // Determine text color based on type
    const textColor = {
      success: Colors.SUCCESS,
      warning: '#B45100',
      error: Colors.ERROR,
      info: Colors.TEXT,
    }[type];

    return (
      <View
        ref={ref}
        style={[
          styles.container,
          {
            backgroundColor: config.backgroundColor,
            borderColor: config.borderColor,
          },
          style,
        ]}
        {...props}
      >
        {/* Icon */}
        <ThemedText
          style={[
            styles.icon,
            {
              color: textColor,
            },
          ]}
        >
          {icon}
        </ThemedText>

        {/* Content */}
        <View style={styles.content}>
          {title && (
            <ThemedText
              style={[
                styles.title,
                {
                  color: textColor,
                },
              ]}
            >
              {title}
            </ThemedText>
          )}
          <ThemedText
            style={[
              styles.message,
              {
                color: textColor,
              },
            ]}
          >
            {message}
          </ThemedText>
          {children}
        </View>
      </View>
    );
  }
);

Alert.displayName = 'Alert';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  icon: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  title: {
    fontWeight: '600',
    marginBottom: Spacing.xs,
    fontSize: 14,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
  },
});
