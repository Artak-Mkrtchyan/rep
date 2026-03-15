import type { ImageSourcePropType } from 'react-native';

export type BrokerCardStat = {
  value: string;
  label: string;
};

export type BrokerCardProps = {
  avatar: ImageSourcePropType;
  name: string;
  rating: number;
  reviewCount: number;
  stats: BrokerCardStat[];
  className?: string;
  onPress?: () => void;
};
