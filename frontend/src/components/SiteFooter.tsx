export function SiteFooter() {
  return (
    <footer style={{ 
      marginTop: 80, 
      borderTop: '1px solid var(--line)', 
      background: '#f8fafc',
    }}>
      <div className="site-shell" style={{ padding: '32px 0 48px', display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ 
            fontSize: 20, 
            fontWeight: 800, 
            marginBottom: 8,
            letterSpacing: '-0.02em',
            color: 'var(--brand)',
          }}>
            Sky Smile
          </div>
          <div style={{ color: 'rgba(26, 32, 44, 0.6)' }}>品牌官网、产品展示、企业新闻与联系方式。</div>
        </div>
        <div style={{ color: 'rgba(26, 32, 44, 0.5)', fontSize: 14 }}>Built for phase-1 corporate website delivery.</div>
      </div>
    </footer>
  );
}
