/**
 * Form Component
 * Wrapper for forms with consistent spacing and styling
 */

import React from 'react';
import { View, StyleSheet, type ViewProps } from 'react-native';
import { Spacing } from '@/constants';
import { ThemedText } from '../themed-text';

export interface FormProps extends ViewProps {
  /** Gap between form fields */
  gap?: number;
  children?: React.ReactNode;
}

export interface FormGroupProps extends ViewProps {
  /** Label for the form group */
  label?: string;
  /** Helper text or error message */
  helperText?: string;
  /** Whether there's an error */
  error?: boolean;
  children?: React.ReactNode;
}

export interface FormLabelProps extends ViewProps {
  /** Label text */
  label: string;
  /** Whether field is required */
  required?: boolean;
  children?: React.ReactNode;
}

/**
 * Form component - main wrapper
 */
export const Form = React.forwardRef<View, FormProps>(
  ({ gap = Spacing.md, style, children, ...props }, ref) => {
    return (
      <View
        ref={ref}
        style={[
          styles.form,
          {
            gap,
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

Form.displayName = 'Form';

/**
 * FormGroup component - group related form fields
 */
export const FormGroup = React.forwardRef<View, FormGroupProps>(
  (
    { label, helperText, error, style, children, ...props },
    ref
  ) => {
    return (
      <View
        ref={ref}
        style={[
          styles.formGroup,
          style,
        ]}
        {...props}
      >
        {label && (
          <FormLabel label={label} />
        )}
        {children}
        {helperText && (
          <ThemedText
            style={[
              styles.helperText,
              error && styles.errorText,
            ]}
          >
            {helperText}
          </ThemedText>
        )}
      </View>
    );
  }
);

FormGroup.displayName = 'FormGroup';

/**
 * FormLabel component - label for form fields
 */
export const FormLabel = React.forwardRef<View, FormLabelProps>(
  ({ label, required, style, children, ...props }, ref) => {
    return (
      <View
        ref={ref}
        style={[
          styles.labelContainer,
          style,
        ]}
        {...props}
      >
        <ThemedText style={styles.label}>
          {label}
          {required && <ThemedText style={styles.required}>*</ThemedText>}
        </ThemedText>
        {children}
      </View>
    );
  }
);

FormLabel.displayName = 'FormLabel';

const styles = StyleSheet.create({
  form: {
    width: '100%',
  },
  formGroup: {
    gap: Spacing.sm,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontWeight: '600',
    fontSize: 14,
  },
  required: {
    color: '#DC2626',
    marginLeft: 4,
  },
  helperText: {
    fontSize: 12,
    color: '#78716F',
    marginTop: Spacing.xs,
  },
  errorText: {
    color: '#DC2626',
  },
});
