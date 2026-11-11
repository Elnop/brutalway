'use client';

import { useState } from 'react';

export function TodoListLayout() {
  const [count] = useState(0);
  return <p>{count}</p>;
}
