import { useTranslation } from 'react-i18next';
export function App() {
  const { t } = useTranslation('app');
  return (
    <div className="mx-auto max-w-2xl px-4 pt-10 pb-16">
      <header className="mb-8">
        <h1 className="font-display text-[clamp(2.8rem,12vw,5rem)] leading-none font-bold tracking-[-0.03em] uppercase">{t('title')}</h1>
      </header>
      <main className="grid grid-cols-[minmax(0,1fr)] gap-8">
        <p>{t('start')}</p>
      </main>
    </div>
  );
}
