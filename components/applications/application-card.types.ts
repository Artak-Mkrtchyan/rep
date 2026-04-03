import { AnnouncementPublicationResponse } from '@/lib/api/applications';

export type ApplicationCardProps = {
  item: Partial<AnnouncementPublicationResponse>;
  onPress?: () => void;
  onAddBrokerPress?: () => void;
  className?: string;
};
