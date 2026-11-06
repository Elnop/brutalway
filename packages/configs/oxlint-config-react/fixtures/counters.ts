import { useState } from 'react';

export function useTotal() {
  return useState(0);
}

export function total(values: number[]) {
  return values.length;
}
