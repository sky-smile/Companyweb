import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata, pickDescription } from '@/lib/seo';
import { RichContent } from '@/components/RichContent';
import { publicService } from '@/services/public-service';
import styles from './about.module.css';

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
      <section className={styles.aboutHero}>
        {/* 装饰背景 */}
        <div className={styles.heroBackgroundDecoration} />
        <div className={styles.heroSecondaryDecoration} />

        <div className={`site-shell ${styles.heroContent}`}>
          <div className={styles.heroText}>
            <div className={styles.heroEyebrow}>About Us</div>
            <h1 className={styles.heroTitle}>{about.title || '关于我们'}</h1>
            <RichContent
              content={about.content}
              fallback="我们致力于以创新技术和卓越品质，为客户创造可持续的价值，成为行业值得信赖的合作伙伴。"
              className={styles.heroDescription}
            />
          </div>
        </div>
      </section>

      {/* 使命 · 愿景 · 价值观 */}
      <section className={styles.aboutPillarsSection}>
        <div className="site-shell">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionEyebrow}>Our Core</div>
            <h2 className={styles.sectionTitle}>使命 · 愿景 · 价值观</h2>
          </div>

          <div className={styles.aboutPillars}>
            {/* 使命 */}
            <div className={`${styles.aboutPillar} ${styles.aboutPillarBlue}`}>
              <div className={styles.pillarIconWrapper}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
              </div>
              <h3 className={styles.pillarTitle}>使命</h3>
              <p className={styles.pillarDescription}>
                以技术创新和品质坚守，为客户创造超越期望的价值，推动行业可持续发展。我们相信，每一次突破都源于对卓越的不懈追求。
              </p>
            </div>

            {/* 愿景 */}
            <div className={`${styles.aboutPillar} ${styles.aboutPillarGreen}`}>
              <div className={`${styles.pillarIconWrapper} ${styles.pillarIconGreen}`}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <h3 className={styles.pillarTitle}>愿景</h3>
              <p className={styles.pillarDescription}>
                成为全球客户首选的合作伙伴，以专业与诚信构筑值得信赖的品牌形象。立足当下，放眼未来，持续拓展发展边界。
              </p>
            </div>

            {/* 价值观 */}
            <div className={`${styles.aboutPillar} ${styles.aboutPillarRed}`}>
              <div className={`${styles.pillarIconWrapper} ${styles.pillarIconRed}`}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3 className={styles.pillarTitle}>价值观</h3>
              <p className={styles.pillarDescription}>
                品质为先、客户至上、持续创新、合作共赢——每一项决策都以此为准则，确保始终走在正确的道路上。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 发展历程 */}
      <section className={styles.aboutTimelineSection}>
        <div className="site-shell">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionEyebrow}>Milestones</div>
            <h2 className={styles.sectionTitle}>发展历程</h2>
          </div>

          <div className={styles.aboutTimeline}>
            {/* 时间线竖线 */}
            <div className={styles.timelineLine} />

            {[
              { year: '2009', title: '公司成立', desc: '从一间小办公室起步，怀揣对品质与技术的执着信念，踏上了创业之路。' },
              { year: '2013', title: '技术突破', desc: '核心产品获得行业认证，建立自主研发中心，确立技术领先优势。' },
              { year: '2017', title: '规模扩张', desc: '业务拓展至多个地区，团队规模突破百人，服务体系全面升级。' },
              { year: '2021', title: '数字化转型', desc: '启动数字化战略，引入智能制造与数据驱动决策，运营效率大幅提升。' },
              { year: '2024', title: '品牌焕新', desc: '全新品牌形象上线，持续深耕核心领域，向更广阔的市场迈进。' },
            ].map((item, i) => (
              <div key={item.year} className={styles.aboutTimelineItem}>
                {/* 节点圆点 */}
                <div className={styles.timelineDot}>
                  <div className={styles.timelineDotInner} />
                </div>

                <div className={styles.aboutTimelineCard}>
                  <div className={styles.timelineYear}>{item.year}</div>
                  <h4 className={styles.timelineTitle}>{item.title}</h4>
                  <p className={styles.timelineDescription}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 企业数据 */}
      <section className={styles.aboutStatsSection}>
        <div className="site-shell">
          <div className={`${styles.sectionHeader} ${styles.sectionHeaderCenter}`}>
            <div className={styles.sectionEyebrow}>By the Numbers</div>
            <h2 className={styles.sectionTitle}>实力见证</h2>
          </div>

          <div className={styles.aboutStats}>
            {[
              { value: '5+', label: '年行业深耕', sub: '持续稳定发展' },
              { value: '200+', label: '服务客户', sub: '遍布全球各地' },
              { value: '100+', label: '技术团队', sub: '专业研发力量' },
              { value: '99%', label: '客户满意度', sub: '口碑铸就品牌' },
            ].map((stat) => (
              <div key={stat.label} className={styles.aboutStatCard}>
                <div className={styles.statValue}>{stat.value}</div>
                <div className={styles.statLabel}>{stat.label}</div>
                <div className={styles.statSub}>{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.aboutCta}>
        <div className="site-shell">
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>期待与您携手共创未来</h2>
            <p className={styles.ctaDescription}>
              无论您有任何合作意向或咨询需求，我们都乐意为您提供专业的解决方案。
            </p>
            <Link href="/contact" className={styles.aboutCtaBtn}>
              联系我们
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

    </>
  );
}
