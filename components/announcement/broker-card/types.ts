import type { ImageSourcePropType } from 'react-native';

export type BrokerCardStat = {
  value: string;
  label: string;
};

export type BrokerCardProps = {
  isSelected?: boolean;
  avatar?: ImageSourcePropType | string;
  name: string;
  phone?: string;
  email?: string;
  certifiedOn?: string;
  certifiedBy?: string;
  yearsOfActivity?: number;
  rating?: number;
  reviewCount?: number;
  stats?: BrokerCardStat[];
  className?: string;
  onPress?: () => void;
};
