'use client';

export function ScrollIndicator() {
  return (
    <button
      type="button"
      className="scroll-indicator"
      onClick={() => {
        const next = document.querySelector('.hero-banner')?.nextElementSibling;
        if (next) next.scrollIntoView({ behavior: 'smooth' });
      }}
      aria-label="向下滚动"
      style={{
        position: 'absolute',
        bottom: 32,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        cursor: 'pointer',
        background: 'none',
        border: 'none',
        padding: '12px',
        outline: 'none',
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
      }}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--brand)', transition: 'transform 0.2s ease' }}>
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
  );
}
