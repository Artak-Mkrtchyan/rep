import type { BrokerCardProps, BrokerCardStat } from '@/components/announcement/broker-card';
import type { IndividualBroker, BrokerCompany } from '@/types/applications';

const PLACEHOLDER_STATS: BrokerCardStat[] = [
  { value: '$38', label: 'sales last 12months' },
  { value: '$248', label: 'sales in 12 Chicago' },
];

export function mapIndividualBrokerToCardProps(
  broker: IndividualBroker
): Omit<BrokerCardProps, 'onPress' | 'isSelected' | 'className'> {
  return {
    name: broker.fullName,
    rating: 5.0,
    reviewCount: 1024,
    stats: PLACEHOLDER_STATS,
  };
}

export function mapBrokerCompanyToCardProps(
  broker: BrokerCompany
): Omit<BrokerCardProps, 'onPress' | 'isSelected' | 'className'> {
  return {
    name: broker.name,
    rating: 5.0,
    reviewCount: 1024,
    stats: PLACEHOLDER_STATS,
  };
}
