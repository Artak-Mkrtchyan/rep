import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { Header } from '@/components/ui/header';
import { ANNOUNCEMENT_ROUTES } from '@/constants/announcement';
import { useHandleBackPress, useStepRedirect } from '@/hooks/use-announcement';
import { Image } from 'expo-image';
import { Pressable } from 'react-native';

export default function AnnouncementRentLayout() {
  const { t } = useTranslation();
  // Side effect: redirects once on mount if persisted step disagrees with pathname.
  useStepRedirect();
  const handleBackPress = useHandleBackPress();

  return (
    <Stack
      screenOptions={{
        animation: 'slide_from_right',
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}>
      {Object.values(ANNOUNCEMENT_ROUTES).map((route) => (
        <Stack.Screen
          key={route.name}
          name={route.name}
          options={{
            headerShown: true,
            header: () => (
              <Header
                headerTitle={t('announcement.add')}
                label={t(route.labelKey)}
                completedStep={route.completedStep}
                onHandleBackPress={() => handleBackPress(route.completedStep, route.name)}
              />
            ),
          }}
        />
      ))}

      <Stack.Screen
        key="broker/[id]"
        name="broker/[id]"
        options={{
          headerShown: true,
          header: () => (
            <Header
              headerTitle={t('announcement.broker_details')}
              isStepProgressVisible={false}
              rightComponent={
                <Pressable onPress={() => {}}>
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

      <Stack.Screen
        key="broker-selected"
        name="broker-selected"
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />

      <Stack.Screen
        key="[id]"
        name="[id]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
