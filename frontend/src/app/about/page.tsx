import type { Metadata } from 'next';
import { buildMetadata, pickDescription } from '@/lib/seo';
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
    <section className="site-shell animate-fade-in-up" style={{ padding: '56px 0' }}>
      <div className="site-card" style={{ padding: 56 }}>
        <h1 className="section-title">{about.title || '关于我们'}</h1>
        <p className="section-copy" style={{ marginTop: 24, fontSize: 17 }}>{about.content || '关于我们页面内容可在后台页面内容模块继续维护。'}</p>
      </div>
    </section>
  );
}
