// 主页内容，全部整理自 https://civil.sysu.edu.cn/teacher/938

export const EMAIL = 'hekai7@mail.sysu.edu.cn';

// 八个链接依次挂在八簇花冠上：右、左、右、左……（与 scene/tree.js 里 PADS[1..8] 对应）
export const LINKS = [
  { id: 'sysu', name: '中山大学', handle: 'civil.sysu.edu.cn', href: 'https://civil.sysu.edu.cn/teacher/938', external: true },
  { id: 'about', name: '个人简介', handle: 'About', href: '#about' },
  { id: 'lab', name: '课题组主页', handle: 'lab.rjmart.cn', href: 'https://lab.rjmart.cn/10249/064DE433C99ED70A', external: true },
  { id: 'projects', name: '科研项目', handle: 'Research', href: '#projects' },
  { id: 'rg', name: 'ResearchGate', handle: 'Kai-He-15', href: 'https://www.researchgate.net/profile/Kai-He-15', external: true },
  { id: 'papers', name: '代表论文', handle: 'Publications', href: '#papers' },
  { id: 'wos', name: 'Web of Science', handle: 'ABC-8032-2020', href: 'https://www.webofscience.com/wos/author/record/ABC-8032-2020', external: true },
  { id: 'join', name: '招生招聘', handle: 'Join us', href: '#join' },
];

const BIO =
  '贺凯，1986年生，中山大学土木工程学院副教授，博士生导师，中山大学百人计划学者，中国环境科学学会环境损害鉴定评估专业委员会常务委员兼副秘书长。主要从事光谱质谱检测及其大数据分析、水污染溯源与迁移转化机制、环境监测仪器研发及其产业化等相关工作，具体从污染监测仪器研发—污染物匹配溯源—污染物风险评估三个层面开展系统研究。';

const BIO_2 =
  '先后完成1项日本国家学术振兴会基金和1项中日合作科研基金，承担国家级项目2项，省部级重点项目1项，其他项目3项，参与多个国家级和省部级项目。相关研究成果发表在 Environment International、Journal of Hazardous Materials 和 Science of the Total Environment 等高水平期刊。';

const EDUCATION = [
  { when: '2012 – 2016', what: '日本京都大学 工学研究科', note: '都市环境工学专攻 · 工学博士' },
  { when: '2009 – 2012', what: '清华大学 环境学院', note: '环境工程专业 · 工学硕士' },
  { when: '2005 – 2009', what: '南开大学 环境科学与工程学院', note: '环境工程专业 · 工学学士' },
];

const CAREER = [
  { when: '2021 – 今', what: '中山大学 土木工程学院', note: '副教授' },
  { when: '2020 – 2021', what: '日本京都大学 流域圈综合环境质研究中心', note: '助理教授' },
  { when: '2017 – 2020', what: '日本京都大学 流域圈综合环境质研究中心', note: '机关研究员' },
  { when: '2016 – 2017', what: '日本京都大学 工学研究科', note: '环境研究综合推进费资助博士后' },
];

const SERVICE = [
  '中国环境科学学会环境损害鉴定评估专业委员会 常务委员兼副秘书长',
  'Chinese Chemical Letters 青年编委',
  '日本水环境学会 会员',
  '日本水环境学会 MS 技术研究委员会 会员',
  '京都生体质量分析研究会 会员',
  '京都大学环境卫生工学研究会 会员',
];

const COURSES = ['程序设计（必修）', '程序设计实验（必修）', '工程经济学（必修）', '大学化学实验（必修）', '水利信息化与大数据（专选）'];

