/**
 * Typography System
 * Defines font sizes, weights, and line heights
 */

// Font sizes (in pixels)
export const FontSizes = {
  xs: 12,      // Extra small - captions, tiny text
  sm: 14,      // Small - labels, secondary text
  base: 16,    // Base - body text
  lg: 18,      // Large - callouts, emphasis
  xl: 20,      // Extra large - subheadings
  '2xl': 24,   // 2x large - section headers
  '3xl': 32,   // 3x large - page titles
} as const;

export type FontSizeKey = keyof typeof FontSizes;

// Font weights
export const FontWeights = {
  regular: '400',    // Normal text
  medium: '500',     // Slightly emphasized
  semibold: '600',   // Emphasized
  bold: '700',       // Strong emphasis
} as const;

export type FontWeightKey = keyof typeof FontWeights;

// Line heights (multipliers)
export const LineHeights = {
  tight: 1.2,        // Compact line spacing (good for headlines)
  normal: 1.5,       // Default line spacing (good for body text)
  relaxed: 1.75,     // Loose line spacing (very readable)
} as const;

export type LineHeightKey = keyof typeof LineHeights;

/**
 * Preset text styles combining size, weight, and line height
 * Use these for common text elements
 */
export const TextStyles = {
  // Headlines
  h1: {
    fontSize: FontSizes['3xl'],
    fontWeight: FontWeights.bold,
    lineHeight: FontSizes['3xl'] * LineHeights.tight,
  },
  h2: {
    fontSize: FontSizes['2xl'],
    fontWeight: FontWeights.bold,
    lineHeight: FontSizes['2xl'] * LineHeights.tight,
  },
  h3: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.xl * LineHeights.normal,
  },
  
  // Body text
  body: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.base * LineHeights.normal,
  },
  bodyMedium: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.base * LineHeights.normal,
  },
  bodySemibold: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.base * LineHeights.normal,
  },
  
  // Small text
  small: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.sm * LineHeights.normal,
  },
  smallMedium: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.sm * LineHeights.normal,
  },
  
  // Captions
  caption: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.xs * LineHeights.tight,
  },
  captionSemibold: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.xs * LineHeights.tight,
  },
  
  // Buttons
  button: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.base * LineHeights.tight,
  },
  buttonSmall: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.sm * LineHeights.tight,
  },
} as const;

/**
 * Helper to get font size value
 */
export const getFontSize = (key: FontSizeKey): number => FontSizes[key];

/**
 * Helper to get font weight value
 */
export const getFontWeight = (key: FontWeightKey): string => FontWeights[key];

/**
 * Helper to get line height value
 */
export const getLineHeight = (key: LineHeightKey): number => LineHeights[key];
