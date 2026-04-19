import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Input } from '@/components/ui/input';
import { announcementsService } from '@/lib/api/announcements';

const DEBOUNCE_MS = 300;
const MIN_INPUT_LENGTH = 3;
const SUGGESTION_LIMIT = 10;

type AddressAutocompleteProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  const { t } = useTranslation();
  const [inputText, setInputText] = useState(value);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suppressFetchRef = useRef(false);

  useEffect(() => {
    setInputText(value);
  }, [value]);

  const fetchSuggestions = useCallback(async (text: string) => {
    if (text.length < MIN_INPUT_LENGTH) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    try {
      const results = await announcementsService.getAddressSuggestions(text, SUGGESTION_LIMIT);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    } catch {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, []);

  const handleChangeText = useCallback(
    (text: string) => {
      setInputText(text);
      suppressFetchRef.current = false;

      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (text.length < MIN_INPUT_LENGTH) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      debounceRef.current = setTimeout(() => {
        if (!suppressFetchRef.current) {
          fetchSuggestions(text);
        }
      }, DEBOUNCE_MS);
    },
    [fetchSuggestions]
  );

  const handleSelectSuggestion = useCallback(
    (address: string) => {
      suppressFetchRef.current = true;
      setInputText(address);
      setSuggestions([]);
      setShowSuggestions(false);
      onChange(address);
    },
    [onChange]
  );

  const handleClear = useCallback(() => {
    suppressFetchRef.current = true;
    setInputText('');
    setSuggestions([]);
    setShowSuggestions(false);
    onChange('');
  }, [onChange]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <View className="z-10">
      <Input
        placeholder={placeholder ?? t('search.address_placeholder')}
        value={inputText}
        onChangeText={handleChangeText}
        left={<Ionicons name="search-outline" size={20} color="#ababab" />}
        right={
          inputText ? (
            <Pressable onPress={handleClear} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color="#ababab" />
            </Pressable>
          ) : null
        }
      />
      {showSuggestions && (
        <View className="absolute left-0 right-0 top-full z-20 mt-1 max-h-[200px] rounded-[12px] border border-default bg-card shadow-sm">
          <FlatList
            data={suggestions}
            keyExtractor={(item, index) => `${item}-${index}`}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handleSelectSuggestion(item)}
                className="border-b border-default px-4 py-3">
                <ThemedText className="text-[14px] text-foreground" numberOfLines={1}>
                  {item}
                </ThemedText>
              </Pressable>
            )}
          />
        </View>
      )}
    </View>
  );
};
