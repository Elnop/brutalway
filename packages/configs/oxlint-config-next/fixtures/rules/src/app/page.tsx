import type { Metadata } from 'next';
import { TodoListLayout } from '@/features/todo-list/TodoListLayout.tsx';

export function generateMetadata(): Metadata {
  return { title: 'Todos' };
}

export default function Home() {
  return <TodoListLayout />;
}
