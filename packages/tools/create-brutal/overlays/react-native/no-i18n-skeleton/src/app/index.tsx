import { Stack } from 'expo-router';
import { PageShell } from '@/features/page-shell/PageShell.tsx';

export default function HomePage() {
  return (
    <PageShell
      title="__PROJECT_NAME__"
      tagline="Write your first feature in src/features/ and render it here."
    >
      <Stack.Screen options={{ title: '__PROJECT_NAME__' }} />
    </PageShell>
  );
}
