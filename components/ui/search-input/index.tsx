import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TextInput, View } from 'react-native';

import { cn } from '@/lib/utils';

import type { SearchInputProps } from './types';

const PLACEHOLDER_COLOR = '#C6C6C6';
const ICON_COLOR = '#919191';
const ICON_SIZE = 24;

export const SearchInput = React.forwardRef<TextInput, SearchInputProps>(
  (
    {
      placeholder = 'Search your broker',
      containerClassName,
      inputClassName,
      placeholderColor = PLACEHOLDER_COLOR,
      iconColor = ICON_COLOR,
      iconSize = ICON_SIZE,
      ...textInputProps
    },
    ref
  ) => (
    <View
      className={cn(
        'flex-row items-center gap-1 rounded-[12px] border border-neutral-50 bg-neutral-50 px-[16px] py-[8px]',
        containerClassName
      )}
      accessibilityRole="search">
      <Ionicons name="search-outline" size={iconSize} color={iconColor} />
      <TextInput
        ref={ref}
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        className={cn('flex-1 py-0 text-[12px] text-foreground', inputClassName)}
        style={{ minHeight: 24 }}
        {...textInputProps}
      />
    </View>
  )
);

SearchInput.displayName = 'SearchInput';

export type { SearchInputProps } from './types';
