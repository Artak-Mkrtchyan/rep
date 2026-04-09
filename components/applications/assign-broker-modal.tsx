import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, FlatList, Modal, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { useAssignBroker, useSearchIndividualBrokersInfinite } from '@/hooks/api/use-applications';
import { cn } from '@/lib/utils';
import { initialsFrom } from '@/lib/utils/initials';
import type { IndividualBroker } from '@/types/applications';

const PAGE_SIZE = 15;
const ON_END_THRESHOLD = 0.35;

const FOOTER_CARD_SHADOW = {
  shadowColor: '#6E6E6E',
  shadowOffset: { width: 2, height: 3 },
  shadowOpacity: 0.15,
  shadowRadius: 33,
  elevation: 4,
};

export type AssignBrokerModalProps = {
  visible: boolean;
  applicationId: string;
  onClose: () => void;
};

export const AssignBrokerModal = ({ visible, applicationId, onClose }: AssignBrokerModalProps) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [selectedBrokerId, setSelectedBrokerId] = useState<string | null>(null);

  const query = useSearchIndividualBrokersInfinite('', PAGE_SIZE, visible);

  const brokers = useMemo(() => query.data?.pages.flatMap((p) => p.content) ?? [], [query.data]);

  const { mutateAsync: assignBroker, isPending: isAssigning } = useAssignBroker();

  useEffect(() => {
    if (visible) {
      setSelectedBrokerId(null);
    }
  }, [visible]);

  const handleLoadMore = useCallback(() => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      void query.fetchNextPage();
    }
  }, [query]);

  const handleAssign = async () => {
    if (!selectedBrokerId || !applicationId) {
      return;
    }
    try {
      await assignBroker({
        id: applicationId,
        data: { brokerId: selectedBrokerId },
      });
      onClose();
    } catch {
      Alert.alert(t('common.error'), t('applications.assign_broker.error'));
    }
  };

  const handleSelectBroker = useCallback((id: string) => {
    setSelectedBrokerId((prev) => (prev === id ? null : id));
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: IndividualBroker }) => {
      const isSelected = selectedBrokerId === item.id;
      return (
        <Pressable
          onPress={() => handleSelectBroker(item.id)}
          className={cn('rounded-[8px] px-2 pt-2', isSelected && 'border border-main-500')}
          accessibilityRole="button"
          accessibilityState={{ selected: isSelected }}
          accessibilityLabel={`${item.fullName}, ${item.email}`}>
          <View className="flex-row items-start gap-2">
            <View className="h-[34px] w-[34px] items-center justify-center overflow-hidden rounded-full bg-neutral-100">
              <ThemedText className="text-[12px] font-bold text-neutral-600">
                {initialsFrom(item.fullName)}
              </ThemedText>
            </View>
            <View className="min-w-0 flex-1 gap-0.5">
              <ThemedText
                className="text-[14px] font-semibold leading-[17px] text-foreground"
                numberOfLines={1}>
                {item.fullName}
              </ThemedText>
              <ThemedText
                className="text-[12px] font-normal leading-normal text-neutral-500"
                numberOfLines={1}>
                {item.email}
              </ThemedText>
            </View>
          </View>
          <View className="mt-2 h-px w-full bg-neutral-50" accessibilityElementsHidden />
        </Pressable>
      );
    },
    [handleSelectBroker, selectedBrokerId]
  );

  const listFooter = query.isFetchingNextPage ? (
    <View className="py-4">
      <ActivityIndicator />
    </View>
  ) : null;

  const isInitialLoading = query.isLoading && brokers.length === 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent>
      <View className="flex-1 justify-end bg-black/50">
        <Pressable
          className="absolute inset-0"
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel={t('applications.assign_broker.close_a11y')}
        />
        <View className="h-[80%] rounded-t-[24px] bg-white">
          <View className="items-center px-4 pb-3 pt-4">
            <View className="w-full flex-row items-center justify-end">
              <Pressable
                onPress={onClose}
                className="h-10 w-10 items-center justify-center"
                accessibilityRole="button"
                accessibilityLabel={t('applications.assign_broker.close_a11y')}
                hitSlop={8}>
                <Ionicons name="close" size={24} color="#111111" />
              </Pressable>
            </View>

            <ThemedText className="px-10 text-center text-[18px] font-semibold text-foreground">
              {t('applications.assign_broker.title')}
            </ThemedText>

            <ThemedText className="mt-2 w-[295px] text-center text-[13px] leading-[18px] text-neutral-500">
              {t('applications.assign_broker.subtitle')}
            </ThemedText>
          </View>

          {isInitialLoading ? (
            <View
              className="mx-4 mb-2 h-[420px] items-center justify-center overflow-hidden rounded-[8px] bg-white px-1 py-0.5"
              style={FOOTER_CARD_SHADOW}>
              <ActivityIndicator />
            </View>
          ) : (
            <View
              className="mx-4 flex-1 rounded-t-[8px] bg-white px-1 py-0.5"
              style={FOOTER_CARD_SHADOW}>
              <FlatList
                data={brokers}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                ListEmptyComponent={
                  <View className="items-center px-2 py-10">
                    <ThemedText className="text-center text-[14px] text-neutral-500">
                      {t('applications.assign_broker.empty')}
                    </ThemedText>
                  </View>
                }
                ListFooterComponent={listFooter}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={ON_END_THRESHOLD}
                showsVerticalScrollIndicator
                keyboardShouldPersistTaps="handled"
              />
            </View>
          )}

          <View
            className={cn(
              `min-h-[95px] rounded-t-[12px] border-t border-neutral-50 bg-white px-4 pt-[14px]`,
              `pb-[${insets.bottom + 14}px]`
            )}
            style={FOOTER_CARD_SHADOW}>
            <Button
              onPress={handleAssign}
              disabled={!selectedBrokerId || isAssigning}
              accessibilityLabel={t('applications.assign_broker.assign')}>
              {isAssigning ? (
                <View className="flex-row items-center justify-center gap-2">
                  <ActivityIndicator color="#666" />
                </View>
              ) : (
                t('applications.assign_broker.assign')
              )}
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};
