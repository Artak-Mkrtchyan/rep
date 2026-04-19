import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MenuAccordionItem } from '@/components/menu/menu-accordion-item';
import { ThemedView } from '@/components/themed-view';
import { useScreenEdgePadding } from '@/hooks/use-screen-edge-padding';
import { MENU_SECTIONS } from '@/constants/search';

export default function MenuScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { horizontalStyle } = useScreenEdgePadding();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const handleToggle = useCallback((index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  }, []);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleItemPress = useCallback(
    (item: string, sectionTitle: string) => {
      if (sectionTitle === 'Partners' && item === 'Brokers') {
        router.push('/partners/brokers');
      }
      if (sectionTitle === 'Partners' && item === 'Construction companies') {
        router.push('/partners/construction-companies');
      }
    },
    [router]
  );

  return (
    <ThemedView className="flex-1">
      <SafeAreaView className="flex-1" edges={['top']}>
        <View style={horizontalStyle}>
          <Pressable
            onPress={handleBack}
            className="h-10 w-10 items-center justify-center"
            accessibilityLabel={t('common.go_back')}
            accessibilityRole="button">
            <Ionicons name="chevron-back" size={24} color="#111111" />
          </Pressable>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {MENU_SECTIONS.map((section, index) => (
            <MenuAccordionItem
              key={section.title}
              title={section.title}
              items={section.items}
              isExpanded={expandedIndex === index}
              onToggle={() => handleToggle(index)}
              onItemPress={(item) => handleItemPress(item, section.title)}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}
