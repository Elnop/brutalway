import { Stack } from 'expo-router';
import { PageLayout } from '@/features/page-layout/PageLayout.tsx';

export default function HomePage() {
  return (
    <PageLayout
      title="__PROJECT_NAME__"
      tagline="Write your first feature in src/features/ and render it here."
    >
      <Stack.Screen options={{ title: '__PROJECT_NAME__' }} />
    </PageLayout>
  );
}
