import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Keyboard, Pressable, ScrollView, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { InputError } from '@/components/ui/input/error';
import { useThemeValue } from '@/hooks/use-theme';
import { useGeocodeByUri, useSearchAddress } from '@/hooks/use-yandex';
import type { YandexSuggestRequestResults } from '@/lib/api/yandex';
import { cn } from '@/lib/utils';
import { flatGeoFromMultilangGeocode } from '@/lib/yandex-geocode-to-flat-geo';

import { detectInfrastructureObjects } from '@/lib/api/infrastructure';
import { EMPTY_FLAT_GEO } from '@/store/announcementStore';
import type { AddressInputProps } from './types';

const DEBOUNCE_MS = 300;
const MIN_INPUT_LENGTH = 3;

export const AddressInput = React.forwardRef<TextInput, AddressInputProps>(function AddressInput(
  {
    label = 'Address',
    value,
    onChangeText,
    onFocus,
    onBlur,
    error,
    containerClassName,
    onSelectAddress,
    lang = 'en',
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

  const searchAddress = useSearchAddress();
  const geocodeByUri = useGeocodeByUri();

  const [results, setResults] = useState<YandexSuggestRequestResults[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showEmptyState, setShowEmptyState] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const placeholderColor = useThemeValue('placeholder');

  const runSearch = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || trimmed.length <= MIN_INPUT_LENGTH) {
        setResults([]);
        setShowEmptyState(false);
        return;
      }
      setIsLoading(true);
      setShowEmptyState(false);
      try {
        const response = await searchAddress.mutate({
          text: trimmed,
          lang,
          results: 10,
        });
        const list = response?.results ?? [];
        setResults(list);
        setShowEmptyState(list.length === 0);
      } catch {
        setResults([]);
        setShowEmptyState(true);
      } finally {
        setIsLoading(false);
      }
    },
    [lang, searchAddress]
  );

  const debouncedSearch = useCallback(
    (text: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        void runSearch(text);
      }, DEBOUNCE_MS);
    },
    [runSearch]
  );

  const emitEmptyGeo = useCallback(
    (text = '') => {
      onSelectAddress?.({
        address: {
          ...EMPTY_FLAT_GEO,
          formattedAddress: { ...EMPTY_FLAT_GEO.formattedAddress, [lang]: text },
        },
        infrastructureObjects: undefined,
      });
    },
    [onSelectAddress, lang]
  );

  const handleChangeText = useCallback(
    (text: string) => {
      onChangeText(text);

      if (!text.trim()) {
        setResults([]);
        setShowEmptyState(false);
        emitEmptyGeo(text);
        return;
      }

      if (text.length <= MIN_INPUT_LENGTH) {
        setResults([]);
        setShowEmptyState(false);
        emitEmptyGeo(text);
        return;
      }

      debouncedSearch(text);
    },
    [onChangeText, debouncedSearch, emitEmptyGeo]
  );

  const handleFocus = useCallback(
    (e: any) => {
      setIsFocused(true);
      if (value.trim().length > MIN_INPUT_LENGTH) {
        void runSearch(value);
      }
      onFocus?.(e);
    },
    [value, runSearch, onFocus]
  );

  const handleBlur = useCallback(
    (e: any) => {
      setIsFocused(false);
      onBlur?.(e);
    },
    [onBlur]
  );

  const handleSelectSuggestion = useCallback(
    async (item: YandexSuggestRequestResults) => {
      const title = item.title.text;
      onChangeText(title);

      if (item.uri) {
        try {
          const geocodeData = await geocodeByUri.mutate({ uri: item.uri });
          const flat = flatGeoFromMultilangGeocode(geocodeData);

          const infrastructureObjects = await detectInfrastructureObjects(
            flat.latitude,
            flat.longitude
          );

          onSelectAddress?.({
            address: flat,
            infrastructureObjects,
          });
        } catch {
          onSelectAddress?.({
            address: {
              ...EMPTY_FLAT_GEO,
              formattedAddress: { ...EMPTY_FLAT_GEO.formattedAddress, [lang]: title },
            },
            infrastructureObjects: undefined,
          });
        }
      } else {
        onSelectAddress?.({
          address: {
            ...EMPTY_FLAT_GEO,
            formattedAddress: { ...EMPTY_FLAT_GEO.formattedAddress, [lang]: title },
          },
          infrastructureObjects: undefined,
        });
      }

      setResults([]);
      Keyboard.dismiss();
      inputRef.current?.blur();
    },
    [onChangeText, onSelectAddress, geocodeByUri, lang]
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const canSuggest = value.trim().length > MIN_INPUT_LENGTH;

  const showDropdown =
    isFocused && canSuggest && (isLoading || results.length > 0 || showEmptyState);

  const showNoResults = !isLoading && results.length === 0 && showEmptyState;

  return (
    <View
      className={cn('w-full gap-1', containerClassName)}
      style={{ zIndex: showDropdown ? 100 : 0 }}>
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
          onBlur={handleBlur}
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
        <View
          className="max-h-[240px] rounded-[12px] border border-default bg-card"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 100,
            marginTop: 4,
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 6,
          }}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
            showsVerticalScrollIndicator
            className="max-h-[240px]">
            {showNoResults ? (
              <View className="px-3 py-3">
                <ThemedText className="text-[14px] text-muted-foreground">No results</ThemedText>
              </View>
            ) : (
              results.map((result, index) => (
                <Pressable
                  key={`${result.title.text}-${index}`}
                  onPress={() => handleSelectSuggestion(result)}
                  className="border-b border-default px-3 py-3 last:border-b-0"
                  accessibilityRole="button"
                  accessibilityLabel={`${result.title.text}${result.subtitle?.text ? `, ${result.subtitle.text}` : ''}`}>
                  <ThemedText className="text-[14px] font-medium text-foreground" numberOfLines={1}>
                    {result.title.text}
                  </ThemedText>
                  {result.subtitle?.text ? (
                    <ThemedText
                      className="mt-0.5 text-[12px] text-muted-foreground"
                      numberOfLines={1}>
                      {result.subtitle.text}
                    </ThemedText>
                  ) : null}
                </Pressable>
              ))
            )}
          </ScrollView>
        </View>
      ) : null}

      {error ? <InputError>{error}</InputError> : null}
    </View>
  );
});

export type { AddressInputProps } from './types';
