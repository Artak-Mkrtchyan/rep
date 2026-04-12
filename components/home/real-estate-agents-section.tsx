import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { AgentCard } from '@/components/home/agent-card';
import { HOME_DESIGN } from '@/components/home/home-design-tokens';
import { SectionHeaderRow } from '@/components/home/section-header-row';
import { useHomeMetrics } from '@/hooks/use-home-metrics';
import { MOCK_AGENTS } from '@/lib/mocks/home-mock-data';
import { PaginationIndicator } from '@/components/ui/pagination-indicator';

const styles = StyleSheet.create({
  section: {
    marginTop: HOME_DESIGN.layout.sectionGap,
    gap: HOME_DESIGN.layout.headerToCarousel,
  },
  header: {
    paddingHorizontal: HOME_DESIGN.layout.affordabilityPaddingH,
  },
  track: {
    backgroundColor: HOME_DESIGN.neutral50,
    paddingVertical: 16,
  },
  /** ScrollView defaults can show through `gap` between cards — keep strip color continuous */
  stripScroll: {
    backgroundColor: HOME_DESIGN.neutral50,
  },
  stripScrollContent: {
    backgroundColor: HOME_DESIGN.neutral50,
  },
});

type RealEstateAgentsSectionProps = {
  onSeeMorePress?: () => void;
};

export const RealEstateAgentsSection: React.FC<RealEstateAgentsSectionProps> = ({
  onSeeMorePress,
}) => {
  const { t } = useTranslation();
  const metrics = useHomeMetrics();
  const [activeIndex, setActiveIndex] = useState(0);
  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / metrics.agentStride);
      setActiveIndex(Math.min(Math.max(index, 0), MOCK_AGENTS.length - 1));
    },
    [metrics.agentStride]
  );

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <SectionHeaderRow
          title={t('home.agents_title')}
          actionLabel={t('home.see_more')}
          onActionPress={onSeeMorePress}
        />
      </View>

      <View style={styles.track}>
        <ScrollView
          horizontal
          style={styles.stripScroll}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.stripScrollContent,
            { paddingLeft: metrics.horizontalPad, paddingRight: metrics.horizontalPad },
          ]}
          onScroll={handleScroll}
          scrollEventThrottle={16}>
          {MOCK_AGENTS.map((agent, index) => (
            <View
              key={agent.id}
              style={{
                width: metrics.agentCardWidth,
                marginRight: index < MOCK_AGENTS.length - 1 ? metrics.gap : 0,
              }}>
              <AgentCard
                name={agent.name}
                company={agent.company}
                rating={agent.rating}
                reviewCount={agent.reviewCount}
                avatarUri={agent.avatarUri}
              />
            </View>
          ))}
        </ScrollView>
      </View>

      <PaginationIndicator
        count={MOCK_AGENTS.length}
        activeIndex={activeIndex}
        variant="inline"
        inlineMarginTop={HOME_DESIGN.layout.carouselToDots}
      />
    </View>
  );
};
