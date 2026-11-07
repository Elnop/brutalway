export const notesKeys = {
  all: ['notes'],
  list: (tag: string) => [...notesKeys.all, 'list', tag],
};
