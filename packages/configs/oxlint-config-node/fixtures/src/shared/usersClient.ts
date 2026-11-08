import { USERS_URL } from '#src/shared/UsersConfig.ts';

export const usersClient = {
  async load(id: string): Promise<unknown> {
    const response = await fetch(`${USERS_URL}/${id}`);
    return response.json();
  },
};
