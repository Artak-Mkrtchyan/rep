import React, { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Keyboard, Pressable, ScrollView, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { InputError } from '@/components/ui/input/error';
import { useThemeValue } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';
import { fetchYandexSuggestions } from '@/lib/yandex-suggest';

import type { AddressInputProps, AddressSuggestion } from './types';

const DEBOUNCE_MS = 300;

export const AddressInput = React.forwardRef<TextInput, AddressInputProps>(function AddressInput(
  {
    label = 'Address',
    value,
    onChangeText,
    onFocus,
    error,
    containerClassName,
    onSelectAddress,
    lang = 'en_US',
    placeholder = 'Enter address',
    ...textInputProps
  },
  ref
) {
  const inputRef = useRef<TextInput>(null);
  const mergedRef = (node: TextInput | null) => {
    (inputRef as React.MutableRefObject<TextInput | null>).current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) (ref as React.MutableRefObject<TextInput | null>).current = node;
  };

  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const placeholderColor = useThemeValue('placeholder');

  const loadSuggestions = useCallback(
    async (query: string) => {
      abortRef.current?.abort();
      abortRef.current = new AbortController();
      setIsLoading(true);
      try {
        const list = await fetchYandexSuggestions(query, lang);
        setSuggestions(list);
      } catch {
        setSuggestions([]);
      } finally {
        setIsLoading(false);
        abortRef.current = null;
      }
    },
    [lang]
  );

  const handleChangeText = useCallback(
    (text: string) => {
      onChangeText(text);
      onSelectAddress?.({
        country: '',
        formattedAddress: text,
        locality: '',
        province: '',
        street: '',
      });
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => loadSuggestions(text), DEBOUNCE_MS);
    },
    [onChangeText, loadSuggestions, onSelectAddress]
  );

  const handleFocus = useCallback(
    (e: any) => {
      setIsFocused(true);
      if (value.trim()) loadSuggestions(value);
      onFocus?.(e);
    },
    [value, loadSuggestions, onFocus]
  );

  const handleSelectSuggestion = useCallback(
    (suggestion: AddressSuggestion) => {
      const address = suggestion.formattedAddress || suggestion.title;
      onChangeText(address);
      onSelectAddress?.({
        country: suggestion.country,
        formattedAddress: suggestion.formattedAddress,
        locality: suggestion.locality,
        province: suggestion.province,
        street: suggestion.street,
      });
      setSuggestions([]);
      Keyboard.dismiss();
      inputRef.current?.blur();
    },
    [onChangeText, onSelectAddress]
  );

  const showDropdown = isFocused && (suggestions.length > 0 || isLoading);

  return (
    <View className={cn('w-full gap-1', containerClassName)}>
      {label ? (
        <ThemedText className="mb-1 text-[16px] font-bold text-foreground">{label}</ThemedText>
      ) : null}

      <Pressable
        onPress={() => inputRef.current?.focus()}
        className={cn(
          'h-12 flex-row items-center rounded-[12px] border px-3',
          error ? 'border-destructive bg-card' : 'border-default bg-card',
          isFocused && !error && 'border-primary'
        )}
        accessibilityRole="combobox"
        accessibilityLabel={label}
        accessibilityState={{ expanded: showDropdown }}
        accessibilityHint="Type to search address. Select a suggestion from the list.">
        <TextInput
          ref={mergedRef}
          value={value}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
          className="flex-1 text-[16px] text-foreground placeholder:text-muted-foreground"
          returnKeyType="done"
          {...textInputProps}
        />
        {isLoading ? (
          <ActivityIndicator
            size="small"
            color="#6B7280"
            accessibilityLabel="Loading suggestions"
          />
        ) : null}
      </Pressable>

      {showDropdown ? (
        <View className="z-[100] mt-1 max-h-[240px] rounded-[12px] border border-default bg-card">
          <ScrollView
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
            showsVerticalScrollIndicator
            className="max-h-[240px]">
            {suggestions.map((suggestion) => (
              <Pressable
                key={suggestion.id}
                onPress={() => handleSelectSuggestion(suggestion)}
                className="border-b border-default px-3 py-3 last:border-b-0"
                accessibilityRole="button"
                accessibilityLabel={`${suggestion.title}${suggestion.subtitle ? `, ${suggestion.subtitle}` : ''}`}>
                <ThemedText className="text-[14px] font-medium text-foreground" numberOfLines={1}>
                  {suggestion.title}
                </ThemedText>
                {suggestion.subtitle ? (
                  <ThemedText
                    className="mt-0.5 text-[12px] text-muted-foreground"
                    numberOfLines={1}>
                    {suggestion.subtitle}
                  </ThemedText>
                ) : null}
              </Pressable>
            ))}
          </ScrollView>
        </View>
      ) : null}

      {error ? <InputError>{error}</InputError> : null}
    </View>
  );
});

export type { AddressInputProps, AddressSuggestion, YandexSuggestResult } from './types';
