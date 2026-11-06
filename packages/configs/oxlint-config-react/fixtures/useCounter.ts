import { useState } from 'react';

export function useCounter() {
  return useState(0);
}

export function formatCount(count: number) {
  return String(count);
}
