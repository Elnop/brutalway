import { useEffect } from 'react';
import { analyticsClient } from '@/shared/analytics/analyticsClient.ts';

export function useAppOpened(): void {
  useEffect(() => {
    analyticsClient.track('app_opened');
  }, []);
}