const PROJECTS = [
  { when: '2022 – 2026', funder: '国家重点研发计划', title: '流域关键生源要素多介质溯源与污染过程解析', role: '子课题主持' },
  { when: '2022 – 2025', funder: '国家重点研发计划“政府间国际科技创新合作”重点专项', title: '污水资源化与新污染物风险控制技术', role: '课题主持' },
  { when: '2024 – 2026', funder: '广东省自然科学基金面上项目', title: '基于污水流行病学统计分析的城市抗生素消费预测研究', role: '主持' },
  { when: '2023 – 2025', funder: '佛山市核心技术攻关重点项目', title: '水生态多源污染智能监测系统研发及产业化', role: '课题主持' },
  { when: '2023 – 2025', funder: '水利部粤港澳大湾区水安全保障重点实验室开放基金', title: '粤港澳大湾区感潮河道中抗生素类新污染物非靶向高通量筛查溯源技术研究', role: '主持' },
  { when: '2023 – 2026', funder: '广东省自然科学基金卓越青年团队项目', title: '粤港澳大湾区城市水灾害智慧管理与防控', role: '参与' },
  { when: '2022 – 2024', funder: '珠海市科技和工业信息化局 · 珠海市科技项目', title: '供水管网风险评估监测及环保非开挖修复技术研究', role: '项目骨干' },
  { when: '2022 – 2023', funder: '国家生态环境部项目', title: '管网探测诊断及绿色修复技术实证', role: '项目骨干' },
  { when: '2021 – 2024', funder: '中山大学“百人计划”资助项目', title: '污染溯源与生态修复', role: '主持' },
  { when: '2021 – 2022', funder: '广东省环境资源利用与保护重点实验室基金', title: '面源污染质谱指纹数据库的构建和溯源预警技术', role: '主持' },
  { when: '2020 – 2023', funder: '清华大学深圳国际研究生院海外科研合作基金', title: '基于可见光催化剂的类芬顿体系对水环境中有机微污染物及病原微生物的协同控制研究', role: '项目骨干' },
  { when: '2019 – 2021', funder: '日本学术振兴会科学研究费基金', title: '基于生物质碳-二氧化钛复合材料的抗生素去除及机理研究', role: '主持' },
  { when: '2019 – 2021', funder: '日本 YANMAR 资源循环支援机构', title: '2019 年度研究助成', role: '项目骨干' },
  { when: '2016 – 2019', funder: '日本环境研究综合推进费', title: '考虑变换过程的人工化学物质管理手法的研究', role: '参与' },
  { when: '2012 – 2016', funder: '日本科学技术振兴机构（JST）战略性创造研究推进事业（CREST）', title: '利用城市土壤渗透处理的再生水利用系统的构筑', role: '参与' },
];

const PAPERS_RECENT = [
  {
    authors: 'Lihao Pang#, Kai He#, Yuxuan Zhang, Penghui Li, Yingchao Lin, Junjie Yue',
    title: 'Predicting environmental risks of pharmaceutical residues by wastewater surveillance: An analysis based on pharmaceutical sales and their excretion data',
    journal: 'Science of The Total Environment', detail: '916, 170204 (2024)', tags: ['共同一作', '中科院1区 TOP'],
  },
  {
    authors: 'Zejun Liu, Jinlong Yuan, Yingying Lin, Feng Lin, Bingjun Liu, Qidong Yin*, Kai He*, Xinfeng Zhao, Haoxian Lu',
    title: 'Integrating fecal pollution markers and fluorescence analysis for water quality assessment of urban river',
    journal: 'Science of The Total Environment', detail: '909, 168492 (2024)', tags: ['通讯作者', '中科院1区 TOP'],
  },
  {
    authors: 'Zejun Liu, Yingying Lin, Yanhong Ge, Ziyue Zhu, Jinlong Yuan, Qidong Yin, Bingjun Liu, Kai He*, Maochuan Hu*',
    title: 'Meta-analysis of microbial source tracking for the identification of fecal contamination in aquatic environments based on data-mining',
    journal: 'Journal of Environmental Management', detail: '345, 118800 (2023)', tags: ['通讯作者', '中科院1区 TOP'],
  },
  {
    authors: 'Yaotong Gao, Yuxuan Zhang, Qiuying Wei, Xiaoyuan Qi, Qidong Yin, Bingjun Liu, Kai He*',
    title: 'Response and synergistic effect of microbial community to submerged macrophyte in restoring urban black and smelly water bodies',
    journal: 'Journal of Water Process Engineering', detail: '53, 103906 (2023)', tags: ['通讯作者', '中科院2区'],
  },
  {
    authors: 'Mingkun Zhang, Xianjun Tan, Wenhui Ding, Zhenying Jiang, Kai He, Bo Zhao, Haruka Takeuchi, Yuxiong Huang',
    title: 'Aluminum-based electrocoagulation for residual fluoride removal during per- and polyfluoroalkyl substances (PFASs) wastewater treatment',
    journal: 'Separation and Purification Technology', detail: '308, 122989 (2023)', tags: ['中科院1区 TOP'],
  },
  {
    authors: 'Yuanfeng Qi, Wei Wang, Xiao Quan, Chenxi Fan, Baoxin Ge, Chang Xu, Mingyang Cui, Qinyan Yue, Baoyu Gao, Yue Gao, Kai He*',
    title: 'Blockchain-like Eα analysis strategy for two distinct “White-box” modeling methodologies to simulate the incineration of oily sludge',
    journal: 'Journal of Cleaner Production', detail: '384, 135678 (2023)', tags: ['通讯作者', '中科院1区 TOP'],
  },
  {
    authors: 'Yuanfeng Qi, Chenxi Fan, Xiao Quan, Fei Xi, Zejun Liu, Qi Cao, Zhiren Wu, Qinyan Yue, Baoyu Gao, Xing Xu, Kai He*',
    title: 'In-situ recycling strategy for co-treatment of antimony-rich sludge char and leachate: Pilot-scale application in an engineering case',
    journal: 'Chemical Engineering Journal', detail: '446 (Part 4), 137315 (2022)', tags: ['通讯作者', '中科院1区 TOP'],
  },
];

