import { useState } from 'react';
import '@/panel.css';
import source from '@core/metrics.ts?raw';
import { LIMIT } from './limitConfig.ts';

type PanelProps = { open: boolean };

export function Panel({ open }: PanelProps) {
  if (open) {
    const [value] = useState(source);
    return value + LIMIT + document.body!.id;
  }
  return null;
}
