import 'reflect-metadata';
import AppDataSource from '../data-source';

async function seed(): Promise<void> {
  await AppDataSource.initialize();

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    // 获取管理员 ID 作为 created_by
    const adminRows = (await queryRunner.manager.query(
      'SELECT id FROM admin_users WHERE username = ? LIMIT 1',
      ['admin'],
    )) as Array<{ id: string }>;
    const adminId = adminRows[0]?.id ?? null;

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

    const now = new Date();

    // ==================== 新闻（20篇）====================
    const newsArticles = [
      // ---- 公司新闻 (6篇) ----
      {
        categorySlug: 'company-news', title: '公司荣获2026年度最佳创新企业奖',
        slug: 'company-won-2026-innovation-award',
        summary: '在刚刚结束的2026年度科技创新峰会上，我司凭借在智能制造领域的突出贡献荣获"年度最佳创新企业"称号。',
        content: '<h2>荣誉时刻</h2><p>在2026年度科技创新峰会上，我司凭借在智能制造领域的突出贡献荣获"年度最佳创新企业"称号。</p><h2>技术突破</h2><p>过去一年，研发团队在工业机器人精度控制、自动化生产线集成等方向取得重大突破，新一代智能焊接机器人效率提升40%。</p>',
        status: 1, isTop: 1, daysAgo: 2,
      },
      {
        categorySlug: 'company-news', title: '新版企业宣传片正式发布',
        slug: 'new-corporate-video-released',
        summary: '经过三个月的精心制作，公司2026版企业宣传片正式发布，全方位展示公司研发实力与企业文化。',
        content: '<p>新版宣传片时长8分钟，以"智造未来"为主题，通过实景拍摄与三维动画结合的方式展示智能化生产车间、核心产品技术亮点、研发团队工作场景及客户应用案例。</p>',
        status: 1, isTop: 0, daysAgo: 5,
      },
      {
        categorySlug: 'company-news', title: '公司通过ISO 14001环境管理体系认证',
        slug: 'iso14001-certification-achieved',
        summary: '我司正式通过ISO 14001环境管理体系认证，标志着公司在绿色制造和可持续发展方面迈上新台阶。',
        content: '<p>经过为期六个月的管理优化和现场整改，公司于近日顺利通过ISO 14001环境管理体系认证审核。</p><p>此次认证覆盖公司所有产品线及生产车间，审核组对公司在节能减排、废弃物管理、环境保护等方面的努力给予高度评价。</p>',
        status: 1, isTop: 0, daysAgo: 8,
      },
      {
        categorySlug: 'company-news', title: '公司年度员工表彰大会圆满举行',
        slug: 'annual-employee-awards-2026',
        summary: '2026年度员工表彰大会在公司总部隆重举行，共有15个团队和个人荣获嘉奖。',
        content: '<p>大会颁发了"最佳创新团队""优秀项目经理""技术标兵""服务之星"等多个奖项。董事长在致辞中感谢全体员工的辛勤付出，并表示公司将进一步完善人才激励机制。</p>',
        status: 1, isTop: 0, daysAgo: 14,
      },
      {
        categorySlug: 'company-news', title: '公司启动"智能制造人才计划"',
        slug: 'smart-manufacturing-talent-program',
        summary: '面向全国顶尖高校招聘100名应届毕业生，打造智能制造领域核心技术团队。',
        content: '<p>"智能制造人才计划"涵盖机器人算法、视觉系统、嵌入式开发、电气设计等多个方向。公司将提供系统化培训、导师带教和具有竞争力的薪酬福利。</p>',
        status: 1, isTop: 1, daysAgo: 18,
      },
      {
        categorySlug: 'company-news', title: '公司获评"国家级专精特新小巨人企业"',
        slug: 'national-specialized-innovative-enterprise',
        summary: '工业和信息化部正式公布第三批专精特新小巨人企业名单，我司成功入选。',
        content: '<p>专精特新"小巨人"企业认定是工信部推动中小企业高质量发展的重要举措。此次入选不仅是对公司技术实力的认可，也将为公司带来政策支持和发展机遇。</p>',
        status: 1, isTop: 0, daysAgo: 22,
      },

      // ---- 行业动态 (5篇) ----
      {
        categorySlug: 'industry-news', title: '2026年工业机器人市场趋势分析',
        slug: '2026-industrial-robot-market-trends',
        summary: '全球工业机器人市场规模预计2026年突破500亿美元，中国市场增速位居前列。',
        content: '<h2>市场规模持续扩大</h2><p>据IFR最新报告，2025年全球工业机器人销量达75万台，同比增长12%。预计2026年突破85万台。</p><h2>中国市场表现</h2><p>中国作为全球最大市场，2025年销量占全球总量的45%以上，国产机器人品牌市场份额持续提升。</p>',
        status: 1, isTop: 0, daysAgo: 7,
      },
      {
        categorySlug: 'industry-news', title: '新能源汽车行业带动工业机器人需求激增',
        slug: 'new-energy-vehicle-robot-demand-surge',
        summary: '新能源汽车产线自动化升级推动工业机器人订单增长，锂电、电驱装配成为热门应用场景。',
        content: '<p>2026年第一季度，新能源汽车行业工业机器人采购量同比增长35%。动力电池模组装配、电驱动系统焊接、整车涂装等环节成为机器人应用的三大增长点。</p>',
        status: 1, isTop: 0, daysAgo: 11,
      },
      {
        categorySlug: 'industry-news', title: '协作机器人市场增速超过传统工业机器人',
        slug: 'collaborative-robot-growth-surpasses-traditional',
        summary: '2026年协作机器人出货量预计增长45%，中小企业自动化需求成为主要驱动力。',
        content: '<p>协作机器人因部署灵活、编程简单、安全性能高而受到中小企业青睐。食品加工、3C电子、医药包装等行业成为协作机器人重要的增量市场。</p>',
        status: 1, isTop: 0, daysAgo: 16,
      },
      {
        categorySlug: 'industry-news', title: 'AI大模型技术加速工业智能化转型',
        slug: 'ai-large-model-industrial-transformation',
        summary: '以视觉大模型、语言大模型为代表的AI技术正深度融入工业场景，重塑智能制造技术路线。',
        content: '<p>2026年，视觉大模型在缺陷检测、工件识别等场景的应用准确率已超过传统算法15-20%。语言大模型则应用于生产计划优化、故障诊断辅助等领域。</p>',
        status: 1, isTop: 0, daysAgo: 20,
      },
      {
        categorySlug: 'industry-news', title: '工业机器人出口额创历史新高',
        slug: 'industrial-robot-export-record-high',
        summary: '2026年上半年中国工业机器人出口额同比增长28%，东南亚和拉美市场增长尤为显著。',
        content: '<p>海关总署数据显示，2026年1-6月工业机器人出口额达到18.7亿美元。其中协作机器人、焊接机器人、搬运机器人三大品类出口增速最快。</p>',
        status: 1, isTop: 0, daysAgo: 25,
      },

      // ---- 技术分享 (5篇) ----
      {
        categorySlug: 'tech-sharing', title: '工业机器人视觉引导技术深度解析',
        slug: 'industrial-robot-vision-guidance-tech',
        summary: '详细介绍机器视觉在工业机器人领域的应用原理、关键技术指标及典型应用场景。',
        content: '<h2>视觉引导原理</h2><p>视觉引导通过工业相机获取目标工件的位置、姿态信息，引导机器人完成抓取、装配、检测等任务。</p><h2>核心指标</h2><ul><li>定位精度：±0.05mm</li><li>识别速度：<100ms</li><li>适用场景：工件上料、位置纠偏、质量检测</li></ul>',
        status: 1, isTop: 0, daysAgo: 10,
      },
      {
        categorySlug: 'tech-sharing', title: '基于深度学习的焊接质量在线检测方案',
        slug: 'deep-learning-welding-quality-inspection',
        summary: '利用卷积神经网络实现焊接缺陷实时检测，准确率达99.2%，检测速度提升5倍。',
        content: '<p>传统焊接质量检测依赖人工目检或离线抽样，效率低且一致性差。本文介绍基于改进YOLO模型的在线检测方案，通过工业相机采集焊缝图像并实时分析。</p><p>方案已在汽车零部件产线部署，实现24小时不间断检测，大幅降低人工成本。</p>',
        status: 1, isTop: 0, daysAgo: 13,
      },
      {
        categorySlug: 'tech-sharing', title: 'EtherCAT工业总线在机器人控制系统中的应用',
        slug: 'ethercat-industrial-bus-robot-control',
        summary: '深入分析EtherCAT实时以太网技术在机器人多轴联动控制中的方案设计与性能优化。',
        content: '<p>EtherCAT以其低延迟、高同步精度和灵活拓扑结构成为工业机器人控制的主流总线方案。本文从协议原理、硬件选型、软件架构三个层面详细阐述设计要点。</p>',
        status: 1, isTop: 0, daysAgo: 19,
      },
      {
        categorySlug: 'tech-sharing', title: '柔性制造系统中AGV路径规划算法优化',
        slug: 'agv-path-planning-optimization',
        summary: '改进A*算法在动态环境下的AGV路径规划方案，提升多车调度效率30%。',
        content: '<p>在多AGV协同场景中，路径冲突和死锁是常见问题。本文提出基于时间窗的动态路径规划算法，在考虑实时交通状态的同时优化全局通行效率。</p>',
        status: 1, isTop: 0, daysAgo: 23,
      },
      {
        categorySlug: 'tech-sharing', title: '工业物联网平台数据采集与边缘计算架构',
        slug: 'iiot-data-collection-edge-computing',
        summary: '构建面向智能工厂的数据采集体系，实现毫秒级数据同步与实时分析决策。',
        content: '<p>本文介绍基于OPC UA和MQTT协议的数据采集架构，结合边缘计算网关实现数据预处理和本地决策，显著降低云端传输延迟和带宽成本。</p>',
        status: 1, isTop: 0, daysAgo: 28,
      },

      // ---- 媒体报道 (4篇) ----
      {
        categorySlug: 'media-coverage', title: '央视《对话》栏目专访公司CEO',
        slug: 'cctv-dialogue-interview-ceo',
        summary: '公司CEO张明远受邀参加央视《对话》栏目，分享中国智能制造发展历程与未来愿景。',
        content: '<p>张总在节目中分享了公司从初创到行业领军企业的奋斗历程，表示中国制造业转型升级为企业发展提供了巨大机遇。</p>',
        status: 1, isTop: 0, daysAgo: 15,
      },
      {
        categorySlug: 'media-coverage', title: '人民日报：智能制造为中国经济注入新动能',
        slug: 'peoples-daily-smart-manufacturing-report',
        summary: '人民日报深度报道中国智能制造产业发展，我司作为典型案例被重点介绍。',
        content: '<p>报道指出，以工业机器人为代表的智能制造装备产业已成为中国经济高质量发展的重要引擎。文章以我司六轴机器人产线为例，展示了国产机器人在精度和可靠性方面的快速进步。</p>',
        status: 1, isTop: 0, daysAgo: 21,
      },
      {
        categorySlug: 'media-coverage', title: '经济日报：中小企业数字化转型的"中国方案"',
        slug: 'economic-daily-digital-transformation',
        summary: '经济日报专题报道我司为中小企业打造的轻量化自动化升级解决方案。',
        content: '<p>报道聚焦公司推出的"智慧工厂轻量版"解决方案——以协作机器人和柔性输送系统为核心，帮助中小企业以较低成本实现产线自动化升级。</p>',
        status: 1, isTop: 0, daysAgo: 27,
      },
      {
        categorySlug: 'media-coverage', title: '科技日报：国产工业机器人核心技术实现新突破',
        slug: 'sci-tech-daily-domestic-robot-breakthrough',
        summary: '科技日报头版报道我司在运动控制器和精密减速器方面的自主研发成果。',
        content: '<p>文章详细介绍了公司自主研发的SC-1000运动控制器和高精度RV减速器。这两项核心技术长期以来被国外企业垄断，公司经过五年攻关实现突破，打破国外技术封锁。</p>',
        status: 1, isTop: 0, daysAgo: 30,
      },
    ];

    for (const news of newsArticles) {
      await queryRunner.manager.query(
        `INSERT INTO news (category_id, title, slug, summary, content, status, is_top, published_at, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE title = VALUES(title), summary = VALUES(summary), content = VALUES(content), status = VALUES(status), is_top = VALUES(is_top)`,
        [
          newsCatMap[news.categorySlug],
          news.title, news.slug, news.summary, news.content,
          news.status, news.isTop,
          new Date(now.getTime() - news.daysAgo * 24 * 60 * 60 * 1000),
          adminId,
        ],
      );
    }
    console.log(`✅ 新闻已生成: ${newsArticles.length} 篇`);

    // ==================== 公告（20条）====================
    const announcements = [
      {
        title: '2026年春节期间服务安排通知',
        summary: '春节期间公司服务时间调整，请各合作伙伴提前做好安排。',
        content: '<h2>放假时间</h2><p>春节放假时间：1月25日（除夕）至2月7日，共14天。2月8日正常上班。</p><h2>服务安排</h2><ul><li>技术支持热线：暂停服务</li><li>在线工单：正常工作，响应时间延长</li></ul>',
        status: 1, isTop: 1, daysAgo: 1,
      },
      {
        title: '关于产品升级维护的通知',
        summary: '系统将于本周日凌晨进行例行维护，届时部分服务将短暂中断。',
        content: '<h2>维护时间</h2><p>本周日凌晨02:00-06:00，共4小时。</p><h2>影响范围</h2><ul><li>官网浏览：可能短暂中断</li><li>在线询价：暂停使用</li></ul><p>如有紧急需求请联系技术支持。</p>',
        status: 1, isTop: 0, daysAgo: 3,
      },
      {
        title: '新产品发布会邀请函',
        summary: '诚挚邀请您参加5月28日举办的新产品发布会，了解最新研发成果。',
        content: '<h2>发布会信息</h2><p>时间：2026年5月28日 14:00<br/>地点：公司总部多功能厅</p><h2>发布内容</h2><ul><li>新一代协作机器人</li><li>智能柔性生产线3.0</li><li>工业物联网平台</li></ul>',
        status: 1, isTop: 0, daysAgo: 6,
      },
      {
        title: '公司总部搬迁通知',
        summary: '因业务发展需要，公司总部将于2026年7月1日迁至新办公地址。',
        content: '<h2>新地址</h2><p>上海市浦东新区张江高科技园区智能路888号创新大厦15-18层</p><p>搬迁期间业务正常运营，联系电话保持不变。请各合作伙伴及时更新通讯地址。</p>',
        status: 1, isTop: 1, daysAgo: 9,
      },
      {
        title: '2026年度合作伙伴大会报名启动',
        summary: '年度合作伙伴大会定于6月15日举行，现正式开放报名。',
        content: '<p>大会将发布最新产品和渠道政策，同时表彰2025年度优秀合作伙伴。报名截止日期：6月5日。名额有限，请尽早报名。</p>',
        status: 1, isTop: 0, daysAgo: 12,
      },
      {
        title: '关于调整部分产品价格的通知',
        summary: '受原材料价格上涨影响，部分产品价格将于2026年6月1日起调整。',
        content: '<p>本次调价涉及工业机器人整机、控制器、减速器等产品线，平均涨幅3-5%。2026年5月31日前签订的合同按原价执行。</p>',
        status: 1, isTop: 0, daysAgo: 15,
      },
      {
        title: '2026年五一劳动节放假通知',
        summary: '五一劳动节放假安排：5月1日至5月5日共5天，5月6日正常上班。',
        content: '<h2>放假时间</h2><p>5月1日至5月5日，共5天。5月6日（周三）正常上班。</p><h2>服务安排</h2><p>技术支持热线提供7×24小时紧急服务，值班电话：400-888-6666。</p>',
        status: 1, isTop: 0, daysAgo: 18,
      },
      {
        title: '关于开展"质量月"活动的通知',
        summary: '公司定于2026年5月开展全员质量月活动，全面提升产品质量与服务水平。',
        content: '<p>活动内容包括：质量意识培训、生产过程交叉审核、客户满意度调查、QC小组课题攻关等。活动将评选"质量之星"优秀团队和个人。</p>',
        status: 1, isTop: 0, daysAgo: 21,
      },
      {
        title: '公司获得海关AEO高级认证',
        summary: '我司正式通过海关AEO高级认证，将享受进出口通关便利化措施。',
        content: '<p>AEO（Authorized Economic Operator）高级认证是海关对企业信用管理的最高等级。获此认证后，公司在进出口环节将享受优先通关、降低查验率等便利措施，有助于加速国际市场拓展。</p>',
        status: 1, isTop: 0, daysAgo: 24,
      },
      {
        title: '公司官网新版上线公告',
        summary: '经过全面改版升级，公司新官网于2026年4月正式上线运行。',
        content: '<p>新版官网采用全新视觉设计，优化浏览体验，新增产品中心、新闻资讯、在线询价等功能模块。欢迎访问并提出宝贵意见。</p>',
        status: 1, isTop: 0, daysAgo: 27,
      },
      {
        title: '公司获评"上海市高新技术企业"',
        summary: '公司顺利通过上海市高新技术企业认定复审，继续享受高新技术企业税收优惠。',
        content: '<p>高新技术企业认定每三年复审一次。本次复审对公司近三年的研发投入、知识产权、成果转化等方面进行了综合评估，公司各项指标均达到或超过认定标准。</p>',
        status: 1, isTop: 0, daysAgo: 30,
      },
      {
        title: '关于成立华南分公司的通知',
        summary: '为进一步拓展华南市场，公司决定在广州设立华南分公司。',
        content: '<p>华南分公司将配备销售、技术支持、售后服务团队，覆盖广东、广西、海南、福建四省区市场。分公司预计2026年8月正式投入运营。</p>',
        status: 1, isTop: 0, daysAgo: 33,
      },
      {
        title: '公司荣获"2025年度最佳雇主"称号',
        summary: '在智联招聘主办的年度评选中，公司荣获"2025年度最佳雇主"称号。',
        content: '<p>该评选从薪酬福利、培训发展、工作环境、企业文化等维度综合评估。公司以完善的人才培养体系和开放包容的企业文化获得评审委员会高度认可。</p>',
        status: 1, isTop: 0, daysAgo: 36,
      },
      {
        title: '公司参展2026年汉诺威工业博览会',
        summary: '公司将携最新产品亮相2026年汉诺威工业博览会（Hannover Messe）。',
        content: '<h2>展会信息</h2><p>时间：2026年4月20-24日<br/>展位：Hall 17, Stand D50</p><p>本次展会公司将重点展示新一代六轴机器人、协作机器人及柔性生产线解决方案。</p>',
        status: 1, isTop: 0, daysAgo: 39,
      },
      {
        title: '关于加强网络信息安全管理的通知',
        summary: '即日起公司将实施新一轮网络安全升级措施。',
        content: '<p>升级内容包括：启用双因素认证、加强VPN访问控制、定期安全审计与渗透测试。请全体员工配合执行相关安全规范。</p>',
        status: 1, isTop: 0, daysAgo: 42,
      },
      {
        title: '公司正式通过ISO 9001质量管理体系复审',
        summary: '经过严格的审核流程，公司顺利通过ISO 9001:2015质量管理体系年度复审。',
        content: '<p>审核组通过查阅文件、现场检查、员工访谈等方式对公司质量管理体系进行全面评估。审核结论为"体系运行有效，持续改进能力强"，零不符合项通过审核。</p>',
        status: 1, isTop: 0, daysAgo: 45,
      },
      {
        title: '公司发布2025年社会责任报告',
        summary: '报告全面展示了公司在环境保护、员工关怀、社区贡献等方面的实践成果。',
        content: '<p>报告显示，2025年公司单位产值能耗下降12%，员工培训覆盖率达100%，社区公益活动投入超过300万元。该报告已通过第三方独立审验。</p>',
        status: 1, isTop: 0, daysAgo: 48,
      },
      {
        title: '关于规范产品售后服务的通知',
        summary: '公司正式发布2026版售后服务政策，全面提升服务响应速度和服务质量。',
        content: '<h2>主要更新</h2><ul><li>响应时间：紧急故障2小时内响应</li><li>备件保障：常用备件24小时内发出</li><li>定期巡检：每季度一次免费巡检</li></ul>',
        status: 1, isTop: 0, daysAgo: 51,
      },
      {
        title: '公司获批设立博士后科研工作站',
        summary: '经人力资源和社会保障部批准，公司正式设立博士后科研工作站。',
        content: '<p>博士后工作站将聚焦工业机器人运动控制算法、机器视觉、智能传感三大研究方向，面向海内外招收优秀博士毕业生进站工作。公司将提供充足的科研经费和实验条件。</p>',
        status: 1, isTop: 0, daysAgo: 55,
      },
      {
        title: '2026年度"青年创新基金"项目申报启动',
        summary: '面向公司内部青年员工的创新项目资助计划正式启动，单项资助最高20万元。',
        content: '<p>"青年创新基金"面向35岁以下员工，鼓励在机器人技术、智能制造、工业互联网等领域提出创新项目。评审标准包括创新性、可行性和商业价值。申报截止日期：6月30日。</p>',
        status: 1, isTop: 0, daysAgo: 58,
      },
    ];

    for (const ann of announcements) {
      await queryRunner.manager.query(
        `INSERT INTO announcements (title, summary, content, status, is_top, published_at, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE title = VALUES(title), summary = VALUES(summary), content = VALUES(content), status = VALUES(status), is_top = VALUES(is_top)`,
        [
          ann.title, ann.summary, ann.content,
          ann.status, ann.isTop,
          new Date(now.getTime() - ann.daysAgo * 24 * 60 * 60 * 1000),
          adminId,
        ],
      );
    }
    console.log(`✅ 公告已生成: ${announcements.length} 条`);

    // ==================== 产品（20个）====================
    const products = [
      // ---- 工业机器人 (5个) ----
      {
        categorySlug: 'industrial-robots', name: '六轴工业机器人 IR-2000',
        slug: 'six-axis-robot-ir2000',
        summary: '高精度六轴工业机器人，负载20kg，工作半径1850mm，适用于焊接、喷涂、搬运等场景。',
        content: '<h2>产品简介</h2><p>IR-2000采用先进运动控制算法，重复定位精度达±0.05mm。</p><h2>优势</h2><ul><li>高速运动：速度提升30%</li><li>低能耗：降低15%</li><li>易集成：支持主流工业总线</li></ul>',
        parametersJson: JSON.stringify([{ label: '负载', value: '20kg' }, { label: '工作半径', value: '1850mm' }, { label: '重复精度', value: '±0.05mm' }, { label: '轴数', value: '6轴' }, { label: '防护等级', value: 'IP65' }]),
        status: 1, sort: 100, daysAgo: 1,
      },
      {
        categorySlug: 'industrial-robots', name: '协作机器人 CR-5',
        slug: 'collaborative-robot-cr5',
        summary: '安全协作机器人，负载5kg，支持人机协同作业，无需安全围栏。',
        content: '<p>CR-5协作机器人专为中小企业设计，具备16项安全功能，通过ISO 10218认证。</p><ul><li>拖拽示教：无需编程基础</li><li>安全触停：碰撞检测<10ms</li><li>快速部署：2小时完成调试</li></ul>',
        parametersJson: JSON.stringify([{ label: '负载', value: '5kg' }, { label: '工作半径', value: '900mm' }, { label: '最大速度', value: '2m/s' }, { label: '重量', value: '20kg' }]),
        status: 1, sort: 90, daysAgo: 3,
      },
      {
        categorySlug: 'industrial-robots', name: '四轴码垛机器人 PR-800',
        slug: 'four-axis-palletizing-robot-pr800',
        summary: '高速码垛专用机器人，最大负载80kg，适用于食品饮料、化工建材行业。',
        content: '<p>PR-800专为高速码垛场景设计，采用并联连杆结构，运动稳定性好，维护成本低。</p><ul><li>节拍速度：最高15次/分钟</li><li>通用性强：适配多种夹具</li></ul>',
        parametersJson: JSON.stringify([{ label: '负载', value: '80kg' }, { label: '工作半径', value: '2500mm' }, { label: '节拍速度', value: '15次/分钟' }, { label: '防护等级', value: 'IP54' }]),
        status: 1, sort: 85, daysAgo: 6,
      },
      {
        categorySlug: 'industrial-robots', name: '焊接机器人 WR-1600',
        slug: 'welding-robot-wr1600',
        summary: '弧焊专用六轴机器人，内置焊接专家工艺库，大幅缩短编程调试时间。',
        content: '<p>WR-1600集成焊缝跟踪与熔池监测功能，搭配自研焊接电源，实现高质量自动化焊接。</p><ul><li>内置焊接工艺库</li><li>支持激光焊缝跟踪</li><li>适配主流焊接电源</li></ul>',
        parametersJson: JSON.stringify([{ label: '负载', value: '16kg' }, { label: '工作半径', value: '1700mm' }, { label: '重复精度', value: '±0.04mm' }, { label: '适用工艺', value: 'MIG/MAG/TIG' }]),
        status: 1, sort: 80, daysAgo: 9,
      },
      {
        categorySlug: 'industrial-robots', name: 'SCARA机器人 SR-400',
        slug: 'scara-robot-sr400',
        summary: '高速SCARA装配机器人，适用于3C电子、医药等行业的高速精密装配。',
        content: '<p>SR-400采用轻量化设计，运动速度快，重复定位精度高，适配洁净室环境。</p><ul><li>节拍时间：0.38s/标准循环</li><li>洁净室等级：ISO Class 5</li></ul>',
        parametersJson: JSON.stringify([{ label: '负载', value: '4kg' }, { label: '臂长', value: '400mm' }, { label: '重复精度', value: '±0.01mm' }, { label: '节拍时间', value: '0.38s' }]),
        status: 1, sort: 75, daysAgo: 12,
      },

      // ---- 自动化设备 (4个) ----
      {
        categorySlug: 'automation-equipment', name: '智能柔性输送系统 SFT-300',
        slug: 'smart-flexible-transfer-sft300',
        summary: '模块化柔性输送系统，支持快速重组，适应多品种、小批量生产模式。',
        content: '<p>SFT-300采用模块化设计，各单元可自由组合扩展，配备智能调度系统实现物料动态分配。</p><ul><li>模块化设计：按需扩展</li><li>智能调度：效率提升25%</li></ul>',
        parametersJson: JSON.stringify([{ label: '输送速度', value: '0.1-2m/s' }, { label: '最大载重', value: '50kg/单元' }, { label: '通讯协议', value: 'Modbus TCP/Profinet' }]),
        status: 1, sort: 85, daysAgo: 5,
      },
      {
        categorySlug: 'automation-equipment', name: '全自动螺丝锁付工作站 AS-200',
        slug: 'automatic-screw-fastening-as200',
        summary: '高精度自动螺丝锁付系统，支持多规格螺丝混装，扭矩精度±3%。',
        content: '<p>AS-200配备视觉定位和扭矩监控功能，适用于电子、家电、汽车零部件的精密装配。</p><ul><li>多规格混装：支持4种螺丝同时供料</li><li>扭矩监控：实时记录每颗螺丝扭矩</li></ul>',
        parametersJson: JSON.stringify([{ label: '锁付速度', value: '1.5s/颗' }, { label: '扭矩范围', value: '0.5-5Nm' }, { label: '定位精度', value: '±0.02mm' }]),
        status: 1, sort: 80, daysAgo: 8,
      },
      {
        categorySlug: 'automation-equipment', name: '智能视觉分拣系统 VS-100',
        slug: 'vision-sorting-system-vs100',
        summary: '基于AI视觉的高速分拣系统，分拣速度达120件/分钟，兼容多种物料。',
        content: '<p>VS-100采用深度学习算法，可快速适应不同种类物料的分拣需求，切换时间<5分钟。</p><ul><li>AI识别：自动学习新物料特征</li><li>高速分拣：120件/分钟</li></ul>',
        parametersJson: JSON.stringify([{ label: '分拣速度', value: '120件/分钟' }, { label: '识别精度', value: '99.5%' }, { label: '物料兼容', value: '>100种' }]),
        status: 1, sort: 75, daysAgo: 11,
      },
      {
        categorySlug: 'automation-equipment', name: '自动化包装线 AP-500',
        slug: 'automated-packaging-line-ap500',
        summary: '全自动包装生产线，集成开箱、装箱、封箱、码垛全流程。',
        content: '<p>AP-500可对接前端产线和后端仓储系统，实现包装全流程无人化。</p><ul><li>一体化集成：减少中间转运环节</li><li>柔性包装：支持多种箱型和包装方式</li></ul>',
        parametersJson: JSON.stringify([{ label: '包装速度', value: '8箱/分钟' }, { label: '箱型范围', value: '200-600mm' }, { label: '操作人员', value: '0-1人' }]),
        status: 1, sort: 70, daysAgo: 14,
      },

      // ---- 传感器 (4个) ----
      {
        categorySlug: 'sensors', name: '工业级3D视觉传感器 VS-3D02',
        slug: 'industrial-3d-vision-sensor-vs3d02',
        summary: '高精度3D视觉传感器，支持结构光和双目立体视觉，适用于工件识别与定位引导。',
        content: '<p>VS-3D02采用自研深度学习算法，可在复杂光照条件下稳定工作。</p><ul><li>高精度：Z轴精度0.1mm</li><li>高速度：处理时间<80ms</li></ul>',
        parametersJson: JSON.stringify([{ label: '视野范围', value: '300×200mm' }, { label: '工作距离', value: '300-800mm' }, { label: 'Z轴精度', value: '0.1mm' }, { label: '接口', value: 'GigE Vision' }]),
        status: 1, sort: 80, daysAgo: 7,
      },
      {
        categorySlug: 'sensors', name: '激光位移传感器 LS-150',
        slug: 'laser-displacement-sensor-ls150',
        summary: '高精度激光位移传感器，测量范围±15mm，线性精度±1μm。',
        content: '<p>LS-150采用三角测量原理，适用于工件尺寸检测、高度差测量等高精度应用场景。</p><ul><li>超高精度：线性精度±1μm</li><li>高速采样：50kHz</li></ul>',
        parametersJson: JSON.stringify([{ label: '测量范围', value: '±15mm' }, { label: '线性精度', value: '±1μm' }, { label: '采样频率', value: '50kHz' }]),
        status: 1, sort: 75, daysAgo: 10,
      },
      {
        categorySlug: 'sensors', name: '力矩传感器 TS-60',
        slug: 'torque-sensor-ts60',
        summary: '六维力/力矩传感器，适用于协作机器人末端力控，支持力觉示教与柔顺控制。',
        content: '<p>TS-60集成温度补偿和数字滤波功能，实时输出三维力和三维力矩数据。</p><ul><li>六维力/力矩同步测量</li><li>支持EtherCAT实时通讯</li><li>过载保护：300%额定值</li></ul>',
        parametersJson: JSON.stringify([{ label: 'Fx/Fy量程', value: '±200N' }, { label: 'Fz量程', value: '±400N' }, { label: '力矩量程', value: '±15Nm' }, { label: '分辨率', value: '0.05N' }]),
        status: 1, sort: 70, daysAgo: 13,
      },
      {
        categorySlug: 'sensors', name: '安全激光扫描仪 SS-270',
        slug: 'safety-laser-scanner-ss270',
        summary: '通过SIL2/PLd认证的安全激光扫描仪，用于机器人区域安全防护。',
        content: '<p>SS-270可设置多个安全区域和警告区域，支持动态区域切换，满足AGV和协作机器人安全标准。</p><ul><li>扫描角度：270°</li><li>防护距离：最大5m</li><li>双通道安全输出</li></ul>',
        parametersJson: JSON.stringify([{ label: '扫描角度', value: '270°' }, { label: '防护距离', value: '5m' }, { label: '安全等级', value: 'SIL2/PLd' }, { label: '响应时间', value: '<80ms' }]),
        status: 1, sort: 65, daysAgo: 16,
      },

      // ---- 控制系统 (4个) ----
      {
        categorySlug: 'control-systems', name: '智能控制器 SC-1000',
        slug: 'smart-controller-sc1000',
        summary: '高性能运动控制器，支持64轴联动，配备自主研发的运动控制内核。',
        content: '<p>SC-1000采用多核异构架构，满足高端装备的复杂控制需求。</p><ul><li>高性能：支持64轴联动</li><li>高实时性：控制周期1ms</li><li>易扩展：模块化I/O设计</li></ul>',
        parametersJson: JSON.stringify([{ label: '控制轴数', value: '64轴' }, { label: '控制周期', value: '1ms' }, { label: '通讯接口', value: 'EtherCAT' }, { label: '编程语言', value: 'IEC 61131-3' }]),
        status: 1, sort: 75, daysAgo: 10,
      },
      {
        categorySlug: 'control-systems', name: '嵌入式视觉控制器 VC-200',
        slug: 'embedded-vision-controller-vc200',
        summary: '紧凑型视觉控制器，集成图像采集与AI推理，适合嵌入产线设备。',
        content: '<p>VC-200基于ARM+NPU架构，功耗低至15W，可在-20~60℃环境下稳定运行。</p><ul><li>低功耗：15W</li><li>宽温域：-20~60℃</li><li>丰富的I/O接口</li></ul>',
        parametersJson: JSON.stringify([{ label: '处理器', value: 'ARM Cortex-A78 + NPU' }, { label: '算力', value: '6 TOPS' }, { label: '功耗', value: '15W' }, { label: '防护等级', value: 'IP40' }]),
        status: 1, sort: 70, daysAgo: 15,
      },
      {
        categorySlug: 'control-systems', name: '驱控一体伺服系统 SD-500',
        slug: 'drive-control-servo-sd500',
        summary: '集成驱动与控制功能的伺服系统，支持高精度位置、速度、力矩控制。',
        content: '<p>SD-500将伺服驱动器与运动控制器合二为一，减少柜体空间占用50%，降低系统成本。</p><ul><li>一拖多设计：单台支持3-6轴</li><li>自适应参数整定</li><li>内置安全力矩关断（STO）</li></ul>',
        parametersJson: JSON.stringify([{ label: '支持轴数', value: '3-6轴' }, { label: '功率范围', value: '200W-5kW' }, { label: '编码器', value: '23位绝对值' }, { label: '总线接口', value: 'EtherCAT' }]),
        status: 1, sort: 65, daysAgo: 19,
      },
      {
        categorySlug: 'control-systems', name: '工业物联网网关 IOT-G100',
        slug: 'iiot-gateway-iotg100',
        summary: '支持多协议数据采集的工业网关，实现设备上云与远程运维。',
        content: '<p>IOT-G100支持OPC UA、Modbus、MQTT等主流工业协议，内置边缘计算能力。</p><ul><li>多协议支持：200+工业协议</li><li>本地数据缓存：断网不丢数据</li><li>安全传输：TLS 1.3加密</li></ul>',
        parametersJson: JSON.stringify([{ label: '支持协议', value: '200+' }, { label: '数据采集频率', value: '最高1kHz' }, { label: '存储', value: '64GB eMMC' }, { label: '防护等级', value: 'IP30' }]),
        status: 1, sort: 60, daysAgo: 23,
      },

      // ---- 配件耗材 (3个) ----
      {
        categorySlug: 'accessories', name: '机器人末端工具快换系统 EC-200',
        slug: 'end-effector-changer-ec200',
        summary: '气电快换装置，支持机器人末端工具自动更换，换装时间<3秒。',
        content: '<p>EC-200集成气路、电路、信号线，一次换装时间<3秒。</p><ul><li>快速换装：<3秒/次</li><li>高可靠性：10万次寿命</li><li>多规格接口</li></ul>',
        parametersJson: JSON.stringify([{ label: '换装时间', value: '<3s' }, { label: '最大载荷', value: '30kg' }, { label: '气路数量', value: '8路' }, { label: '寿命', value: '10万次' }]),
        status: 1, sort: 70, daysAgo: 12,
      },
      {
        categorySlug: 'accessories', name: '精密RV减速器 RV-40E',
        slug: 'precision-rv-reducer-rv40e',
        summary: '自主研发RV减速器，背隙<1弧分，额定扭矩400Nm，适配中大型机器人。',
        content: '<p>RV-40E采用摆线针轮结构，传动精度高、刚性大、寿命长，是工业机器人关节核心部件。</p><ul><li>高精度：背隙<1弧分</li><li>长寿命：MTBF>10000h</li></ul>',
        parametersJson: JSON.stringify([{ label: '减速比', value: '40:1' }, { label: '额定扭矩', value: '400Nm' }, { label: '背隙', value: '<1弧分' }, { label: '效率', value: '>85%' }]),
        status: 1, sort: 65, daysAgo: 17,
      },
      {
        categorySlug: 'accessories', name: '气动夹爪模块 PG-100',
        slug: 'pneumatic-gripper-pg100',
        summary: '系列化气动夹爪，行程10-100mm，夹持力可调，适配多种工件形状。',
        content: '<p>PG-100提供平行开闭和角度开闭两种运动形式，可搭配多种材质指尖。</p><ul><li>模块化设计：指尖快速更换</li><li>自锁功能：断气不掉件</li><li>传感器集成的确认</li></ul>',
        parametersJson: JSON.stringify([{ label: '行程范围', value: '10-100mm' }, { label: '夹持力', value: '50-500N' }, { label: '工作压力', value: '0.3-0.8MPa' }, { label: '重量', value: '0.3-2.5kg' }]),
        status: 1, sort: 60, daysAgo: 21,
      },
    ];

    for (const product of products) {
      await queryRunner.manager.query(
        `INSERT INTO products (category_id, name, slug, summary, content, images_json, parameters_json, status, sort, published_at, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name = VALUES(name), summary = VALUES(summary), content = VALUES(content), status = VALUES(status), sort = VALUES(sort)`,
        [
          productCatMap[product.categorySlug],
          product.name, product.slug, product.summary, product.content,
          JSON.stringify(['https://placehold.co/800x600/2563eb/white?text=' + encodeURIComponent(product.name)]),
          product.parametersJson,
          product.status, product.sort,
          new Date(now.getTime() - product.daysAgo * 24 * 60 * 60 * 1000),
          adminId,
        ],
      );
    }
    console.log(`✅ 产品已生成: ${products.length} 个`);

    await queryRunner.commitTransaction();
    console.log('\n🎉 测试数据全部生成完毕！');
    console.log(`   - 新闻: ${newsArticles.length} 篇`);
    console.log(`   - 公告: ${announcements.length} 条`);
    console.log(`   - 产品: ${products.length} 个`);
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error('❌ 种子数据生成失败:', error);
    throw error;
  } finally {
    await queryRunner.release();
    await AppDataSource.destroy();
  }
}

void seed();