const PAPERS_EARLY = [
  {
    authors: 'Cordero, J.A., He, K.*, Janya, K., Echigo, S., Itoh, S.',
    title: 'Predicting formation of haloacetic acids by chlorination of organic compounds using machine-learning-assisted quantitative structure-activity relationships',
    journal: 'Journal of Hazardous Materials', detail: '408, 124466 (2021)', tags: ['通讯作者'],
  },
  {
    authors: 'Zhang, H.#, Lin, Y.#, Men, Z., Ihara, M., Li, W.*, He, K.*',
    title: 'Evaluation of pharmaceutical activities of G-protein coupled receptor targeted pharmaceuticals in Chinese wastewater effluent',
    journal: 'Chinese Chemical Letters', detail: '31(10), 2859–2863 (2020)', tags: ['通讯作者'],
  },
  {
    authors: 'He, K., Borthwick, A. G., Lin, Y., Li, Y.*, Fu, J., Wong, Y., Liu, W.*',
    title: 'Sale-based estimation of pharmaceutical concentrations and associated environmental risk in the Japanese wastewater system',
    journal: 'Environment International', detail: '139, 105690 (2020)', tags: ['第一作者'],
  },
  {
    authors: 'Cordero, J.A., He, K.*, Okuta, E., Echigo, S., Itoh, S.',
    title: 'Effect of biodegradation on haloacetic acid formation potentials of anthropogenic compounds during chlorination',
    journal: 'Environmental Science and Pollution Research', detail: '27, 18117–18128 (2020)', tags: ['通讯作者'],
  },
  {
    authors: 'He, K.*, Asada, Y., Echigo, S., Itoh, S.',
    title: 'Biodegradation of pharmaceuticals and personal care products in the sequential combination of activated sludge treatment and soil aquifer treatment',
    journal: 'Environmental Technology', detail: '41(3), 378–388 (2020)', tags: ['第一作者', '通讯作者'],
  },
  {
    authors: 'Klon D.C. Hinneh, Anas El Hanafi, He, K.*, Kosaka, K., Echigo, S., Asada, Y., Itoh, S.',
    title: 'Formation of N-nitrosodimethylamine by chloramination of anthropogenic nitrogenous compounds with dimethylamine monitored by Japanese water authorities',
    journal: 'Journal of Hazardous Materials', detail: '367, 620–628 (2019)', tags: ['通讯作者'],
  },
  {
    authors: 'He, K.*, Yonetani, T., Asada, Y., Echigo, S., Itoh, S.',
    title: 'Simultaneous determination of carbamazepine-N-glucuronide and carbamazepine phase I metabolites in the wastewater by liquid chromatography-tandem mass spectrometry',
    journal: 'Microchemical Journal', detail: '145, 1191–1198 (2019)', tags: ['第一作者', '通讯作者'],
  },
  {
    authors: '李悦宁#, 贺凯#, 王婷, 赵博, 越后信哉, 林应超',
    title: '日本消毒副产物及其前体物的现状及研究进展',
    journal: '环境化学', detail: '37, 1820–1830 (2018)', tags: ['共同一作'],
  },
  {
    authors: 'He, K.*, Okuta, E., José, A.C., Echigo, S., Asada, Y., Itoh, S.',
    title: 'Formation of haloacetic acids by chlorination of low molecular weight compounds listed on Pollutant Release and Transfer Registers (PRTRs)',
    journal: 'Journal of Hazardous Materials', detail: '351, 98–107 (2018)', tags: ['第一作者', '通讯作者'],
  },
  {
    authors: 'Dang, C., Yang, Z., Liu, W.*, Du, P., Cui, F., He, K.*',
    title: 'Role of extracellular polymeric substances in biosorption of Pb²⁺ by a high metal ion tolerant fungal strain Aspergillus niger PTN31',
    journal: 'Journal of Environmental Chemical Engineering', detail: '6, 2733–2742 (2018)', tags: ['通讯作者'],
  },
  {
    authors: 'He, K.*, Echigo, S., Asada, Y., Itoh, S.',
    title: 'Determination of caffeine and its transformation products in wastewater treatment plants using solid-phase extraction and liquid chromatography-tandem mass spectrometry',
    journal: 'Analytical Sciences', detail: '34, 349–354 (2018)', tags: ['第一作者', '通讯作者'],
  },
  {
    authors: 'He, K., Yin, Q., Liu, A., Echigo, S., Itoh, S., Wu, G.*',
    title: 'Enhanced anaerobic degradation of amide pharmaceuticals by dosing ferroferric oxide or anthraquinone-2,6-disulfonate',
    journal: 'Journal of Water Process Engineering', detail: '18, 192–197 (2017)', tags: ['第一作者'],
  },
  {
    authors: 'He, K.*, Echigo, S., Itoh, S.',
    title: 'Effect of operating conditions in soil aquifer treatment on the removals of pharmaceuticals and personal care products',
    journal: 'Science of the Total Environment', detail: '565, 672–681 (2016)', tags: ['第一作者', '通讯作者'],
  },
];

