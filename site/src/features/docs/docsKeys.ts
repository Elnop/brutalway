export const docsKeys = {
  all: ['docs'],
  list: () => [...docsKeys.all, 'list'],
  roadmap: (repo: string) => [...docsKeys.all, 'roadmap', repo],
  content: (url: string) => [...docsKeys.all, 'content', url],
};
