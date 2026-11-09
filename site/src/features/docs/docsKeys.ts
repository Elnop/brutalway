export const docsKeys = {
  all: ['docs'],
  list: () => [...docsKeys.all, 'list'],
  content: (url: string) => [...docsKeys.all, 'content', url],
};
