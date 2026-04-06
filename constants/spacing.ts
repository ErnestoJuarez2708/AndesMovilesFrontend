/**
 * Spacing Scale
 * Used for padding, margin, gaps, and alignment
 */

export const Spacing = {
  xs: 4,      // Minimal spacing
  sm: 8,      // Small spacing
  md: 12,     // Medium spacing
  lg: 16,     // Large spacing (default for most layouts)
  xl: 24,     // Extra large spacing
  xxl: 32,    // 2x large spacing
  xxxl: 48,   // 3x large spacing
} as const;

export type SpacingKey = keyof typeof Spacing;

/**
 * Helper to access spacing values
 * @param key - The spacing key (xs, sm, md, lg, xl, xxl, xxxl)
 * @returns The pixel value
 */
export const getSpacing = (key: SpacingKey): number => Spacing[key];
