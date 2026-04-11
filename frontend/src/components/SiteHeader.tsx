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
          style={{ 
            fontSize: 24, 
            fontWeight: 800, 
            letterSpacing: '-0.02em',
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Sky Smile
        </Link>

        {/* 桌面端导航 */}
        <nav className="desktop-nav" style={{ display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              style={{ 
                color: 'rgba(232, 234, 240, 0.75)',
                fontWeight: 500,
                fontSize: 15,
                transition: 'color 0.2s ease',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(232, 234, 240, 0.75)';
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* 移动端菜单按钮 */}
        <MobileMenu />
      </div>

      {/* 响应式样式 */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
        }
      `}} />
    </header>
  );
}
