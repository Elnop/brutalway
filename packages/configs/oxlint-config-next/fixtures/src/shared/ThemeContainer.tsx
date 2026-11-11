'use client';

import { useState } from 'react';

export function ThemeContainer() {
  const [theme] = useState('light');
  return <p>{theme}</p>;
}
