import { createI18n } from '@/app/createI18n.ts';

export default function Home() {
  const t = createI18n().getFixedT(null, 'app');
  return (
    <div className="page">
      <header className="page-header">
        <h1>{t('title')}</h1>
      </header>
      <main className="page-body">
        <p>{t('start')}</p>
      </main>
    </div>
  );
}
