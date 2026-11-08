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
      <button type="button" aria-label="Close" />
      <input placeholder={'Search'} type="search" />
      <span title={`About ${name}`} />
      <img alt={'A dog'} src="/dog.png" />
      <span aria-description={'Pet details'} />
      <span aria-description={`About ${name}`} />
      <span aria-description={t('details')} />
      <span aria-description={`${name}`} />
      <span aria-description="42 · %" />
      <span aria-description="PET_ID" />
    </section>
  );
}
