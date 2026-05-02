'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const MobileMenu = dynamic(() => import('./MobileMenu').then((mod) => ({ default: mod.MobileMenu })), {
  ssr: false,
});

const navItems = [
  { href: '/', label: '首页' },
  { href: '/about', label: '关于我们' },
  { href: '/products', label: '产品中心' },
  { href: '/news', label: '新闻中心' },
  { href: '/announcements', label: '公告' },
  { href: '/contact', label: '联系我们' },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [logo, setLogo] = useState('');
  const [name, setName] = useState('');

  // 获取站点设置（首次加载）
  useEffect(() => {
    async function loadSettings() {
      try {
        const { publicService } = await import('@/services/public-service');
        const home = await publicService.getHome();
        setLogo(home.settings.find((s) => s.settingKey === 'siteLogo')?.settingValue || '');
        setName(home.settings.find((s) => s.settingKey === 'siteName')?.settingValue || '');
      } catch {
        // 忽略错误，使用默认值
      }
    }
    void loadSettings();
  }, []);

  // 监听滚动位置
  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 60);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className="site-header"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 20,
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        background: scrolled ? 'rgba(255, 255, 255, 0.98)' : 'transparent',
        boxShadow: scrolled ? '0 1px 3px rgba(0, 0, 0, 0.08)' : 'none',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : '1px solid transparent',
      }}
    >
      <div className="site-shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 'var(--header-height, 76px)' }}>
        <Link href="/" className="header-logo" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {logo ? (
              <div style={{ position: 'relative', width: 160, height: 40, flexShrink: 0 }}>
                <Image
                  src={logo}
                  alt={name || 'Logo'}
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </div>
            ) : null}
          {name && (
            <span className="header-site-name">{name}</span>
          )}
          {!logo && !name && (
            <span className="header-default-name">Sky Smile</span>
          )}
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
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .header-logo:hover {
          opacity: 0.85;
          transform: scale(1.02);
        }

        .header-site-name {
          font-size: 20px;
          font-weight: 700;
          letter-spacing: -0.01em;
          color: var(--foreground);
          transition: color 0.3s ease;
        }

        .header-default-name {
          font-size: 22px;
          font-weight: 700;
          letter-spacing: -0.01em;
          color: var(--foreground);
          transition: all 0.3s ease;
        }

        .nav-link {
          color: var(--foreground);
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
          background: var(--brand);
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

          .header-site-name,
          .header-default-name {
            font-size: 18px;
          }

          .site-shell {
            min-height: var(--header-height-mobile, 64px) !important;
          }
        }
      `}} />
    </header>
  );
}
