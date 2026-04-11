import { RichContent } from './RichContent';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div style={{ display: 'grid', gap: 12, marginBottom: 28 }}>
      <div style={{ 
        color: 'var(--brand)', 
        textTransform: 'uppercase', 
        letterSpacing: '0.2em', 
        fontSize: 12,
        fontWeight: 600,
      }}>
        {eyebrow}
      </div>
      <h2 className="section-title">{title}</h2>
      <RichContent
        content={description}
        className="section-copy"
        style={{ margin: 0, maxWidth: 700 }}
      />
    </div>
  );
}
