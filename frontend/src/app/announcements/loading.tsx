import styles from './loading.module.css';

export default function Loading() {
  return (
    <div className={styles['page-loading']}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.badge}></div>
        <div className={styles.title}></div>
        <div className={styles.desc}></div>
      </section>

      {/* Content Section */}
      <section className={styles.content}>
        <div className={styles['section-title']}></div>
        <div className={styles.grid}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={styles.card}>
              <div className={styles['card-image']}></div>
              <div className={styles['card-title']}></div>
              <div className={styles['card-text']}></div>
              <div className={`${styles['card-text']} ${styles.short}`}></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
