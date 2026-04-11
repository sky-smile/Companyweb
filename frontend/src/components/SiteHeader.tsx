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
    <header style={{ 
      position: 'sticky', 
      top: 0, 
      zIndex: 20, 
      backdropFilter: 'blur(20px)', 
      borderBottom: '1px solid var(--line)', 
      background: 'rgba(10, 14, 26, 0.85)',
    }}>
      <div className="site-shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 72 }}>
        <Link 
          href="/" 
          className="header-logo"
        >
          Sky Smile
        </Link>

        {/* 桌面端导航 */}
        <nav className="desktop-nav" style={{ display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
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
        .header-logo {
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.02em;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .nav-link {
          color: rgba(232, 234, 240, 0.75);
          font-weight: 500;
          font-size: 15px;
          transition: color 0.2s ease;
        }
        
        .nav-link:hover {
          color: #ffffff;
        }
        
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
        }
      `}} />
    </header>
  );
}
