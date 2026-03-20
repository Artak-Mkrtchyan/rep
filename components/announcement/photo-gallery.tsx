import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  type ListRenderItemInfo,
  Modal,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { PaginationIndicator } from '@/components/ui/pagination-indicator';

type PhotoGalleryProps = {
  visible: boolean;
  images: string[];
  initialIndex?: number;
  isFavourite: boolean;
  onClose: () => void;
  onToggleFavourite: () => void;
  onRequestTour?: () => void;
  onContactInfo?: () => void;
};

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  visible,
  images,
  initialIndex = 0,
  isFavourite,
  onClose,
  onToggleFavourite,
  onRequestTour,
  onContactInfo,
}) => {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const flatListRef = useRef<FlatList<string>>(null);

  const imageHeight = width * 0.85;

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(event.nativeEvent.contentOffset.x / width);
      setActiveIndex(index);
    },
    [width]
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<string>) => (
      <View style={{ width, justifyContent: 'center', alignItems: 'center' }}>
        <Image source={{ uri: item }} style={{ width, height: imageHeight }} contentFit="cover" />
      </View>
    ),
    [width, imageHeight]
  );

  const keyExtractor = useCallback((_: string, index: number) => `gallery-${index}`, []);

  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: width,
      offset: width * index,
      index,
    }),
    [width]
  );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <View style={styles.root}>
        <View style={[styles.flex, { paddingTop: insets.top }]}>
          <View style={styles.navBar}>
            <Pressable onPress={onClose} style={styles.navButton} hitSlop={8}>
              <Ionicons name="close" size={28} color="#111111" />
            </Pressable>
            <ThemedText style={styles.navTitle}>{t('announcement.detail.photos')}</ThemedText>
            <Pressable onPress={onToggleFavourite} style={styles.navButton} hitSlop={8}>
              <Ionicons
                name={isFavourite ? 'heart' : 'heart-outline'}
                size={24}
                color={isFavourite ? '#FF3636' : '#111111'}
              />
            </Pressable>
          </View>

          {/* Image area */}
          <View style={styles.imageArea}>
            <FlatList
              ref={flatListRef}
              data={images}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              getItemLayout={getItemLayout}
              initialScrollIndex={initialIndex}
            />
            <PaginationIndicator
              count={images.length}
              activeIndex={activeIndex}
              variant="overlay"
              bottom={12}
            />
            {images.length > 9 && (
              <PaginationIndicator
                count={images.length}
                activeIndex={activeIndex}
                variant="overlay"
                maxDots={0}
                bottom={12}
              />
            )}
          </View>
        </View>

        {/* Bottom bar */}
        <SafeAreaView style={styles.bottomSafe} edges={['bottom']}>
          <View style={styles.bottomBar}>
            <Pressable style={styles.primaryButton} onPress={onRequestTour}>
              <ThemedText style={styles.primaryText}>
                {t('announcement.detail.request_tour')}
              </ThemedText>
            </Pressable>
            <Pressable style={styles.secondaryButton} onPress={onContactInfo}>
              <ThemedText style={styles.secondaryText}>
                {t('announcement.detail.contact_info')}
              </ThemedText>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  flex: {
    flex: 1,
  },
  navBar: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  navButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 24,
    color: '#1B1B1B',
    textAlign: 'center',
  },
  imageArea: {
    flex: 1,
    justifyContent: 'center',
  },
  bottomSafe: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F1F1',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    shadowColor: '#6E6E6E',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 33,
    elevation: 10,
  },
  bottomBar: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 12,
    gap: 12,
  },
  primaryButton: {
    height: 49,
    borderRadius: 12,
    backgroundColor: '#0E9457',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 21,
    color: '#FFFFFF',
  },
  secondaryButton: {
    height: 49,
    borderRadius: 12,
    backgroundColor: '#F1F1F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 21,
    color: '#0E9457',
  },
});