const GRADUATES = [
  { who: '刘泽军', what: '21级土木水利硕士', where: '东京大学工学研究科 攻读博士' },
  { who: '施　念', what: '20级土木、水利与海洋工程本科', where: '帝国理工学院 水文与水资源管理理学硕士' },
  { who: '孙先锋', what: '19级土木工程本科', where: '复旦大学计算机科学技术学院 攻读硕士' },
  { who: '林　枫', what: '19级土木工程本科', where: '本校继续硕士深造' },
  { who: '林盈滢', what: '19级土木工程本科', where: '本校继续硕士深造' },
  { who: '冯诗怡', what: '20级土木、水利与海洋工程本科', where: '湖北省 工作' },
];

const HONORS = [
  '施念 · 20级本科 · 土木工程学院优秀本科毕业论文',
  '刘泽军 · 21级硕士 · 中山大学一等助研金',
  '袁金龙 · 22级硕士 · 中山大学一等助研金',
];

const CONTESTS = [
  { when: '2023', what: '第三届广东省智慧水利创新大赛 · 广汇源杯', prize: '二等奖' },
  { when: '2023', what: '第五届全国大学生可再生能源优秀科技作品竞赛（海上风电驱动的电化学海水淡化联合海水制氢装置）', prize: '本科生组一等奖' },
  { when: '2022', what: '第二届广东省智慧水利创新大赛 · 广汇源杯（基于区块链的流域水文气象监测信息管理系统）', prize: '一等奖' },
  { when: '2022', what: '第二届广东省智慧水利创新大赛 · 广汇源杯（典型城区污水管道的检测与修复决策技术研究）', prize: '三等奖' },
  { when: '2022', what: '全国大学生节能减排社会实践与科技竞赛', prize: '三等奖' },
];

/* ---------- 渲染 ---------- */

const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

