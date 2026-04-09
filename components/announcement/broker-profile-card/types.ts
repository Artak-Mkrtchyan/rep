import type { ImageSourcePropType } from 'react-native';

export type BrokerProfileCardProps = {
  avatar?: ImageSourcePropType;
  name: string;
  phone: string;
  email: string;
  rating: number;
  reviewCount: number;
  className?: string;
};
