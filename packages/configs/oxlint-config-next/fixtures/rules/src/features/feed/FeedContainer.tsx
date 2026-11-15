'use client';

import { useState } from 'react';
import { feedClient } from '@/features/feed/feedClient.ts';

export function FeedContainer() {
  const [items] = useState(feedClient);
  return <p>{items.length}</p>;
}
