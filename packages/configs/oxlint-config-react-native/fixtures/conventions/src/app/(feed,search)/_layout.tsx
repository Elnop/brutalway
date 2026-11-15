import { Stack } from 'expo-router';

export const unstable_settings = { anchor: 'index', search: { anchor: 'search' } };

export default function SharedLayout({ segment }: { segment: string }) {
  return <Stack key={segment} />;
}
