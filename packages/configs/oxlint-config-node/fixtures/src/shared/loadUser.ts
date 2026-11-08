import { USERS_URL } from './UsersConfig.ts';

export async function loadUser(id: string): Promise<unknown> {
  const response = await fetch(`${USERS_URL}/${id}`);
  return response.json();
}
