import { Redirect, useRouter } from 'expo-router';
import React from 'react';

export default function Index() {
  const router = useRouter();

  // Fallback: on Android the initial `<Redirect>` sometimes races with the
  // navigation container mount. A `router.replace` on mount guarantees the
  // home tab becomes the initial visible screen for every user (signed in
  // or guest). Home handles guest-specific UI internally.
  React.useEffect(() => {
    router.replace('/(tabs)');
  }, [router]);

  return <Redirect href="/(tabs)" />;
}
