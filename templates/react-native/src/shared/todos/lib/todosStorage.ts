import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage } from 'zustand/middleware';
import type { TodosState } from '@/shared/todos/TodosTypes.ts';

export function todosStorage() {
  return createJSONStorage<Pick<TodosState, 'todos'>>(() => AsyncStorage);
}
