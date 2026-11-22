import { useRef } from 'react';
import type { TextInput } from 'react-native';

export function useFeedInput() {
  return useRef<TextInput>(null);
}
