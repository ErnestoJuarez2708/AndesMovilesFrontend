import React, { useState } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';

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

const colors = {
  primary: '#b45309',
  stone50: '#f5f5f4',
  stone100: '#f5f5f4',
  stone200: '#e7e5e4',
  stone500: '#78716c',
  stone700: '#44403c',
  stone900: '#1c1917',
  red600: '#dc2626',
};

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
      marginVertical: 8,
    },
    labelContainer: {
      flexDirection: 'row',
      marginBottom: 6,
      paddingHorizontal: 4,
    },
    label: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.stone700,
    },
    required: {
      color: colors.red600,
      marginLeft: 4,
    },
    inputContainer: {
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isFocused ? colors.primary : colors.stone200,
      backgroundColor: isFocused ? colors.stone50 : colors.stone100,
      overflow: 'hidden',
    },
    input: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 14,
      color: colors.stone900,
    },
    errorContainer: {
      marginTop: 6,
      paddingHorizontal: 4,
    },
    error: {
      fontSize: 12,
      color: colors.red600,
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
          placeholderTextColor={colors.stone500}
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
