import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Linking,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { announcementsService } from '@/lib/api/announcements';
import type { AnnouncementFullInfoDto } from '@/types/api';

type ContactInfoModalProps = {
  visible: boolean;
  announcementId: string;
  brokerId?: string;
  onClose: () => void;
};

export const ContactInfoModal: React.FC<ContactInfoModalProps> = ({
  visible,
  announcementId,
  brokerId,
  onClose,
}) => {
  const { t } = useTranslation();
  const [data, setData] = useState<AnnouncementFullInfoDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    setIsLoading(true);

    announcementsService
      .getAnnouncementFullInfo(announcementId)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [visible, announcementId]);

  const contact = React.useMemo(() => {
    if (!data) return null;

    if (brokerId && data.assignedBroker) {
      return {
        name: data.assignedBroker.fullName,
        avatarUrl:
          data.assignedBroker.avatarInfo?.thumbnailUrl || data.assignedBroker.avatarInfo?.url,
        phone: data.assignedBroker.phoneNumber,
        email: data.assignedBroker.email,
        type: t('announcement.contact.broker'),
      };
    }

    if (data.createdBy) {
      return {
        name: data.createdBy.fullName,
        avatarUrl: data.createdBy.avatarInfo?.thumbnailUrl || data.createdBy.avatarInfo?.url,
        phone: data.createdBy.phone,
        email: data.createdBy.email,
        type: t('announcement.contact.individual_user'),
      };
    }

    return null;
  }, [data, brokerId, t]);

  const handleCall = useCallback(() => {
    if (contact?.phone) Linking.openURL(`tel:${contact.phone}`).catch(() => {});
  }, [contact]);

  const handleEmail = useCallback(() => {
    if (contact?.email) Linking.openURL(`mailto:${contact.email}`).catch(() => {});
  }, [contact]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={[styles.sheet, { paddingBottom: Platform.OS === 'ios' ? 34 : 16 }]}>
          <View style={styles.closeRow}>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#111111" />
            </Pressable>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>{t('announcement.contact.title')}</Text>
            <Text style={styles.subtitle}>{t('announcement.contact.subtitle')}</Text>

            {isLoading ? (
              <View style={styles.center}>
                <ActivityIndicator size="large" />
              </View>
            ) : contact ? (
              <View style={styles.card}>
                <View style={styles.userRow}>
                  {contact.avatarUrl ? (
                    <Image
                      source={{ uri: contact.avatarUrl }}
                      style={styles.avatar}
                      contentFit="cover"
                    />
                  ) : (
                    <View style={styles.avatarPlaceholder}>
                      <Ionicons name="person" size={28} color="#ABABAB" />
                    </View>
                  )}
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{contact.name}</Text>
                    <Text style={styles.userType}>{contact.type}</Text>
                  </View>
                </View>

                <View style={styles.actions}>
                  {contact.phone ? (
                    <Pressable onPress={handleCall} style={styles.actionButton}>
                      <Ionicons name="call-outline" size={20} color="#111111" />
                      <Text style={styles.actionText}>{contact.phone}</Text>
                    </Pressable>
                  ) : null}

                  {contact.email ? (
                    <Pressable onPress={handleEmail} style={styles.actionButton}>
                      <Ionicons name="mail-outline" size={20} color="#111111" />
                      <Text style={styles.actionText}>{contact.email}</Text>
                    </Pressable>
                  ) : null}
                </View>
              </View>
            ) : (
              <View style={styles.center}>
                <Text style={styles.notAvailable}>
                  {t('announcement.contact.not_available')}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: '50%',
  },
  closeRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111111',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: '#777777',
    textAlign: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginTop: 24,
    width: '100%',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    padding: 20,
    shadowColor: '#6E6E6E',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F1F1F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111111',
  },
  userType: {
    fontSize: 14,
    color: '#777777',
  },
  actions: {
    marginTop: 16,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    shadowColor: '#2B2B2B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  actionText: {
    fontSize: 16,
    color: '#111111',
  },
  notAvailable: {
    fontSize: 14,
    color: '#777777',
  },
});
