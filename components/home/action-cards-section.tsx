import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';

import { ActionCard } from '@/components/home/action-card';
import { HOME_DESIGN } from '@/components/home/home-design-tokens';
import { SectionHeaderRow } from '@/components/home/section-header-row';
import { HOME_ACTION_CARDS, type ActionCardConfig } from '@/constants/action-cards';
import { PaginationIndicator } from '@/components/ui/pagination-indicator';
import type { SearchFilters } from '@/types/search';

type ActionCardsSectionProps = {
  onSearchAction: (filters: SearchFilters) => void;
  onAuthGatedAction: (route: string) => void;
};

const CARD_GAP = HOME_DESIGN.layout.carouselCardGap;
const HORIZONTAL_PAD = HOME_DESIGN.layout.affordabilityPaddingH;

export const ActionCardsSection: React.FC<ActionCardsSectionProps> = ({
  onSearchAction,
  onAuthGatedAction,
}) => {
  const { t } = useTranslation();
  const { width: screenWidth } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);

  const cardWidth = screenWidth * 0.7;
  const stride = cardWidth + CARD_GAP;

  const handlePress = useCallback(
    (card: ActionCardConfig) => {
      if (card.action.type === 'search') {
        onSearchAction(card.action.filters);
      } else {
        onAuthGatedAction(card.action.authenticatedRoute);
      }
    },
    [onSearchAction, onAuthGatedAction]
  );

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / stride);
      setActiveIndex(Math.min(Math.max(index, 0), HOME_ACTION_CARDS.length - 1));
    },
    [stride]
  );

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <SectionHeaderRow title={t('home.find_your_place')} />
      </View>

      <View style={styles.track}>
        <ScrollView
          horizontal
          style={styles.stripScroll}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.stripScrollContent,
            { paddingLeft: HORIZONTAL_PAD, paddingRight: HORIZONTAL_PAD },
          ]}
          onScroll={handleScroll}
          scrollEventThrottle={16}>
          {HOME_ACTION_CARDS.map((card, index) => (
            <View
              key={card.id}
              style={{
                width: cardWidth,
                marginRight: index < HOME_ACTION_CARDS.length - 1 ? CARD_GAP : 0,
              }}>
              <ActionCard
                title={t(card.titleKey)}
                description={t(card.descriptionKey)}
                buttonText={t(card.buttonTextKey)}
                image={card.image}
                onPress={() => handlePress(card)}
              />
            </View>
          ))}
        </ScrollView>
      </View>

      <PaginationIndicator
        count={HOME_ACTION_CARDS.length}
        activeIndex={activeIndex}
        variant="inline"
        inlineMarginTop={HOME_DESIGN.layout.carouselToDots}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: HOME_DESIGN.layout.sectionGap,
    gap: HOME_DESIGN.layout.headerToCarousel,
  },
  header: {
    paddingHorizontal: HORIZONTAL_PAD,
  },
  track: {
    backgroundColor: HOME_DESIGN.neutral50,
    paddingVertical: 20,
  },
  stripScroll: {
    backgroundColor: HOME_DESIGN.neutral50,
  },
  stripScrollContent: {
    backgroundColor: HOME_DESIGN.neutral50,
  },
});
