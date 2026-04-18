import { Stack } from 'expo-router';

export default function LoginRequiredLayout() {
  return <Stack screenOptions={{ headerShown: false, gestureEnabled: true }} />;
}
