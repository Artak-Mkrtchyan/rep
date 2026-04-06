import { Redirect, router, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { Header } from '@/components/ui/header';
import { ANNOUNCEMENT_ROUTES } from '@/constants/announcement';
import { useStepRedirect } from '@/hooks/use-announcement';
import { getTargetRoute } from '@/lib/announcement';
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

  const handleBackPress = (step: number, routeName: string) => {
    if (
      routeName === ANNOUNCEMENT_ROUTES.RENT_BROKER_LIST.name ||
      routeName === ANNOUNCEMENT_ROUTES.RENT_PROPERTY_INFO_SECOND.name ||
      routeName === ANNOUNCEMENT_ROUTES.RENT_MEDIA_SECOND.name
    ) {
      const href = getTargetRoute(step);
      router.replace(href);
      return;
    }

    if (step === 1) {
      router.back();
      return;
    }

    setCurrentStep(--step);
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
        key="[id]"
        name="[id]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
