export function SiteFooter() {
  return (
    <footer style={{ marginTop: 64, borderTop: '1px solid var(--line)', background: 'rgba(255,248,241,0.7)' }}>
      <div className="site-shell" style={{ padding: '28px 0 40px', display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Sky Smile</div>
          <div style={{ color: 'rgba(29,20,15,0.68)' }}>品牌官网、产品展示、企业新闻与联系方式。</div>
        </div>
        <div style={{ color: 'rgba(29,20,15,0.68)' }}>Built for phase-1 corporate website delivery.</div>
      </div>
    </footer>
  );
}
