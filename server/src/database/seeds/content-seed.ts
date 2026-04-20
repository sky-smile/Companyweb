import 'reflect-metadata';
import AppDataSource from '../data-source';

async function seed(): Promise<void> {
  await AppDataSource.initialize();

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    // ==================== 新闻分类 ====================
    const newsCategories = [
      ['公司新闻', 'company-news', 100, 1],
      ['行业动态', 'industry-news', 90, 1],
      ['技术分享', 'tech-sharing', 80, 1],
      ['媒体报道', 'media-coverage', 70, 1],
    ];

    for (const cat of newsCategories) {
      await queryRunner.manager.query(
        'INSERT INTO news_categories (name, slug, sort, status) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name), sort = VALUES(sort), status = VALUES(status)',
        cat,
      );
    }

    // 获取分类 ID
    const newsCatRows = (await queryRunner.manager.query(
      'SELECT id, slug FROM news_categories ORDER BY sort DESC',
    )) as Array<{ id: string; slug: string }>;
    const newsCatMap: Record<string, string> = {};
    for (const row of newsCatRows) {
      newsCatMap[row.slug] = row.id;
    }

    // ==================== 产品分类 ====================
    const productCategories = [
      ['工业机器人', 'industrial-robots', 100, 1],
      ['自动化设备', 'automation-equipment', 90, 1],
      ['传感器', 'sensors', 80, 1],
      ['控制系统', 'control-systems', 70, 1],
      ['配件耗材', 'accessories', 60, 1],
    ];

    for (const cat of productCategories) {
      await queryRunner.manager.query(
        'INSERT INTO product_categories (name, slug, sort, status) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name), sort = VALUES(sort), status = VALUES(status)',
        cat,
      );
    }

    const productCatRows = (await queryRunner.manager.query(
      'SELECT id, slug FROM product_categories ORDER BY sort DESC',
    )) as Array<{ id: string; slug: string }>;
    const productCatMap: Record<string, string> = {};
    for (const row of productCatRows) {
      productCatMap[row.slug] = row.id;
    }

    // ==================== 新闻文章 ====================
    const now = new Date();
    const newsArticles = [
      {
        categorySlug: 'company-news',
        title: '公司荣获2026年度最佳创新企业奖',
        slug: 'company-won-2026-innovation-award',
        summary: '在刚刚结束的2026年度科技创新峰会上，我司凭借在智能制造领域的突出贡献，荣获"年度最佳创新企业"称号。',
        content: `<h2>创新驱动发展</h2>
<p>在刚刚结束的2026年度科技创新峰会上，我司凭借在智能制造领域的突出贡献，荣获"年度最佳创新企业"称号。这一荣誉是对我们多年来坚持技术创新、产品升级的充分肯定。</p>
<h2>核心技术突破</h2>
<p>过去一年，公司研发团队在工业机器人精度控制、自动化生产线集成等方向取得重大突破。新一代智能焊接机器人系列产品效率提升40%，故障率降低至0.3%以下，达到国际领先水平。</p>
<h2>未来展望</h2>
<p>展望未来，我们将继续加大研发投入，深化与高校、科研院所的合作，为中国智能制造产业的发展贡献更多力量。</p>`,
        status: 1,
        isTop: 1,
        publishedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        categorySlug: 'company-news',
        title: '新版企业宣传片正式发布',
        slug: 'new-corporate-video-released',
        summary: '经过三个月的精心制作，公司2026版企业宣传片正式发布，全方位展示公司研发实力与企业文化。',
        content: `<p>新版宣传片时长8分钟，以"智造未来"为主题，通过实景拍摄与三维动画结合的方式，生动展示了：</p>
<ul>
<li>智能化生产车间全景</li>
<li>核心产品技术亮点</li>
<li>研发团队工作场景</li>
<li>客户应用案例分享</li>
</ul>
<p>宣传片已在公司官网、微信公众号及主流视频平台同步上线，欢迎观看。</p>`,
        status: 1,
        isTop: 0,
        publishedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        categorySlug: 'industry-news',
        title: '2026年工业机器人市场趋势分析报告',
        slug: '2026-industrial-robot-market-trends',
        summary: '根据最新行业报告显示，全球工业机器人市场规模预计将在2026年突破500亿美元，中国市场增速位居前列。',
        content: `<h2>市场规模持续扩大</h2>
<p>据国际机器人联合会（IFR）最新报告，2025年全球工业机器人销量达到75万台，同比增长12%。预计2026年这一数字将突破85万台，市场规模突破500亿美元。</p>
<h2>中国市场表现亮眼</h2>
<p>中国作为全球最大的工业机器人市场，2025年销量占全球总量的45%以上。在新能源汽车、3C电子、半导体等行业的带动下，国产机器人品牌市场份额持续提升。</p>
<h2>技术发展方向</h2>
<p>协作机器人、移动机器人、智能视觉系统将成为未来三年的重点发展方向。人机协作、柔性生产、数字化集成将成为行业关键词。</p>`,
        status: 1,
        isTop: 0,
        publishedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        categorySlug: 'tech-sharing',
        title: '工业机器人视觉引导技术深度解析',
        slug: 'industrial-robot-vision-guidance-tech',
        summary: '本文详细介绍机器视觉在工业机器人领域的应用原理、关键技术指标及典型应用场景。',
        content: `<h2>什么是视觉引导技术</h2>
<p>视觉引导（Vision Guidance）是工业机器人领域的关键技术，通过工业相机获取目标工件的位置、姿态信息，引导机器人完成抓取、装配、检测等任务。</p>
<h2>核心技术指标</h2>
<ul>
<li><strong>定位精度</strong>：可达±0.05mm</li>
<li><strong>识别速度</strong>：单件处理时间<100ms</li>
<li><strong>适用场景</strong>：工件上料、位置纠偏、质量检测</li>
</ul>
<h2>典型应用案例</h2>
<p>在汽车零部件装配线中，视觉引导系统可自动识别零件种类和位置，引导机器人精准抓取和装配，大幅提升生产效率和产品质量一致性。</p>`,
        status: 1,
        isTop: 0,
        publishedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
      },
      {
        categorySlug: 'media-coverage',
        title: '央视《对话》栏目专访公司CEO',
        slug: 'cctv-dialogue-interview-ceo',
        summary: '公司CEO张明远受邀参加央视《对话》栏目，与观众分享中国智能制造的发展历程与未来愿景。',
        content: `<p>在节目中，张总分享了公司从初创到成为行业领军企业的奋斗历程。他表示："中国制造业的转型升级为企业发展提供了巨大机遇，我们将继续深耕智能制造领域，为中国制造贡献力量。"</p>
<p>节目中还展示了公司最新的柔性化生产解决方案，该方案可根据市场需求快速调整生产线配置，实现多品种、小批量的高效生产。</p>`,
        status: 1,
        isTop: 0,
        publishedAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
      },
    ];

    for (const news of newsArticles) {
      await queryRunner.manager.query(
        `INSERT INTO news (category_id, title, slug, summary, content, status, is_top, published_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE title = VALUES(title), summary = VALUES(summary), content = VALUES(content)`,
        [
          newsCatMap[news.categorySlug],
          news.title,
          news.slug,
          news.summary,
          news.content,
          news.status,
          news.isTop,
          news.publishedAt,
        ],
      );
    }

    // ==================== 公告 ====================
    const announcements = [
      {
        title: '2026年春节期间服务安排通知',
        summary: '春节期间公司服务时间调整，请各合作伙伴提前做好安排。',
        content: `<h2>放假时间</h2>
<p>2026年春节放假时间为：1月25日（除夕）至2月7日（正月十五），共14天。2月8日（周一）正常上班。</p>
<h2>服务安排</h2>
<ul>
<li>技术支持热线：春节期间暂停服务</li>
<li>在线工单系统：正常工作，响应时间可能延长</li>
<li>紧急故障处理：请拨打值班手机：138-0000-8888</li>
</ul>
<p>感谢您的理解与支持，祝您新春快乐！</p>`,
        status: 1,
        isTop: 1,
        publishedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        title: '关于产品升级维护的通知',
        summary: '系统将于本周日凌晨进行例行维护，届时服务将短暂中断。',
        content: `<h2>维护时间</h2>
<p>本周日（4月26日）凌晨02:00-06:00，共4小时。</p>
<h2>影响范围</h2>
<ul>
<li>官网浏览功能：可能短暂中断</li>
<li>在线询价系统：维护期间暂停使用</li>
<li>后台管理系统：不受影响</li>
</ul>
<p>如有紧急需求，请联系技术支持。感谢您的耐心等待！</p>`,
        status: 1,
        isTop: 0,
        publishedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        title: '新产品发布会邀请函',
        summary: '诚挚邀请您参加4月28日举办的新产品发布会，了解最新研发成果。',
        content: `<h2>发布会信息</h2>
<p>时间：2026年4月28日 14:00-17:00<br/>地点：公司总部大楼多功能厅</p>
<h2>发布内容</h2>
<ul>
<li>全新一代协作机器人系列</li>
<li>智能柔性生产线解决方案</li>
<li>工业物联网平台3.0版本</li>
</ul>
<h2>报名方式</h2>
<p>请通过官网报名页面提交报名信息，或致电 010-8888-6666 咨询。</p>`,
        status: 1,
        isTop: 0,
        publishedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      },
    ];

    for (const ann of announcements) {
      await queryRunner.manager.query(
        `INSERT INTO announcements (title, summary, content, status, is_top, published_at)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE title = VALUES(title), summary = VALUES(summary), content = VALUES(content)`,
        [
          ann.title,
          ann.summary,
          ann.content,
          ann.status,
          ann.isTop,
          ann.publishedAt,
        ],
      );
    }

    // ==================== 产品 ====================
    const products = [
      {
        categorySlug: 'industrial-robots',
        name: '六轴工业机器人 IR-2000',
        slug: 'six-axis-robot-ir2000',
        summary: '高精度六轴工业机器人，负载20kg，工作半径1850mm，适用于焊接、喷涂、搬运等场景。',
        content: `<h2>产品简介</h2>
<p>IR-2000是我司自主研发的高精度六轴工业机器人，采用先进运动控制算法，重复定位精度达±0.05mm。</p>
<h2>核心优势</h2>
<ul>
<li>高速运动：最大速度提升30%</li>
<li>低能耗：能耗降低15%</li>
<li>易集成：支持主流工业总线</li>
</ul>
<h2>应用领域</h2>
<p>汽车制造、电子装配、食品加工、医药生产等行业的自动化升级改造。</p>`,
        imagesJson: JSON.stringify([
          'https://placehold.co/800x600/2563eb/white?text=IR-2000+Front',
          'https://placehold.co/800x600/0ea5e9/white?text=IR-2000+Side',
        ]),
        parametersJson: JSON.stringify([
          { label: '负载', value: '20kg' },
          { label: '工作半径', value: '1850mm' },
          { label: '重复精度', value: '±0.05mm' },
          { label: '轴数', value: '6轴' },
          { label: '防护等级', value: 'IP65' },
        ]),
        status: 1,
        sort: 100,
        publishedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        categorySlug: 'industrial-robots',
        name: '协作机器人 CR-5',
        slug: 'collaborative-robot-cr5',
        summary: '安全协作机器人，负载5kg，支持人机协同作业，无需安全围栏，开箱即用。',
        content: `<h2>产品简介</h2>
<p>CR-5协作机器人专为中小企业设计，具备16项安全功能，通过ISO 10218认证，可与人员安全共处。</p>
<h2>核心优势</h2>
<ul>
<li>拖拽示教：无需编程基础</li>
<li>安全触停：碰撞检测响应<10ms</li>
<li>快速部署：2小时完成调试</li>
</ul>`,
        imagesJson: JSON.stringify([
          'https://placehold.co/800x600/10b981/white?text=CR-5+Robot',
        ]),
        parametersJson: JSON.stringify([
          { label: '负载', value: '5kg' },
          { label: '工作半径', value: '900mm' },
          { label: '最大速度', value: '2m/s' },
          { label: '重量', value: '20kg' },
        ]),
        status: 1,
        sort: 90,
        publishedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        categorySlug: 'automation-equipment',
        name: '智能柔性输送系统 SFT-300',
        slug: 'smart-flexible-transfer-sft300',
        summary: '模块化柔性输送系统，支持快速重组，适应多品种、小批量生产模式。',
        content: `<h2>产品简介</h2>
<p>SFT-300采用模块化设计理念，各单元可自由组合扩展，配备智能调度系统，实现物料的动态分配。</p>
<h2>核心优势</h2>
<ul>
<li>模块化设计：按需扩展</li>
<li>智能调度：效率提升25%</li>
<li>可视化监控：实时掌握生产状态</li>
</ul>`,
        imagesJson: JSON.stringify([
          'https://placehold.co/800x600/f59e0b/white?text=SFT-300+System',
        ]),
        parametersJson: JSON.stringify([
          { label: '输送速度', value: '0.1-2m/s' },
          { label: '最大载重', value: '50kg/单元' },
          { label: '通讯协议', value: 'Modbus TCP/Profinet' },
        ]),
        status: 1,
        sort: 85,
        publishedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        categorySlug: 'sensors',
        name: '工业级3D视觉传感器 VS-3D02',
        slug: 'industrial-3d-vision-sensor-vs3d02',
        summary: '高精度3D视觉传感器，支持结构光和双目立体视觉，适用于工件识别与定位引导。',
        content: `<h2>产品简介</h2>
<p>VS-3D02采用自研深度学习算法，具备强大的环境适应能力，可在复杂光照条件下稳定工作。</p>
<h2>核心优势</h2>
<ul>
<li>高精度：Z轴精度0.1mm</li>
<li>高速度：处理时间<80ms</li>
<li>多模式：支持多种安装方式</li>
</ul>`,
        imagesJson: JSON.stringify([
          'https://placehold.co/800x600/8b5cf6/white?text=VS-3D02+Sensor',
        ]),
        parametersJson: JSON.stringify([
          { label: '视野范围', value: '300×200mm' },
          { label: '工作距离', value: '300-800mm' },
          { label: '接口类型', value: 'GigE Vision' },
        ]),
        status: 1,
        sort: 80,
        publishedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        categorySlug: 'control-systems',
        name: '智能控制器 SC-1000',
        slug: 'smart-controller-sc1000',
        summary: '高性能运动控制器，支持64轴联动，配备自主研发的运动控制内核。',
        content: `<h2>产品简介</h2>
<p>SC-1000是面向高端装备的智能运动控制器，采用多核异构架构，满足复杂系统的控制需求。</p>
<h2>核心优势</h2>
<ul>
<li>高性能：支持64轴联动</li>
<li>高实时性：周期1ms</li>
<li>易扩展：模块化I/O设计</li>
</ul>`,
        imagesJson: JSON.stringify([
          'https://placehold.co/800x600/ef4444/white?text=SC-1000+Controller',
        ]),
        parametersJson: JSON.stringify([
          { label: '控制轴数', value: '64轴' },
          { label: '控制周期', value: '1ms' },
          { label: '通讯接口', value: 'EtherCAT' },
        ]),
        status: 1,
        sort: 75,
        publishedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
      },
      {
        categorySlug: 'accessories',
        name: '机器人末端工具快换系统 EC-200',
        slug: 'end-effector-changer-ec200',
        summary: '气电快换装置，支持机器人末端工具的快速自动更换，提升生产线柔性。',
        content: `<h2>产品简介</h2>
<p>EC-200采用模块化设计，集成气路、电路、信号线，一次换装时间<3秒。</p>
<h2>核心优势</h2>
<ul>
<li>快速换装：<3秒/次</li>
<li>高可靠性：10万次寿命</li>
<li>多规格：支持多种接口标准</li>
</ul>`,
        imagesJson: JSON.stringify([
          'https://placehold.co/800x600/64748b/white?text=EC-200+Changer',
        ]),
        parametersJson: JSON.stringify([
          { label: '换装时间', value: '<3s' },
          { label: '最大载荷', value: '30kg' },
          { label: '气路数量', value: '8路' },
        ]),
        status: 1,
        sort: 70,
        publishedAt: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000),
      },
    ];

    for (const product of products) {
      await queryRunner.manager.query(
        `INSERT INTO products (category_id, name, slug, summary, content, images_json, parameters_json, status, sort, published_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name = VALUES(name), summary = VALUES(summary), content = VALUES(content)`,
        [
          productCatMap[product.categorySlug],
          product.name,
          product.slug,
          product.summary,
          product.content,
          product.imagesJson,
          product.parametersJson,
          product.status,
          product.sort,
          product.publishedAt,
        ],
      );
    }

    await queryRunner.commitTransaction();
    console.log('Test data seeded successfully!');
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
    await AppDataSource.destroy();
  }
}

void seed();