const highlightSelf = (s) => esc(s).replace(/(Kai He[#*]*|He, K\.[#*]*|贺凯[#*]*)/g, '<b>$1</b>');

const timeline = (items) =>
  `<ol class="tl">${items
    .map((i) => `<li><span class="tl__when">${esc(i.when)}</span><span class="tl__what">${esc(i.what)}</span><span class="tl__note">${esc(i.note)}</span></li>`)
    .join('')}</ol>`;

const paperList = (items) =>
  `<ol class="papers">${items
    .map(
      (p) => `<li class="paper">
        <p class="paper__title">${esc(p.title)}</p>
        <p class="paper__authors">${highlightSelf(p.authors)}</p>
        <p class="paper__venue"><i>${esc(p.journal)}</i>, ${esc(p.detail)}</p>
        <p class="paper__tags">${p.tags.map((t) => `<span class="tag${t.includes('区') ? ' tag--tier' : ''}">${esc(t)}</span>`).join('')}</p>
      </li>`,
    )
    .join('')}</ol>`;

export const SECTIONS = [
  {
    id: 'about',
    tab: '简介',
    kicker: 'About',
    title: '个人简介',
    html: () => `
      <div class="about-head">
        <img class="portrait" src="./images/portrait.jpg" alt="贺凯老师照片" width="300" height="400" loading="lazy" />
        <div>
          <p class="lead">${esc(BIO)}</p>
        </div>
      </div>
      <p>${esc(BIO_2)}</p>

      <h3>研究主线</h3>
      <div class="chain">
        <div class="chain__step"><span class="chain__no">壹</span><span>污染监测仪器研发</span></div>
        <div class="chain__arrow" aria-hidden="true"></div>
        <div class="chain__step"><span class="chain__no">贰</span><span>污染物匹配溯源</span></div>
        <div class="chain__arrow" aria-hidden="true"></div>
        <div class="chain__step"><span class="chain__no">叁</span><span>污染物风险评估</span></div>
      </div>
      <p class="tags">
        <span class="tag">光谱质谱检测</span><span class="tag">大数据分析</span><span class="tag">水污染溯源</span>
        <span class="tag">迁移转化机制</span><span class="tag">环境监测仪器</span><span class="tag">新污染物</span>
      </p>

      <h3>教育经历</h3>
      ${timeline(EDUCATION)}

      <h3>工作经历</h3>
      ${timeline(CAREER)}

      <h3>学术兼职</h3>
      <ul class="plain">${SERVICE.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>

      <h3>主讲课程</h3>
      <p class="tags">${COURSES.map((c) => `<span class="tag">${esc(c)}</span>`).join('')}</p>
    `,
  },
  {
    id: 'projects',
    tab: '项目',
    kicker: 'Research',
    title: '科研项目',
    html: () => `
      <p class="lead">${esc(BIO_2.split('。')[0])}。</p>
      <figure class="figure">
        <img src="./images/tracing.jpg" alt="流域溯源方法示意图" width="1600" height="1200" loading="lazy" />
        <figcaption>流域溯源方法示意</figcaption>
      </figure>
      <ol class="projects">${PROJECTS.map(
        (p) => `<li class="project">
          <div class="project__meta"><span class="project__when">${esc(p.when)}</span><span class="role${/主持/.test(p.role) ? ' role--lead' : ''}">${esc(p.role)}</span></div>
          <p class="project__title">${esc(p.title)}</p>
          <p class="project__funder">${esc(p.funder)}</p>
        </li>`,
      ).join('')}</ol>
    `,
  },
  {
    id: 'papers',
    tab: '论文',
    kicker: 'Publications',
    title: '代表论文',
    html: () => `
      <p class="lead">完整列表见
        <a href="https://www.researchgate.net/profile/Kai-He-15" target="_blank" rel="noopener">ResearchGate</a> 与
        <a href="https://www.webofscience.com/wos/author/record/ABC-8032-2020" target="_blank" rel="noopener">Web of Science</a>。
        <span class="muted"># 共同一作　* 通讯作者</span>
      </p>
      <h3>2021 至今</h3>
      ${paperList(PAPERS_RECENT)}
      <h3>2016 – 2021</h3>
      ${paperList(PAPERS_EARLY)}
    `,
  },
  {
    id: 'join',
    tab: '招生',
    kicker: 'Join us',
    title: '招生招聘',
    html: () => `
      <div class="notice">
        <p><span class="notice__tag">急招</span>课题组招聘 <b>3–5 名博士后</b>开展合作研究。面向年龄在 35 岁以下（含）、获得博士学位不超过 3 年，具备较高学术水平和较强科研能力的海内外优秀博士。</p>
        <p><span class="notice__tag notice__tag--soft">常年</span>招收<b>水环境、给排水和水文水资源</b>方向的本科生、硕士、博士后、专职研究人员。欢迎有兴趣的同学和老师加入课题组、开展合作研究。</p>
        <a class="button" href="mailto:${EMAIL}"><span>邮件联系</span><span>${EMAIL}</span></a>
      </div>

      <h3>实验室</h3>
      <div class="gallery">
        <figure><img src="./images/lab-instruments.jpg" alt="团队使用的主要光谱质谱仪器" width="829" height="395" loading="lazy" /><figcaption>主要光谱质谱仪器</figcaption></figure>
        <figure><img src="./images/lab-prep.jpg" alt="样品前处理及光谱检测实验室" width="829" height="466" loading="lazy" /><figcaption>样品前处理及光谱检测实验室</figcaption></figure>
        <figure><img src="./images/lab-ms.jpg" alt="质谱分析检测实验室" width="828" height="621" loading="lazy" /><figcaption>质谱分析检测实验室</figcaption></figure>
      </div>

      <h3>学生去向</h3>
      <ul class="grads">${GRADUATES.map(
        (g) => `<li><span class="grads__who">${esc(g.who)}</span><span class="grads__what">${esc(g.what)}</span><span class="grads__where">${esc(g.where)}</span></li>`,
      ).join('')}</ul>

      <h3>学生荣誉</h3>
      <ul class="plain">${HONORS.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>

      <h3>竞赛指导</h3>
      <ul class="contests">${CONTESTS.map(
        (c) => `<li><span class="contests__when">${esc(c.when)}</span><span class="contests__what">${esc(c.what)}</span><span class="contests__prize">${esc(c.prize)}</span></li>`,
      ).join('')}</ul>
    `,
  },
];
