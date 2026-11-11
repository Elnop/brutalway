async function save(title: string): Promise<string> {
  'use server';
  return title.trim();
}

export function TodoForm() {
  return <form action={save} />;
}
