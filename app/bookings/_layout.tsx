import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { Header } from '@/components/ui/header';

export default function BookingsLayout() {
  const { t } = useTranslation();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: true,
          header: () => (
            <Header
              headerTitle={t('booking.details.title')}
              isStepProgressVisible={false}
            />
          ),
        }}
      />
    </Stack>
  );
}
