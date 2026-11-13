import { useEffect } from 'react';
import { analyticsClient } from '@/shared/analyticsClient.ts';

export function useAppOpened(): void {
  useEffect(() => {
    analyticsClient.track('app_opened');
  }, []);
}
