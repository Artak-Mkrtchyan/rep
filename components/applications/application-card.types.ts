import { AnnouncementPublicationListResponse } from '@/lib/api/applications';

export type ApplicationCardProps = {
  item: Partial<AnnouncementPublicationListResponse>;
  onPress?: () => void;
  onAddBrokerPress?: () => void;
  onDeletePress?: () => void;
  onUserPress?: (type: 'broker' | 'company' | 'creator') => void;
  className?: string;
};
