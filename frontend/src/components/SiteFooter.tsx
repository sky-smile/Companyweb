export function SiteFooter() {
  return (
    <footer
      className="site-footer"
      style={{
        marginTop: 'var(--footer-spacing, 64px)',
        background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
        borderTop: '1px solid var(--line)',
      }}
    >
      <div className="site-shell" style={{ padding: '40px 0 56px', display: 'flex', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
        <div>
          <div
            className="footer-logo"
            style={{
              fontSize: 22,
              fontWeight: 800,
              marginBottom: 10,
              letterSpacing: '-0.02em',
            }}
          >
            Sky Smile
          </div>
          <div style={{ color: 'rgba(26, 32, 44, 0.58)', fontSize: 15, lineHeight: 1.6 }}>
            品牌官网、产品展示、企业新闻与联系方式。
          </div>
        </div>
        <div style={{ color: 'rgba(26, 32, 44, 0.45)', fontSize: 14, alignSelf: 'flex-end' }}>
          Built for phase-1 corporate website delivery.
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .site-footer {
          position: relative;
        }
        
        .site-footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(37, 99, 235, 0.15) 20%, 
            rgba(37, 99, 235, 0.25) 50%, 
            rgba(37, 99, 235, 0.15) 80%, 
            transparent 100%);
        }
        
        .footer-logo {
          background: linear-gradient(135deg, var(--brand) 0%, var(--accent) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          transition: opacity 0.3s ease;
        }
        
        .footer-logo:hover {
          opacity: 0.8;
        }
        
        @media (max-width: 768px) {
          .site-footer {
            margin-top: var(--footer-spacing-mobile, 48px);
          }
          
          .site-shell {
            padding: 32px 0 40px !important;
          }
          
          .site-footer::before {
            background: var(--line);
          }
        }
      `}} />
    </footer>
  );
}
