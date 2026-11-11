import { createI18n } from '@/app/createI18n.ts';

export default function Home() {
  const t = createI18n().getFixedT(null, 'app');
  return (
    <div className="mx-auto max-w-2xl px-4 pt-10 pb-16">
      <header className="mb-8">
        <h1 className="font-display text-[clamp(2.8rem,12vw,5rem)] leading-none font-bold tracking-[-0.03em] uppercase">
          {t('title')}
        </h1>
      </header>
      <main className="grid grid-cols-[minmax(0,1fr)] gap-8">
        <p>{t('start')}</p>
      </main>
    </div>
  );
}
