import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata, pickDescription } from '@/lib/seo';
import { RichContent } from '@/components/RichContent';
import { publicService } from '@/services/public-service';

export async function generateMetadata(): Promise<Metadata> {
  const about = await publicService.getAbout();

  return buildMetadata({
    title: about.seoTitle || about.title || '关于我们',
    description: pickDescription(about.seoDescription, about.content),
    path: '/about',
  });
}

export default async function AboutPage() {
  const about = await publicService.getAbout();

  return (
    <>
      {/* 页面头部 Hero */}
      <section className="about-hero" style={{
        position: 'relative',
        paddingTop: 'var(--page-top, 108px)',
        paddingBottom: 64,
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #f0f7ff 0%, #ffffff 100%)',
        borderBottom: '1px solid var(--line)',
      }}>
        {/* 装饰背景 */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.06) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-10%',
          left: '-5%',
          width: 350,
          height: 350,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.05) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }} />

        <div className="site-shell" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 800 }}>
            <div style={{
              color: 'var(--brand)',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 16,
            }}>
              About Us
            </div>
            <h1 style={{
              margin: 0,
              fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              color: 'var(--foreground)',
            }}>
              {about.title || '关于我们'}
            </h1>
            <RichContent
              content={about.content}
              fallback="我们致力于以创新技术和卓越品质，为客户创造可持续的价值，成为行业值得信赖的合作伙伴。"
              style={{
                marginTop: 24,
                fontSize: 'clamp(1rem, 1.6vw, 1.15rem)',
                lineHeight: 1.8,
                maxWidth: 640,
              }}
            />
          </div>
        </div>
      </section>

      {/* 使命 · 愿景 · 价值观 */}
      <section className="about-pillars-section" style={{ padding: '80px 0' }}>
        <div className="site-shell">
          <div style={{
            color: 'var(--brand)',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            fontSize: 12,
            fontWeight: 600,
            marginBottom: 12,
          }}>
            Our Core
          </div>
          <h2 style={{
            margin: '0 0 48px',
            fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
            fontWeight: 800,
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
          }}>
            使命 · 愿景 · 价值观
          </h2>

          <div className="about-pillars" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 24,
          }}>
            <div className="about-pillar about-pillar-blue" style={{
              padding: '44px 36px',
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(160deg, #f0f7ff 0%, #ffffff 60%)',
              border: '1px solid rgba(37, 99, 235, 0.08)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}>
              <div style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                background: 'var(--brand-soft)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 24,
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
              </div>
              <h3 style={{ margin: '0 0 14px', fontSize: 22, fontWeight: 700, color: 'var(--foreground)' }}>使命</h3>
              <p className="section-copy" style={{ margin: 0, lineHeight: 1.8, color: 'rgba(15, 23, 42, 0.72)' }}>
                以技术创新和品质坚守，为客户创造超越期望的价值，推动行业可持续发展。我们相信，每一次突破都源于对卓越的不懈追求。
              </p>
            </div>

            <div className="about-pillar about-pillar-green" style={{
              padding: '44px 36px',
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(160deg, #f0fdf4 0%, #ffffff 60%)',
              border: '1px solid rgba(22, 163, 74, 0.08)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}>
              <div style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                background: '#f0fdf4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 24,
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <h3 style={{ margin: '0 0 14px', fontSize: 22, fontWeight: 700, color: 'var(--foreground)' }}>愿景</h3>
              <p className="section-copy" style={{ margin: 0, lineHeight: 1.8, color: 'rgba(15, 23, 42, 0.72)' }}>
                成为全球客户首选的合作伙伴，以专业与诚信构筑值得信赖的品牌形象。立足当下，放眼未来，持续拓展发展边界。
              </p>
            </div>

            <div className="about-pillar about-pillar-red" style={{
              padding: '44px 36px',
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(160deg, #fef3f2 0%, #ffffff 60%)',
              border: '1px solid rgba(220, 38, 38, 0.08)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}>
              <div style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                background: '#fef3f2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 24,
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3 style={{ margin: '0 0 14px', fontSize: 22, fontWeight: 700, color: 'var(--foreground)' }}>价值观</h3>
              <p className="section-copy" style={{ margin: 0, lineHeight: 1.8, color: 'rgba(15, 23, 42, 0.72)' }}>
                品质为先、客户至上、持续创新、合作共赢——每一项决策都以此为准则，确保始终走在正确的道路上。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 发展历程 */}
      <section style={{
        padding: '80px 0',
        background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
        borderTop: '1px solid var(--line)',
        borderBottom: '1px solid var(--line)',
      }}>
        <div className="site-shell">
          <div style={{
            color: 'var(--brand)',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            fontSize: 12,
            fontWeight: 600,
            marginBottom: 12,
          }}>
            Milestones
          </div>
          <h2 style={{
            margin: '0 0 48px',
            fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
            fontWeight: 800,
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
          }}>
            发展历程
          </h2>

          <div className="about-timeline" style={{
            position: 'relative',
            paddingLeft: 40,
          }}>
            {/* 时间线竖线 */}
            <div style={{
              position: 'absolute',
              left: 11,
              top: 8,
              bottom: 8,
              width: 2,
              background: 'linear-gradient(180deg, var(--brand) 0%, var(--accent) 100%)',
              borderRadius: 1,
            }} />

            {[
              { year: '2009', title: '公司成立', desc: '从一间小办公室起步，怀揣对品质与技术的执着信念，踏上了创业之路。' },
              { year: '2013', title: '技术突破', desc: '核心产品获得行业认证，建立自主研发中心，确立技术领先优势。' },
              { year: '2017', title: '规模扩张', desc: '业务拓展至多个地区，团队规模突破百人，服务体系全面升级。' },
              { year: '2021', title: '数字化转型', desc: '启动数字化战略，引入智能制造与数据驱动决策，运营效率大幅提升。' },
              { year: '2024', title: '品牌焕新', desc: '全新品牌形象上线，持续深耕核心领域，向更广阔的市场迈进。' },
            ].map((item, i) => (
              <div key={item.year} className="about-timeline-item" style={{
                position: 'relative',
                paddingBottom: i < 4 ? 40 : 0,
              }}>
                {/* 节点圆点 */}
                <div style={{
                  position: 'absolute',
                  left: -40,
                  top: 4,
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: '#ffffff',
                  border: '3px solid var(--brand)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1,
                }}>
                  <div style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: 'var(--brand)',
                  }} />
                </div>

                <div className="about-timeline-card" style={{
                  padding: '24px 28px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--line)',
                  background: '#ffffff',
                  transition: 'all 0.3s ease',
                }}>
                  <div style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: 'var(--brand)',
                    letterSpacing: '0.05em',
                    marginBottom: 6,
                  }}>
                    {item.year}
                  </div>
                  <h4 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 700, color: 'var(--foreground)' }}>{item.title}</h4>
                  <p className="section-copy" style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: 'rgba(15, 23, 42, 0.65)' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 企业数据 */}
      <section style={{ padding: '80px 0' }}>
        <div className="site-shell" style={{ textAlign: 'center' }}>
          <div style={{
            color: 'var(--brand)',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            fontSize: 12,
            fontWeight: 600,
            marginBottom: 12,
          }}>
            By the Numbers
          </div>
          <h2 style={{
            margin: '0 0 56px',
            fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
            fontWeight: 800,
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
          }}>
            实力见证
          </h2>

          <div className="about-stats" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 32,
          }}>
            {[
              { value: '15+', label: '年行业深耕', sub: '持续稳定发展' },
              { value: '200+', label: '服务客户', sub: '遍布全球各地' },
              { value: '50+', label: '技术团队', sub: '专业研发力量' },
              { value: '99%', label: '客户满意度', sub: '口碑铸就品牌' },
            ].map((stat) => (
              <div key={stat.label} className="about-stat-card" style={{
                padding: '40px 24px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--line)',
                background: '#ffffff',
                transition: 'all 0.3s ease',
              }}>
                <div style={{
                  fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                  fontWeight: 800,
                  color: 'var(--brand)',
                  lineHeight: 1,
                  letterSpacing: '-0.03em',
                }}>
                  {stat.value}
                </div>
                <div style={{
                  marginTop: 12,
                  fontSize: 16,
                  fontWeight: 600,
                  color: 'var(--foreground)',
                }}>
                  {stat.label}
                </div>
                <div style={{
                  marginTop: 6,
                  fontSize: 13,
                  color: 'rgba(15, 23, 42, 0.45)',
                }}>
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta" style={{
        padding: '64px 0',
        background: 'var(--gradient-primary)',
        color: '#ffffff',
      }}>
        <div className="site-shell" style={{ textAlign: 'center' }}>
          <h2 style={{
            margin: '0 0 16px',
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '-0.02em',
          }}>
            期待与您携手共创未来
          </h2>
          <p style={{
            margin: '0 0 32px',
            fontSize: 16,
            color: 'rgba(255, 255, 255, 0.85)',
            lineHeight: 1.7,
            maxWidth: 520,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
            无论您有任何合作意向或咨询需求，我们都乐意为您提供专业的解决方案。
          </p>
          <Link href="/contact" className="about-cta-btn" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '16px 36px',
            borderRadius: 999,
            background: 'rgba(255, 255, 255, 0.18)',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: 16,
            textDecoration: 'none',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.3s ease',
          }}>
            联系我们
            <span>→</span>
          </Link>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .about-pillar:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-lg);
        }

        .about-pillar-blue:hover {
          border-color: rgba(37, 99, 235, 0.2);
        }

        .about-pillar-green:hover {
          border-color: rgba(22, 163, 74, 0.2);
        }

        .about-pillar-red:hover {
          border-color: rgba(220, 38, 38, 0.2);
        }

        .about-timeline-card:hover {
          border-color: var(--brand);
          box-shadow: var(--shadow-md);
          transform: translateX(4px);
        }

        .about-stat-card:hover {
          border-color: var(--brand);
          transform: translateY(-4px);
          box-shadow: var(--shadow-glow);
        }

        .about-cta-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-2px);
        }

        .about-cta-btn:hover span {
          transform: translateX(4px);
        }

        .about-cta-btn span {
          transition: transform 0.3s ease;
        }

        @media (max-width: 768px) {
          .about-hero {
            padding-top: var(--page-top-mobile, 84px);
            padding-bottom: 48px;
          }

          .about-pillars {
            grid-template-columns: 1fr;
          }

          .about-stats {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }

          .about-stat-card {
            padding: 28px 16px;
          }

          .about-timeline {
            padding-left: 32px;
          }

          .about-cta {
            padding: 48px 0;
          }
        }

        @media (max-width: 480px) {
          .about-hero {
            padding-top: var(--page-top-mobile, 84px);
            padding-bottom: 40px;
          }

          .about-stats {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }

          .about-timeline-item {
            padding-bottom: 28px;
          }

          .about-timeline-card {
            padding: 18px 20px;
          }

          .about-cta {
            padding: 40px 0;
          }
        }
      `}} />
    </>
  );
}
