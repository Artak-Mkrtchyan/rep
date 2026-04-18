import { Stack } from 'expo-router';
import { Image } from 'expo-image';
import { Pressable, Share } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Header } from '@/components/ui/header';

export default function PartnersLayout() {
  const { t } = useTranslation();

  return (
    <Stack>
      <Stack.Screen
        name="brokers"
        options={{
          headerShown: true,
          header: () => (
            <Header
              headerTitle={t('partners.brokers')}
              isStepProgressVisible={false}
            />
          ),
        }}
      />

      <Stack.Screen
        name="construction-companies"
        options={{
          headerShown: true,
          header: () => (
            <Header
              headerTitle={t('partners.construction_companies')}
              isStepProgressVisible={false}
            />
          ),
        }}
      />

      <Stack.Screen
        name="broker/[id]"
        options={{
          headerShown: true,
          header: () => (
            <Header
              headerTitle={t('partners.broker_details')}
              isStepProgressVisible={false}
              rightComponent={
                <Pressable
                  onPress={() => {
                    Share.share({ message: t('partners.broker_details') });
                  }}>
                  <Image
                    style={{ width: 24, height: 24 }}
                    source={require('@/assets/images/share-two-icon.svg')}
                  />
                </Pressable>
              }
            />
          ),
        }}
      />
    </Stack>
  );
}
