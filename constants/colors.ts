/**
 * Color Palette - Warm Design System (OKLCH + Hex)
 * Base: Amber tones with stone grays
 */

export const Colors = {
  // Primary palette - Amber warm tones
  PRIMARY: '#B45309',        // Amber 700 - main brand color
  PRIMARY_900: '#92400E',    // Amber 900 - darker variant
  PRIMARY_100: '#FCD34D',    // Amber 100 - lighter variant
  
  // Secondary palette - Very dark amber
  SECONDARY: '#78350F',      // Amber 900 - secondary brand
  
  // Stone/Gray palette - Neutral grays
  STONE_50: '#FAFAF9',       // Almost white
  STONE_100: '#F5F5F4',      // Very light gray
  STONE_200: '#E7E5E4',      // Light gray
  STONE_300: '#D6D3D1',      // Medium light gray
  STONE_400: '#A8A29E',      // Medium gray
  STONE_500: '#78716F',      // Medium-dark gray
  STONE_600: '#57534E',      // Dark gray
  STONE_700: '#44403C',      // Very dark gray
  STONE_800: '#292423',      // Charcoal
  STONE_900: '#1C1917',      // Almost black
  
  // Semantic colors
  ERROR: '#DC2626',          // Red for errors
  ERROR_LIGHT: '#FEE2E2',    // Light red background
  SUCCESS: '#16A34A',        // Green for success
  SUCCESS_LIGHT: '#DCFCE7',  // Light green background
  WARNING: '#EA580C',        // Orange for warnings
  
  // Background & text
  BACKGROUND: '#FAFAF9',     // Main background - stone 50
  TEXT: '#1C1917',           // Primary text - stone 900
  TEXT_LIGHT: '#78716F',     // Secondary text - stone 500
  
  // Borders & dividers
  BORDER: '#E7E5E4',         // Border color - stone 200
} as const;

export type ColorKey = keyof typeof Colors;
