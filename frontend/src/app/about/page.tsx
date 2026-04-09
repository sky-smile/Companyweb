import { publicService } from '@/services/public-service';

export default async function AboutPage() {
  const about = await publicService.getAbout();

  return (
    <section className="site-shell" style={{ padding: '42px 0' }}>
      <div className="site-card" style={{ padding: 36 }}>
        <h1 className="section-title">{about.title || '关于我们'}</h1>
        <p className="section-copy" style={{ marginTop: 18 }}>{about.content || '关于我们页面内容可在后台页面内容模块继续维护。'}</p>
      </div>
    </section>
  );
}
