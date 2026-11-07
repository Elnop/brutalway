import styles from '@/app/App.module.css';

export function App() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>__PROJECT_NAME__</h1>
      </header>
      <main className={styles.body}>
        <p>Write your first feature in src/features/ and render it here.</p>
      </main>
    </div>
  );
}
