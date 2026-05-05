/**
 * Shadow System for React Native
 * iOS and Android compatible shadow definitions
 */

import { Platform, StyleProp, ViewStyle } from 'react-native';

export const Shadows = {
  // Small shadow - subtle elevation
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    ...(Platform.OS === 'android' && { elevation: 2 }),
  } as StyleProp<ViewStyle>,
  
  // Medium shadow - moderate elevation
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    ...(Platform.OS === 'android' && { elevation: 5 }),
  } as StyleProp<ViewStyle>,
  
  // Large shadow - prominent elevation
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    ...(Platform.OS === 'android' && { elevation: 8 }),
  } as StyleProp<ViewStyle>,
  
  // Extra large shadow - maximum elevation
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    ...(Platform.OS === 'android' && { elevation: 12 }),
  } as StyleProp<ViewStyle>,
  
  // No shadow
  none: {} as StyleProp<ViewStyle>,
} as const;

export type ShadowKey = keyof typeof Shadows;

/**
 * Helper to get shadow value
 */
export const getShadow = (key: ShadowKey): StyleProp<ViewStyle> => Shadows[key];
