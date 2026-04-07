import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { Header } from '@/components/ui/header';

export default function MyAnnouncementsLayout() {
  const { t } = useTranslation();

  return (
    <Stack>
      <Stack.Screen
        key="index"
        name="index"
        options={{
          headerShown: true,
          header: () => (
            <Header headerTitle={t('announcement.title')} isStepProgressVisible={false} />
          ),
        }}
      />
    </Stack>
  );
}
