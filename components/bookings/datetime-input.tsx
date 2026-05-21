import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { InputError } from '@/components/ui/input/error';
import { InputLabel } from '@/components/ui/input/label';
import { cn } from '@/lib/utils';

import { formatDateTime } from './format';

interface Props {
  label?: string;
  /** ISO datetime string. */
  value?: string;
  /** Called with an ISO string. Pass undefined when cleared. */
  onChange: (iso: string | undefined) => void;
  placeholder?: string;
  error?: string;
  minimumDate?: Date;
  disabled?: boolean;
  containerClassName?: string;
}

type AndroidStep = 'date' | 'time' | null;

const SCREEN_HEIGHT = Dimensions.get('window').height;

/**
 * Combined date + time input field used by the booking create form.
 *
 * Renders a tappable trigger styled like the rest of the app's inputs.
 * On iOS opens a single modal with `mode="datetime"`. On Android first asks
 * for the date, then re-opens the picker in `time` mode to pick the hour.
 */
export const DateTimeInput: React.FC<Props> = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  minimumDate,
  disabled,
  containerClassName,
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const [iosOpen, setIosOpen] = useState(false);
  const [iosDraft, setIosDraft] = useState<Date | null>(null);
  const [androidStep, setAndroidStep] = useState<AndroidStep>(null);
  const [androidDraft, setAndroidDraft] = useState<Date | null>(null);

  // Backdrop fades; sheet slides — same treatment as the other booking sheets.
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (iosOpen) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 280,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      slideAnim.setValue(SCREEN_HEIGHT);
      backdropAnim.setValue(0);
    }
  }, [iosOpen, slideAnim, backdropAnim]);

  const currentDate = useMemo(() => (value ? new Date(value) : new Date()), [value]);
  const display = formatDateTime(value, lang);
  const placeholderResolved = placeholder ?? t('booking.select_date_time');

  const handleOpen = useCallback(() => {
    if (disabled) return;
    if (Platform.OS === 'ios') {
      setIosDraft(currentDate);
      setIosOpen(true);
      return;
    }
    setAndroidDraft(currentDate);
    setAndroidStep('date');
  }, [currentDate, disabled]);

  const handleAndroidChange = useCallback(
    (event: DateTimePickerEvent, picked?: Date) => {
      if (event.type === 'dismissed') {
        setAndroidStep(null);
        setAndroidDraft(null);
        return;
      }
      if (!picked) return;

      if (androidStep === 'date') {
        setAndroidDraft(picked);
        setAndroidStep('time');
      } else if (androidStep === 'time') {
        const base = androidDraft ?? picked;
        const merged = new Date(
          base.getFullYear(),
          base.getMonth(),
          base.getDate(),
          picked.getHours(),
          picked.getMinutes(),
          0,
          0
        );
        onChange(merged.toISOString());
        setAndroidStep(null);
        setAndroidDraft(null);
      }
    },
    [androidDraft, androidStep, onChange]
  );

  const handleIosConfirm = useCallback(() => {
    if (iosDraft) {
      onChange(iosDraft.toISOString());
    }
    setIosOpen(false);
  }, [iosDraft, onChange]);

  const handleIosCancel = useCallback(() => {
    setIosOpen(false);
  }, []);

  return (
    <View className={cn('w-full gap-1', containerClassName)}>
      {label ? <InputLabel>{label}</InputLabel> : null}

      <Pressable
        onPress={handleOpen}
        accessibilityRole="button"
        accessibilityLabel={label ?? placeholderResolved}
        accessibilityState={{ disabled: !!disabled }}
        className={cn(
          'h-12 flex-row items-center justify-between rounded-[12px] border bg-card px-3',
          disabled && 'opacity-50',
          error ? 'border-destructive' : 'border-default'
        )}>
        <ThemedText
          className={cn(
            'text-[16px] font-regular',
            display ? 'text-foreground' : 'text-muted-foreground'
          )}>
          {display || placeholderResolved}
        </ThemedText>
        <Ionicons name="calendar-outline" size={20} color="#919191" />
      </Pressable>

      {error ? <InputError>{error}</InputError> : null}

      {/* Android: native dialog, two-step */}
      {Platform.OS === 'android' && androidStep ? (
        <DateTimePicker
          mode={androidStep}
          value={androidDraft ?? currentDate}
          onChange={handleAndroidChange}
          minimumDate={minimumDate}
          is24Hour
        />
      ) : null}

      {/* iOS: spinner inside a custom modal */}
      {Platform.OS === 'ios' ? (
        <Modal
          visible={iosOpen}
          transparent
          animationType="none"
          onRequestClose={handleIosCancel}>
          <View className="flex-1 justify-end">
            <Animated.View
              style={[
                StyleSheet.absoluteFillObject,
                { backgroundColor: 'rgba(0,0,0,0.5)', opacity: backdropAnim },
              ]}>
              <Pressable
                style={{ flex: 1 }}
                onPress={handleIosCancel}
                accessibilityRole="button"
                accessibilityLabel={t('common.close')}
              />
            </Animated.View>
            <Animated.View
              className="rounded-t-[24px] bg-white px-4 pt-4 pb-6"
              style={{ transform: [{ translateY: slideAnim }] }}>
              <View className="mb-2 flex-row items-center justify-between">
                <Pressable onPress={handleIosCancel} accessibilityRole="button">
                  <ThemedText className="text-[16px] text-neutral-500">
                    {t('common.cancel')}
                  </ThemedText>
                </Pressable>
                <ThemedText className="text-[16px] font-semibold text-foreground">
                  {label ?? placeholderResolved}
                </ThemedText>
                <Pressable onPress={handleIosConfirm} accessibilityRole="button">
                  <ThemedText className="text-[16px] font-semibold text-primary">
                    {t('common.done')}
                  </ThemedText>
                </Pressable>
              </View>
              <DateTimePicker
                mode="datetime"
                value={iosDraft ?? currentDate}
                display="spinner"
                onChange={(_event, picked) => {
                  if (picked) setIosDraft(picked);
                }}
                minimumDate={minimumDate}
                themeVariant="light"
              />
              <Button onPress={handleIosConfirm}>{t('common.done')}</Button>
            </Animated.View>
          </View>
        </Modal>
      ) : null}
    </View>
  );
};
