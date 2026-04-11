'use client';

import { useState } from 'react';
import Link from 'next/link';

const navItems = [
  { href: '/', label: '首页' },
  { href: '/about', label: '关于我们' },
  { href: '/products', label: '产品中心' },
  { href: '/news', label: '新闻中心' },
  { href: '/announcements', label: '公告' },
  { href: '/contact', label: '联系我们' },
];

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* 汉堡按钮 */}
      <button
        onClick={toggleMenu}
        style={{
          display: 'none',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 5,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: 8,
          zIndex: 30,
        }}
        className="mobile-menu-button"
        aria-label="切换菜单"
        aria-expanded={isOpen}
      >
        <span
          style={{
            display: 'block',
            width: 24,
            height: 2,
            background: 'var(--foreground)',
            borderRadius: 2,
            transition: 'all 0.3s ease',
            transform: isOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none',
          }}
        />
        <span
          style={{
            display: 'block',
            width: 24,
            height: 2,
            background: 'var(--foreground)',
            borderRadius: 2,
            transition: 'all 0.3s ease',
            opacity: isOpen ? 0 : 1,
          }}
        />
        <span
          style={{
            display: 'block',
            width: 24,
            height: 2,
            background: 'var(--foreground)',
            borderRadius: 2,
            transition: 'all 0.3s ease',
            transform: isOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none',
          }}
        />
      </button>

      {/* 移动端菜单面板 */}
      {isOpen && (
        <nav
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(255, 248, 241, 0.98)',
            backdropFilter: 'blur(14px)',
            zIndex: 25,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 32,
            padding: 80,
          }}
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMenu}
              style={{
                fontSize: 24,
                fontWeight: 600,
                color: 'var(--foreground)',
                textDecoration: 'none',
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          .mobile-menu-button {
            display: flex !important;
          }
        }
      `}} />
    </>
  );
}
