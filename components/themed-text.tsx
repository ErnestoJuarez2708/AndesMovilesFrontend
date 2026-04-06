import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { Colors, FontSizes, FontWeights, TextStyles } from '@/constants';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  /** Typography preset: default, title, subtitle, link, h1, h2, h3, body, small, caption, button */
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'h1' | 'h2' | 'h3' | 'body' | 'small' | 'caption' | 'button';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  // Get new design system style if available, otherwise fall back to legacy
  const getStyleByType = () => {
    const typeStyleMap: Record<string, any> = {
      h1: TextStyles.h1,
      h2: TextStyles.h2,
      h3: TextStyles.h3,
      body: TextStyles.body,
      small: TextStyles.small,
      caption: TextStyles.caption,
      button: TextStyles.button,
    };
    
    return typeStyleMap[type] || styles[type as keyof typeof styles];
  };

  return (
    <Text
      style={[
        { color },
        getStyleByType(),
        // Legacy type-specific overrides
        type === 'link' && { color: Colors.PRIMARY },
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: FontSizes.base,
    lineHeight: FontSizes.base * 1.5,
    fontWeight: '400',
  },
  defaultSemiBold: {
    fontSize: FontSizes.base,
    lineHeight: FontSizes.base * 1.5,
    fontWeight: '600',
  },
  title: {
    fontSize: FontSizes['3xl'],
    fontWeight: '700',
    lineHeight: FontSizes['3xl'] * 1.2,
  },
  subtitle: {
    fontSize: FontSizes.xl,
    fontWeight: '600',
    lineHeight: FontSizes.xl * 1.5,
  },
  link: {
    lineHeight: FontSizes.base * 1.875,
    fontSize: FontSizes.base,
    color: Colors.PRIMARY,
  },
});
