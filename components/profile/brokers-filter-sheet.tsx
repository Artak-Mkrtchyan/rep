import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BrokerEmployeePosition, BrokerEmployeeStatus } from '@/types/brokers';

const FOOTER_SHADOW = {
  shadowColor: '#6E6E6E',
  shadowOffset: { width: 0, height: -3 },
  shadowOpacity: 0.1,
  shadowRadius: 12,
  elevation: 4,
};

interface Chip<T> {
  value: T;
  label: string;
}

interface ToggleChipProps<T> {
  chip: Chip<T>;
  selected: boolean;
  onPress: () => void;
}

function ToggleChip<T>({ chip, selected, onPress }: ToggleChipProps<T>) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      className={cn(
        'rounded-full border px-4 py-3',
        selected ? 'border-primary bg-primary/10' : 'border-default bg-white'
      )}>
      <ThemedText
        className={cn(
          'text-[12px] leading-[12px]',
          selected ? 'font-medium text-primary' : 'font-regular text-foreground'
        )}>
        {chip.label}
      </ThemedText>
    </Pressable>
  );
}

interface Props {
  visible: boolean;
  initialPositions: BrokerEmployeePosition[];
  initialStatus: BrokerEmployeeStatus[];
  onApply: (positions: BrokerEmployeePosition[], status: BrokerEmployeeStatus[]) => void;
  onClose: () => void;
}

const SCREEN_HEIGHT = Dimensions.get('window').height;

export const BrokersFilterSheet: React.FC<Props> = ({
  visible,
  initialPositions,
  initialStatus,
  onApply,
  onClose,
}) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const [positions, setPositions] = useState<BrokerEmployeePosition[]>(initialPositions);
  const [status, setStatus] = useState<BrokerEmployeeStatus[]>(initialStatus);

  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
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
  }, [visible, slideAnim, backdropAnim]);

  useEffect(() => {
    if (visible) {
      setPositions(initialPositions);
      setStatus(initialStatus);
    }
  }, [visible, initialPositions, initialStatus]);

  const togglePosition = useCallback((pos: BrokerEmployeePosition) => {
    setPositions((prev) => (prev.includes(pos) ? prev.filter((p) => p !== pos) : [...prev, pos]));
  }, []);

  const toggleStatus = useCallback((stat: BrokerEmployeeStatus) => {
    setStatus((prev) => (prev.includes(stat) ? prev.filter((s) => s !== stat) : [...prev, stat]));
  }, []);

  const handleReset = useCallback(() => {
    setPositions([]);
    setStatus([]);
  }, []);

  const handleApply = useCallback(() => {
    onApply(positions, status);
  }, [onApply, positions, status]);

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent>
      <View className="flex-1">
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: 'rgba(0,0,0,0.4)', opacity: backdropAnim },
          ]}>
          <Pressable
            style={{ flex: 1 }}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel={t('common.close')}
          />
        </Animated.View>
        <Animated.View
          className="flex-1 rounded-t-[24px] bg-neutral-50"
          style={{
            transform: [{ translateY: slideAnim }],
          }}>
          <View
            className="flex-row items-center justify-between bg-white px-4 pb-3"
            style={{ paddingTop: insets.top + 12 }}>
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              hitSlop={8}
              className="h-10 w-10 items-center justify-center">
              <Ionicons name="chevron-back" size={24} color="#111111" />
            </Pressable>
            <ThemedText className="text-[20px] font-semibold leading-[24px] text-foreground">
              {t('booking.filter.title', 'Filters')}
            </ThemedText>
            <Pressable onPress={handleReset} accessibilityRole="button" hitSlop={8}>
              <ThemedText className="font-regular text-[17px] leading-[22px] text-primary">
                {t('booking.filter.reset', 'Reset')}
              </ThemedText>
            </Pressable>
          </View>

          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 24 }}
            keyboardShouldPersistTaps="handled">
            {/* Position filter */}
            <View className="mx-4 mt-4 rounded-[24px] border-b border-neutral-50 bg-white px-4 py-6">
              <ThemedText className="mb-3 text-[16px] font-bold text-foreground">
                {t('brokers_management.table.position', 'Position')}
              </ThemedText>
              <View className="flex-row flex-wrap gap-3">
                <ToggleChip
                  chip={{
                    value: BrokerEmployeePosition.MANAGER,
                    label: t('brokers_management.filter.position.manager', 'Manager'),
                  }}
                  selected={positions.includes(BrokerEmployeePosition.MANAGER)}
                  onPress={() => togglePosition(BrokerEmployeePosition.MANAGER)}
                />
                <ToggleChip
                  chip={{
                    value: BrokerEmployeePosition.AGENT,
                    label: t('brokers_management.filter.position.employee', 'Employee'),
                  }}
                  selected={positions.includes(BrokerEmployeePosition.AGENT)}
                  onPress={() => togglePosition(BrokerEmployeePosition.AGENT)}
                />
              </View>
            </View>

            {/* Status filter */}
            <View className="mx-4 mt-4 rounded-[24px] border-b border-neutral-50 bg-white px-4 py-6">
              <ThemedText className="mb-3 text-[16px] font-bold text-foreground">
                {t('brokers_management.table.status', 'Status')}
              </ThemedText>
              <View className="flex-row flex-wrap gap-3">
                <ToggleChip
                  chip={{
                    value: BrokerEmployeeStatus.ACTIVE,
                    label: t('brokers_management.status.active', 'Active'),
                  }}
                  selected={status.includes(BrokerEmployeeStatus.ACTIVE)}
                  onPress={() => toggleStatus(BrokerEmployeeStatus.ACTIVE)}
                />
                <ToggleChip
                  chip={{
                    value: BrokerEmployeeStatus.REGISTRATION_INITIATED,
                    label: t('brokers_management.status.registration_initiated', 'Pending'),
                  }}
                  selected={status.includes(BrokerEmployeeStatus.REGISTRATION_INITIATED)}
                  onPress={() => toggleStatus(BrokerEmployeeStatus.REGISTRATION_INITIATED)}
                />
              </View>
            </View>
          </ScrollView>

          <View
            className="rounded-t-[12px] border-t border-neutral-50 bg-white px-4 pt-6"
            style={[FOOTER_SHADOW, { paddingBottom: insets.bottom + 12 }]}>
            <Button onPress={handleApply}>{t('booking.filter.apply', 'Apply')}</Button>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};
