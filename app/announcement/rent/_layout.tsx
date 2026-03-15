import { Redirect, router, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { AnnouncementHeader } from '@/components/announcement/announcement-header';
import { ANNOUNCEMENT_ROUTES } from '@/constants/announcement';
import { useStepRedirect } from '@/hooks/use-announcement';
import { useAnnouncementForRentFormStore } from '@/store/announcementStore';
import { Image } from 'expo-image';
import { Pressable } from 'react-native';

export default function AnnouncementRentLayout() {
  const { t } = useTranslation();
  const { shouldRedirect, targetRoute } = useStepRedirect();
  const setCurrentStep = useAnnouncementForRentFormStore((s) => s.setCurrentStep);

  if (shouldRedirect && targetRoute) {
    return <Redirect href={targetRoute} />;
  }

  const handleBackPress = (step: number) => {
    if (step === 1) {
      router.push('/(tabs)');
    } else {
      setCurrentStep(--step);
    }
  };

  return (
    <Stack>
      {Object.values(ANNOUNCEMENT_ROUTES).map((route) => (
        <Stack.Screen
          key={route.name}
          name={route.name}
          options={{
            headerShown: true,
            header: () => (
              <AnnouncementHeader
                label={t(route.labelKey)}
                completedStep={route.completedStep}
                onHandleBackPress={() => handleBackPress(route.completedStep)}
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
            <AnnouncementHeader
              headerTitle="Broker details"
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
    </Stack>
  );
}
