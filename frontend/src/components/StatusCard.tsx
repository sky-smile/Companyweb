import Link from 'next/link';

interface StatusCardProps {
  title: string;
  description: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}

export function StatusCard({
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: StatusCardProps) {
  return (
    <section className="site-shell" style={{ padding: '48px 0 64px' }}>
      <div className="site-card status-card">
        <div className="status-kicker">Public Website</div>
        <h1 className="section-title">{title}</h1>
        <p className="section-copy" style={{ margin: 0, maxWidth: 620 }}>
          {description}
        </p>
        <div className="status-actions">
          {primaryHref && primaryLabel ? (
            <Link href={primaryHref} className="status-button status-button-primary">
              {primaryLabel}
            </Link>
          ) : null}
          {secondaryHref && secondaryLabel ? (
            <Link href={secondaryHref} className="status-button status-button-secondary">
              {secondaryLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
