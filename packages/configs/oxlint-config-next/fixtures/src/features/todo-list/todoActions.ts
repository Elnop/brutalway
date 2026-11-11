'use server';

export async function renameTodo(title: string): Promise<string> {
  return title.trim();
}

export function removeTodo(id: string): string {
  return id;
}
