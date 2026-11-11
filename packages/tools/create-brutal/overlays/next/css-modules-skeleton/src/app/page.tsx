import { createI18n } from '@/app/createI18n.ts';
import styles from '@/app/page.module.css';

export default function Home() {
  const t = createI18n().getFixedT(null, 'app');
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>{t('title')}</h1>
      </header>
      <main className={styles.body}>
        <p>{t('start')}</p>
      </main>
    </div>
  );
}
