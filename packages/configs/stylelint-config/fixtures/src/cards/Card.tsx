import styles from '@/cards/Card.module.css';

export function Card() {
  return (
    <p className={styles.card}>
      <span className={styles['titleText']}>Card</span>
    </p>
  );
}
