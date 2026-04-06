import { AnnouncementPublicationListResponse } from '@/lib/api/applications';

export type ApplicationCardProps = {
  item: Partial<AnnouncementPublicationListResponse>;
  onPress?: () => void;
  onAddBrokerPress?: () => void;
  className?: string;
};
