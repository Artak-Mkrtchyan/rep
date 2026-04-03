import { Stack } from 'expo-router';

import { Header } from '@/components/ui/header';
import { useTranslation } from 'react-i18next';

export default function ApplicationsLayout() {
  const { t } = useTranslation();

  return (
    <Stack>
      <Stack.Screen
        key="index"
        name="index"
        options={{
          headerShown: true,
          header: () => (
            <Header headerTitle={t('applications.title')} isStepProgressVisible={false} />
          ),
        }}
      />
    </Stack>
  );
}
