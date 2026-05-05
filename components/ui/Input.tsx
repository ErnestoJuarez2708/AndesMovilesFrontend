import React, { useState } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors, Spacing, BorderRadius } from '@/constants';

interface InputProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  style?: ViewStyle;
  inputStyle?: TextStyle;
  required?: boolean;
  editable?: boolean;
}

export function Input({
  placeholder,
  value,
  onChangeText,
  label,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  style,
  inputStyle,
  required = false,
  editable = true,
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const styles = StyleSheet.create({
    container: {
      marginVertical: Spacing.sm,
    },
    labelContainer: {
      flexDirection: 'row',
      marginBottom: Spacing.sm,
      paddingHorizontal: Spacing.xs,
    },
    label: {
      fontSize: 14,
      fontWeight: '500',
      color: Colors.STONE_700,
    },
    required: {
      color: Colors.ERROR,
      marginLeft: Spacing.xs,
    },
    inputContainer: {
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      borderColor: isFocused ? Colors.PRIMARY : Colors.BORDER,
      backgroundColor: isFocused ? Colors.STONE_50 : Colors.STONE_100,
      overflow: 'hidden',
    },
    input: {
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
      fontSize: 14,
      color: Colors.TEXT,
    },
    errorContainer: {
      marginTop: Spacing.sm,
      paddingHorizontal: Spacing.xs,
    },
    error: {
      fontSize: 12,
      color: Colors.ERROR,
    },
  });

  return (
    <View style={[styles.container, style]}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
          {required && <Text style={styles.required}>*</Text>}
        </View>
      )}
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, inputStyle]}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          placeholderTextColor={Colors.TEXT_LIGHT}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          editable={editable}
        />
      </View>
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.error}>{error}</Text>
        </View>
      )}
    </View>
  );
}
