import {
  SpaceGrotesk_400Regular,
  SpaceGrotesk_700Bold,
  useFonts,
} from '@expo-google-fonts/space-grotesk';
import { Stack } from 'expo-router';
import { I18nProvider } from '@/app/I18nProvider.tsx';
import { STACK_SCREEN_OPTIONS } from '@/features/page-shell/StackConfig.ts';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ SpaceGrotesk_400Regular, SpaceGrotesk_700Bold });
  if (!fontsLoaded) return null;
  return (
    <I18nProvider>
      <Stack screenOptions={STACK_SCREEN_OPTIONS} />
    </I18nProvider>
  );
}
