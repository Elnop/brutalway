import { useTranslation } from 'react-i18next';

type CardProps = {
  name: string;
  count: number;
};

export function Card({ name, count }: CardProps) {
  const { t } = useTranslation('card');
  return (
    <section aria-label={t('label')} className="card">
      <h2>{t('title', { name })}</h2>
      <p>{count} · 42%</p>
      <p>Hello</p>
      <input placeholder="Your name" type="text" />
      <button type="button" aria-label={`Remove ${name}`}>
        ×
      </button>
      <img alt="A cat" src="/cat.png" />
      <abbr title="Pet card">PET_ID</abbr>
      <div aria-description="Pet details" />
      <Card aria-description="Pet details" name={name} count={count} />
    </section>
  );
}
