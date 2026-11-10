export const STATUS_OPTIONS = {
  triage: 'Triage',
  'in progress': 'In progress',
  todo: 'Todo',
} as const;

export const STATUS_LABELS = Object.keys(STATUS_OPTIONS).filter(
  (label): label is keyof typeof STATUS_OPTIONS => label in STATUS_OPTIONS,
);

export const DONE_OPTION = 'Done';

export const STATUS_PROJECT = { owner: 'Elnop', number: 3, field: 'Status' } as const;
