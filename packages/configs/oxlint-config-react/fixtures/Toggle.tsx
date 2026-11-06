import { useState } from 'react';

type ToggleProps = { enabled: boolean };

export function Toggle({ enabled }: ToggleProps) {
  if (enabled) {
    const [value] = useState(1);
    return value;
  }
  return null;
}
