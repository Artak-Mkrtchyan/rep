import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Platform, Pressable, Text, TextInputChangeEvent, View } from 'react-native';

import { Input } from '@/components/ui/input';
import type { InputProps } from '@/components/ui/input/types';
import { Image } from 'expo-image';

export interface DatePickerProps extends Omit<InputProps, 'value' | 'onChangeText' | 'editable'> {
  value?: string; // Format: "YYYY-MM-DD" (API format)
  onChange?: (date: string | TextInputChangeEvent) => void; // Returns "YYYY-MM-DD" format
  minimumDate?: Date;
  maximumDate?: Date;
}

const formatDateForDisplay = (dateString: string | undefined): string => {
  if (!dateString) return '';

  // Convert YYYY-MM-DD to DD.MM.YYYY for display
  const [year, month, day] = dateString.split('-');
  if (year && month && day) {
    return `${day}.${month}.${year}`;
  }

  return dateString;
};

const formatDateForAPI = (dateString: string): string => {
  // If in DD.MM.YYYY format, convert to YYYY-MM-DD
  if (dateString.includes('.')) {
    const [day, month, year] = dateString.split('.');
    if (day && month && year) {
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
  }

  // If already in YYYY-MM-DD format, return as is
  return dateString;
};

const validateDateParts = (day: string, month: string, year: string): boolean => {
  if (!day || !month || !year) return false;

  const dayNum = parseInt(day, 10);
  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10);

  if (dayNum < 1 || dayNum > 31) {
    return false;
  }

  if (monthNum < 1 || monthNum > 12) {
    return false;
  }

  if (yearNum < 1900 || yearNum > 2999) {
    return false;
  }

  return true;
};

const applyDateMask = (input: string): string => {
  // Soft mask: never drops typed digits, only strips non-digits and formats.
  const validDigits = input.replace(/\D/g, '').slice(0, 8);

  // Insert dots after day and month
  let formatted = '';
  for (let i = 0; i < validDigits.length; i++) {
    if (i === 2 || i === 4) {
      formatted += '.';
    }
    formatted += validDigits[i];
  }

  return formatted;
};

const parseValueToDate = (dateString: string | undefined): Date => {
  if (!dateString) return new Date();

  const date = new Date(dateString);
  return isNaN(date.getTime()) ? new Date() : date;
};

const formatDateToAPI = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  minimumDate,
  maximumDate,
  ...inputProps
}) => {
  const { t } = useTranslation();
  const [displayValue, setDisplayValue] = React.useState(formatDateForDisplay(value));
  const [showPicker, setShowPicker] = React.useState(false);
  const [tempDate, setTempDate] = React.useState<Date>(parseValueToDate(value));
  const skipNextEmptyValueSyncRef = React.useRef(false);

  React.useEffect(() => {
    if (value === '' && skipNextEmptyValueSyncRef.current) {
      skipNextEmptyValueSyncRef.current = false;
      return;
    }
    setDisplayValue(formatDateForDisplay(value));
  }, [value]);

  const handleTextChange = (text: string) => {
    const masked = applyDateMask(text);

    setDisplayValue(masked);

    if (masked.length === 10) {
      const apiFormat = formatDateForAPI(masked);
      const [year, month, day] = apiFormat.split('-');

      if (validateDateParts(day, month, year)) {
        const date = new Date(apiFormat);
        if (!isNaN(date.getTime())) {
          if (maximumDate && date > maximumDate) {
            const clampedApi = formatDateToAPI(maximumDate);
            setDisplayValue(formatDateForDisplay(clampedApi));
            onChange?.(clampedApi);
            return;
          }
          if (minimumDate && date < minimumDate) {
            const clampedApi = formatDateToAPI(minimumDate);
            setDisplayValue(formatDateForDisplay(clampedApi));
            onChange?.(clampedApi);
            return;
          }
          onChange?.(apiFormat);
        }
      }
    } else {
      // Keep partial date visible while exposing empty value to form state.
      skipNextEmptyValueSyncRef.current = true;
      onChange?.('');
    }
  };

  const handleIconPress = () => {
    if (inputProps.disabled) return;
    setTempDate(parseValueToDate(value));
    setShowPicker(true);
  };

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
      if (event.type === 'set' && selectedDate) {
        const apiFormat = formatDateToAPI(selectedDate);
        setDisplayValue(formatDateForDisplay(apiFormat));
        onChange?.(apiFormat);
      }
      return;
    }

    if (selectedDate) {
      setTempDate(selectedDate);
    }
  };

  const handleConfirm = () => {
    const apiFormat = formatDateToAPI(tempDate);
    setDisplayValue(formatDateForDisplay(apiFormat));
    onChange?.(apiFormat);
    setShowPicker(false);
  };

  const handleCancel = () => {
    setShowPicker(false);
  };

  return (
    <>
      <Input
        {...inputProps}
        value={displayValue}
        onChangeText={handleTextChange}
        editable={!inputProps.disabled}
        keyboardType="number-pad"
        maxLength={10}
        rightIcon={
          <Pressable
            onPress={handleIconPress}
            disabled={inputProps.disabled}
            accessibilityRole="button"
            accessibilityLabel={t('ui.open_date_picker')}
            className="h-full items-center justify-center px-2">
            <Image
              source={require('@/assets/images/calendar-days.svg')}
              style={{ width: 20, height: 20 }}
              contentFit="contain"
            />
          </Pressable>
        }
        placeholder={inputProps.placeholder || t('ui.date_placeholder')}
      />

      {Platform.OS === 'ios' ? (
        <Modal visible={showPicker} transparent animationType="slide" onRequestClose={handleCancel}>
          <View className="flex-1 justify-end">
            <Pressable
              className="flex-1"
              onPress={handleCancel}
              accessibilityRole="button"
              accessibilityLabel={t('ui.close_date_picker')}
            />
            <View className="bg-white pb-8">
              <View className="flex-row items-center justify-between border-b border-gray-200 px-4 py-3">
                <Pressable
                  onPress={handleCancel}
                  accessibilityRole="button"
                  accessibilityLabel={t('common.cancel')}>
                  <Text className="text-base text-gray-600">{t('common.cancel')}</Text>
                </Pressable>
                <Pressable
                  onPress={handleConfirm}
                  accessibilityRole="button"
                  accessibilityLabel={t('common.done')}>
                  <Text className="text-base font-semibold text-blue-600">{t('common.done')}</Text>
                </Pressable>
              </View>
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                minimumDate={minimumDate}
                maximumDate={maximumDate}
              />
            </View>
          </View>
        </Modal>
      ) : (
        showPicker && (
          <DateTimePicker
            value={parseValueToDate(value)}
            mode="date"
            display="default"
            onChange={handleDateChange}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
          />
        )
      )}
    </>
  );
};
