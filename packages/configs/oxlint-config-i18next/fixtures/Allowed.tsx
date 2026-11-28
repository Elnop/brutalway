import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type AllowedProps = { id: string; count: number; error: unknown };

export function Allowed({ id, count, error }: AllowedProps) {
  const { t } = useTranslation('allowed');
  const [open] = useState(false);
  const key = 'todos';
  const status: 'idle' | 'loading' = 'idle';
  const url = 'https://example.com/api/todos';
  const route = `/todos/${id}`;
  const pattern = /^[a-z]+$/u;
  const event = new CustomEvent('todo:added');
  localStorage.setItem('language', 'en');
  console.log(key, status, url, route, pattern, event, error, open);
  return (
    <>
      <div className="card flex gap-2" data-testid="card" id="main" />
      <a href="/todos" target="_blank" rel="noreferrer">
        {t('go')}
      </a>
      <a href={`/todos/${id}`}>{t('go')}</a>
      <img src="/cat.png" alt={t('cat')} />
      <input type="email" name="email" autoComplete="email" inputMode="email" pattern="[0-9]*" />
      <label htmlFor="email">{t('email')}</label>
      <button type="button" role="tab" aria-selected="true" aria-controls="panel">
        {t('tab')}
      </button>
      <div aria-hidden="true" aria-live="polite" aria-current="page" aria-expanded="false" />
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M0 0L10 10" stroke="currentColor" />
      </svg>
      <form method="post" action="/save" />
      <meta name="viewport" content="width=device-width" />
      <link rel="stylesheet" href="/a.css" />
      <p>{count} · 42%</p>
      <p>×</p>
      <p>OK</p>
      <Route path="/todos" element={null} />
      <div style={{ color: 'red' }} key="row" />
      <input placeholder={t('search')} />
    </>
  );
}

declare function Route(props: { path: string; element: null }): null;
