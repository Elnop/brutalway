'use client';

type TodoItemProps = { title: string };

export function TodoItem({ title }: TodoItemProps) {
  return <li>{title}</li>;
}
