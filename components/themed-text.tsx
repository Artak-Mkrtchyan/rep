import { Text, TextProps } from 'react-native';

import { cn } from '@/lib/utils';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
  className?: string;
};

export function ThemedText({ style, type = 'default', className, ...rest }: ThemedTextProps) {
  const baseByType: Record<NonNullable<ThemedTextProps['type']>, string> = {
    default: 'text-base leading-6',
    defaultSemiBold: 'text-base leading-6 font-semibold',
    title: 'text-2xl font-bold leading-8',
    subtitle: 'text-xl font-bold',
    link: 'text-[16px] leading-[30px]',
  };

  const mergedClassName = cn('text-foreground', baseByType[type], className);

  return <Text className={mergedClassName} style={style} {...rest} />;
}
