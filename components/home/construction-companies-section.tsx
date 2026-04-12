import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { ConstructionCompanyCard } from '@/components/home/construction-company-card';
import { HOME_DESIGN } from '@/components/home/home-design-tokens';
import { SectionHeaderRow } from '@/components/home/section-header-row';
import { MOCK_CONSTRUCTION_COMPANIES } from '@/lib/mocks/home-mock-data';
import { PaginationIndicator } from '@/components/ui/pagination-indicator';

const CARD_GAP = 8;
const COMPANY_CARD_MIN_WIDTH = 220;

const styles = StyleSheet.create({
  section: {
    marginTop: HOME_DESIGN.layout.sectionGap,
    gap: HOME_DESIGN.layout.headerToCarousel,
    paddingBottom: 24,
  },
  header: {
    paddingHorizontal: HOME_DESIGN.layout.affordabilityPaddingH,
  },
  track: {
    backgroundColor: HOME_DESIGN.neutral50,
    paddingVertical: 24,
  },
  stripScroll: {
    backgroundColor: HOME_DESIGN.neutral50,
  },
  stripScrollContent: {
    backgroundColor: HOME_DESIGN.neutral50,
  },
});

type ConstructionCompaniesSectionProps = {
  onSeeMorePress?: () => void;
};

export const ConstructionCompaniesSection: React.FC<ConstructionCompaniesSectionProps> = ({
  onSeeMorePress,
}) => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const stride = COMPANY_CARD_MIN_WIDTH + CARD_GAP;
    const index = Math.round(offsetX / stride);
    setActiveIndex(Math.min(Math.max(index, 0), MOCK_CONSTRUCTION_COMPANIES.length - 1));
  }, []);

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <SectionHeaderRow
          title={t('home.companies_title')}
          actionLabel={t('home.see_more')}
          onActionPress={onSeeMorePress}
        />
      </View>

      <View style={styles.track}>
        <ScrollView
          horizontal
          style={styles.stripScroll}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.stripScrollContent, { paddingLeft: 16, paddingRight: 16 }]}
          onScroll={handleScroll}
          scrollEventThrottle={16}>
          {MOCK_CONSTRUCTION_COMPANIES.map((company, index) => (
            <View
              key={company.id}
              style={{
                minWidth: COMPANY_CARD_MIN_WIDTH,
                marginRight: index < MOCK_CONSTRUCTION_COMPANIES.length - 1 ? CARD_GAP : 0,
              }}>
              <ConstructionCompanyCard
                name={company.name}
                rating={company.rating}
                logoUri={company.logoUri}
              />
            </View>
          ))}
        </ScrollView>
      </View>

      <PaginationIndicator
        count={MOCK_CONSTRUCTION_COMPANIES.length}
        activeIndex={activeIndex}
        variant="inline"
        inlineMarginTop={HOME_DESIGN.layout.carouselToDots}
      />
    </View>
  );
};
