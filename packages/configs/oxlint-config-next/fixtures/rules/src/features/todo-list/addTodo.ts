'use server';

export async function addTodo(title: string): Promise<string> {
  return title.trim();
}
