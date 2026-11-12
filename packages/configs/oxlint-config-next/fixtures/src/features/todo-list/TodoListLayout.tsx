'use client';

import { useState } from 'react';
import { analyticsClient } from '@/shared/analyticsClient.ts';

export function TodoListLayout() {
  const [count] = useState(0);
  analyticsClient.track('todo_list_shown');
  return <p>{count}</p>;
}
