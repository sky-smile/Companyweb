import Link from 'next/link';
import { MobileMenu } from './MobileMenu';

const navItems = [
  { href: '/', label: '首页' },
  { href: '/about', label: '关于我们' },
  { href: '/products', label: '产品中心' },
  { href: '/news', label: '新闻中心' },
  { href: '/announcements', label: '公告' },
  { href: '/contact', label: '联系我们' },
];

export function SiteHeader() {
  return (
    <header
      className="site-header"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        backdropFilter: 'blur(20px)',
        background: 'rgba(255, 255, 255, 0.98)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)',
      }}
    >
      <div className="site-shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 76 }}>
        <Link
          href="/"
          className="header-logo"
        >
          Sky Smile
        </Link>

        {/* 桌面端导航 */}
        <nav className="desktop-nav" style={{ display: 'flex', gap: 36, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* 移动端菜单按钮 */}
        <MobileMenu />
      </div>

      {/* 响应式和交互样式 */}
      <style dangerouslySetInnerHTML={{ __html: `
        .site-header {
          position: relative;
        }
        
        .site-header::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(37, 99, 235, 0.2) 20%, 
            rgba(37, 99, 235, 0.3) 50%, 
            rgba(37, 99, 235, 0.2) 80%, 
            transparent 100%);
        }
        
        .header-logo {
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, var(--brand) 0%, var(--accent) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          transition: all 0.3s ease;
        }

        .header-logo:hover {
          opacity: 0.85;
          transform: scale(1.02);
        }

        .nav-link {
          color: rgba(26, 32, 44, 0.72);
          font-weight: 500;
          font-size: 15px;
          transition: all 0.25s ease;
          position: relative;
          padding: 4px 0;
        }
        
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--gradient-primary);
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 2px;
        }

        .nav-link:hover {
          color: var(--brand);
        }
        
        .nav-link:hover::after {
          width: 100%;
        }

        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          
          .site-header::after {
            background: var(--line);
          }
        }
      `}} />
    </header>
  );
}
