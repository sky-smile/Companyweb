interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div style={{ display: 'grid', gap: 10, marginBottom: 24 }}>
      <div style={{ color: 'var(--brand)', textTransform: 'uppercase', letterSpacing: '0.18em', fontSize: 12 }}>{eyebrow}</div>
      <h2 className="section-title">{title}</h2>
      <p className="section-copy" style={{ margin: 0, maxWidth: 700 }}>{description}</p>
    </div>
  );
}
