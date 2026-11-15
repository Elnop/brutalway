import { useLocalSearchParams } from 'expo-router';
import type { ErrorBoundaryProps } from 'expo-router';
import { Text } from 'react-native';

export function generateStaticParams(): Record<string, string>[] {
  return [{ id: 'profile' }];
}

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return <Text onPress={retry}>{error.message}</Text>;
}

export async function loader(_request: Request, params: { id: string }): Promise<string> {
  return params.id;
}

export default function SettingsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <Text>{id}</Text>;
}
