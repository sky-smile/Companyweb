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
    <header style={{ position: 'sticky', top: 0, zIndex: 20, backdropFilter: 'blur(14px)', borderBottom: '1px solid var(--line)', background: 'rgba(255,248,241,0.78)' }}>
      <div className="site-shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 78 }}>
        <Link href="/" style={{ fontSize: 22, fontWeight: 700, letterSpacing: 0.4 }}>Sky Smile</Link>
        
        {/* 桌面端导航 - 使用 className 控制响应式 */}
        <nav className="desktop-nav" style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} style={{ color: 'rgba(29,20,15,0.78)' }}>{item.label}</Link>
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
