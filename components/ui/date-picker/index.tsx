import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React from 'react';
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

const isValidPartialDate = (part: string, type: 'day' | 'month' | 'year'): boolean => {
  if (!part) return true;

  const num = parseInt(part, 10);
  if (isNaN(num)) return false;

  switch (type) {
    case 'day':
      if (part.length === 1) {
        return num >= 0 && num <= 3;
      }
      if (part.length === 2) {
        return num >= 1 && num <= 31;
      }
      return false;

    case 'month':
      if (part.length === 1) {
        return num >= 0 && num <= 1;
      }
      if (part.length === 2) {
        return num >= 1 && num <= 12;
      }
      return false;

    case 'year':
      if (part.length === 1) {
        return num >= 1 && num <= 2;
      }
      if (part.length === 2) {
        const firstTwo = parseInt(part, 10);
        return firstTwo >= 19 && firstTwo <= 29;
      }
      if (part.length === 3) {
        const firstThree = parseInt(part, 10);
        return firstThree >= 190 && firstThree <= 299;
      }
      if (part.length === 4) {
        return num >= 1900 && num <= 2999;
      }
      return false;

    default:
      return true;
  }
};

const applyDateMask = (input: string, previousValue: string): string => {
  const digits = input.replace(/\D/g, '');

  const limited = digits.slice(0, 8);

  let formatted = '';
  for (let i = 0; i < limited.length; i++) {
    if (i === 2) {
      formatted += '.';
    } else if (i === 4) {
      formatted += '.';
    }
    formatted += limited[i];
  }

  const parts = formatted.split('.');
  const day = parts[0] || '';
  const month = parts[1] || '';
  const year = parts[2] || '';

  if (day && !isValidPartialDate(day, 'day')) {
    return previousValue;
  }

  if (month && !isValidPartialDate(month, 'month')) {
    return previousValue;
  }

  if (year && !isValidPartialDate(year, 'year')) {
    return previousValue;
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
  const [displayValue, setDisplayValue] = React.useState(formatDateForDisplay(value));
  const [showPicker, setShowPicker] = React.useState(false);
  const [tempDate, setTempDate] = React.useState<Date>(parseValueToDate(value));

  React.useEffect(() => {
    setDisplayValue(formatDateForDisplay(value));
  }, [value]);

  const handleTextChange = (text: string) => {
    const masked = applyDateMask(text, displayValue);

    setDisplayValue(masked);

    if (masked.length === 10) {
      const apiFormat = formatDateForAPI(masked);
      const [year, month, day] = apiFormat.split('-');

      if (validateDateParts(day, month, year)) {
        const date = new Date(apiFormat);
        if (!isNaN(date.getTime())) {
          onChange?.(apiFormat);
        }
      }
    } else {
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
            accessibilityLabel="Open date picker"
            className="h-full items-center justify-center px-2">
            <Image
              source={require('@/assets/images/calendar-days.svg')}
              style={{ width: 20, height: 20 }}
              contentFit="contain"
            />
          </Pressable>
        }
        placeholder={inputProps.placeholder || 'DD.MM.YYYY'}
      />

      {Platform.OS === 'ios' ? (
        <Modal visible={showPicker} transparent animationType="slide" onRequestClose={handleCancel}>
          <View className="flex-1 justify-end">
            <Pressable
              className="flex-1"
              onPress={handleCancel}
              accessibilityRole="button"
              accessibilityLabel="Close date picker"
            />
            <View className="bg-white pb-8">
              <View className="flex-row items-center justify-between border-b border-gray-200 px-4 py-3">
                <Pressable
                  onPress={handleCancel}
                  accessibilityRole="button"
                  accessibilityLabel="Cancel">
                  <Text className="text-base text-gray-600">Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={handleConfirm}
                  accessibilityRole="button"
                  accessibilityLabel="Done">
                  <Text className="text-base font-semibold text-blue-600">Done</Text>
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
