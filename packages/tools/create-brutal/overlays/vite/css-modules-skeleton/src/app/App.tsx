import { useTranslation } from 'react-i18next';
import styles from '@/app/App.module.css';

export function App() {
  const { t } = useTranslation('app');
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
