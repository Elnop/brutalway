import { useTranslation } from 'react-i18next';
export function App() {
  const { t } = useTranslation('app');
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
