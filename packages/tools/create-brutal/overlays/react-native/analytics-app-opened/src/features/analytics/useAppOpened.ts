import { useEffect } from 'react';
import { analyticsTracker } from '@/shared/analytics/analyticsTracker.ts';

export function useAppOpened(): void {
  useEffect(() => {
    analyticsTracker.track('app_opened');
  }, []);
}
