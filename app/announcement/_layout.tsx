import { Stack } from 'expo-router';

import { AnnouncementHeader } from '@/components/announcement/announcement-header';
import { ANNOUNCEMENT_ROUTES } from '@/constants/announcement';

export default function AnnouncementLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        header: () => <AnnouncementHeader />,
      }}>
      {Object.values(ANNOUNCEMENT_ROUTES).map((route) => (
        <Stack.Screen
          key={route.name}
          name={route.name}
          options={{
            header: () => (
              <AnnouncementHeader label={route.label} completedStep={route.completedStep} />
            ),
          }}
        />
      ))}
    </Stack>
  );
}
