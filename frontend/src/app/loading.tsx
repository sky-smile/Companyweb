import styles from './loading.module.css';

export default function Loading() {
  return (
    <div className={styles['loading-skeleton']}>
      {/* Hero Section */}
      <section className={styles['skeleton-hero']}>
        <div className={styles['skeleton-badge']}></div>
        <div className={styles['skeleton-title']}></div>
        <div className={styles['skeleton-description']}></div>
        <div className={styles['skeleton-cta']}>
          <div className={styles['skeleton-button']}></div>
          <div className={styles['skeleton-button']}></div>
        </div>
      </section>

      {/* Content Section */}
      <section className={styles['skeleton-content']}>
        <div className={styles['skeleton-section-title']}></div>
        <div className={styles['skeleton-grid']}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={styles['skeleton-card']}>
              <div className={styles['skeleton-card-icon']}></div>
              <div className={styles['skeleton-card-title']}></div>
              <div className={styles['skeleton-card-text']}></div>
              <div className={`${styles['skeleton-card-text']} ${styles.short}`}></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
