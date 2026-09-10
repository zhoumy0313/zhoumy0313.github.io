# Mingyang Zhou 个人学术主页整改计划书

## 1. 项目与整改目标

仓库：

`zhoumy0313/zhoumy0313.github.io`

技术栈：

- Astro
- TypeScript
- GitHub Pages
- GitHub Actions
- 当前使用 Astro Content Collections
- 当前内容主要使用 Markdown + YAML Frontmatter
- 当前曾围绕 Pages CMS 设计内容管理结构

本次整改不重新设计网站视觉效果，也不改变网站作为静态 Astro 学术主页的基本定位。

核心目标是：

> 将当前“为 Pages CMS 服务的双语 Markdown 内容体系”改造成“为本地智能体服务的单一事实源内容体系”。

以后网站内容的推荐维护流程应变成：

```text
用户提出内容修改要求
→ 本地智能体读取现有数据
→ 智能体修改统一双语数据
→ 自动执行内容校验
→ Astro check
→ Astro build
→ 检查 diff
→ commit
→ push main
→ GitHub Actions 自动发布
```

Pages CMS 不再作为主要内容维护工具。

---

# 2. 当前架构存在的核心问题

## 2.1 中英文实际上是两套独立数据库

当前目录大致为：

```text
content/
├── site/
│   ├── zh/
│   │   ├── profile.md
│   │   ├── navigation.md
│   │   ├── homepage.md
│   │   ├── education.md
│   │   ├── publications.md
│   │   ├── awards.md
│   │   ├── notes.md
│   │   └── social.md
│   └── en/
│       └── ...
│
└── projects/
    ├── zh/
    │   └── *.md
    └── en/
        └── *.md
```

因此：

- 新增一篇英文项目，并不会自动产生中文项目；
- 修改中文奖项，不会要求同步英文奖项；
- 修改论文状态，不会约束另外一种语言；
- 图片路径、URL、日期等本应共享的信息也被复制；
- 两份数据随着维护次数增加必然发生漂移。

这已经不适合以智能体为主要维护者的新模式。

---

# 3. 新架构的最高原则

以后严格遵守以下原则。

## 原则 A：一个实体只有一个数据源

例如一个教育经历：

```text
UCAS 硕士经历
```

只能存在一条记录。

不能存在：

```text
education.zh
education.en
```

两条互不关联的记录。

---

## 原则 B：共享事实禁止重复

以下内容通常属于共享字段：

- ID
- slug
- 开始时间
- 结束时间
- 年份
- 图片
- URL
- DOI
- GitHub URL
- 视频 URL
- featured
- order
- 作者列表
- 项目资源
- 论文正式标题
- 社交账号地址

这些字段只保存一次。

---

## 原则 C：需要翻译的文字才使用双语属性

统一采用：

```yaml
title:
  zh: 中文
  en: English
```

而不是：

```yaml
zh:
  title: 中文
en:
  title: English
```

优先采用“字段优先、语言次级”的方式。

原因是：

```yaml
title:
  zh: ...
  en: ...
```

可以让中文和英文紧邻。

本地智能体修改 `title.zh` 时，会立即看到 `title.en`，不容易漏改。

---

## 原则 D：禁止语言目录承担实体关系

废弃：

```text
projects/zh/
projects/en/
```

不再通过文件路径判断语言。

语言应该成为实体的一个属性，而不是实体所在的位置。

---

# 4. 推荐的新数据目录

建议将旧的：

```text
content/
```

重构为：

```text
data/
├── site/
│   ├── profile.yaml
│   ├── navigation.yaml
│   ├── homepage.yaml
│   ├── education.yaml
│   ├── publications.yaml
│   ├── awards.yaml
│   ├── notes.yaml
│   └── social.yaml
│
└── projects/
    ├── autonomous-item-handling-robot.yaml
    ├── autonomous-fruit-harvesting-robot.yaml
    └── robomaster-combat-robot.yaml
```

继续使用 Astro Content Collections。

不要因为取消 CMS 就把 Astro Content Collections 一起删除。

Content Collections 本身仍然非常适合：

- schema 校验；
- 类型推断；
- 构建时验证；
- 数据查询；
- 静态页面生成。

需要删除的是“CMS 特化的数据组织方式”，而不是 Astro 的内容数据层。

---

# 5. 为什么推荐 YAML，而不是继续全部使用 Markdown

以后内容维护者主要是智能体，而不是 Pages CMS。

因此 Markdown 不再必须成为所有数据的容器。

推荐：

> YAML 负责结构化数据，Markdown 语法只在确实需要长文本的字段内部使用。

YAML 对当前项目尤其合适，因为：

- 双语对象表达自然；
- 数组自然；
- 图片、URL、日期等字段清晰；
- Git diff 清楚；
- 智能体容易精确编辑某个字段；
- 比 JSON 更适合多行文本；
- 不需要到处写 Markdown Frontmatter；
- Astro Content Loader 可以直接读取 YAML。

例如：

```yaml
id: ucas-master

degree:
  zh: 硕士
  en: Master

school:
  zh: 中国科学院大学
  en: University of Chinese Academy of Sciences

start: 2026-09
end: null

description:
  zh: 中国科学院精密测量科学与技术创新研究院 · 测绘科学与技术
  en: Innovation Academy for Precision Measurement Science and Technology · Surveying and Mapping Science and Technology

image: /images/uploads/education/caslogo.png
```

比维护两个 Markdown 文件可靠很多。

---

# 6. 通用双语类型

在 `src/content.config.ts` 中建立统一类型。

概念上统一定义：

```ts
LocalizedString = {
  zh: string;
  en: string;
}
```

同时可以建立：

```ts
LocalizedStringOptional
LocalizedStringArray
LocalizedMarkdown
```

其中所有用户可见且必须双语展示的内容，都必须要求：

```text
zh 非空
en 非空
```

禁止默认：

```text
英文缺失时回退中文
```

这种设计虽然页面不会空白，但会掩盖内容维护错误。

正确策略应该是：

> 缺少必须存在的翻译时，构建失败。

---

# 7. Profile 数据整改

当前中英文 profile 存储了大量重复事实，例如：

- avatar
- email

这些应该只保留一份。

建议：

```yaml
avatar: /images/uploads/profile/profile.jpg
email: xxx@example.com

name:
  zh: 周明杨
  en: Mingyang Zhou

motto:
  zh: ...
  en: ...

location:
  zh: 中国武汉
  en: Wuhan, China

organization:
  zh: ...
  en: ...

position:
  zh: ...
  en: ...

major:
  zh: 测绘科学与技术
  en: Surveying and Mapping Science and Technology

research:
  - id: robot-localization-navigation
    label:
      zh: 机器人定位导航
      en: Robot Localization and Navigation

  - id: embodied-intelligence
    label:
      zh: 具身智能
      en: Embodied Intelligence

about:
  zh: |
    ...
  en: |
    ...
```

`about` 可以继续允许 Markdown 语法，例如链接。

---

# 8. Navigation 数据整改

不要维护：

```text
navigation.zh
navigation.en
```

改成：

```yaml
items:

  - id: home
    href: /
    label:
      zh: 首页
      en: Home

  - id: publications
    href: /publications/
    label:
      zh: 发表
      en: Publications

  - id: awards
    href: /awards/
    label:
      zh: 获奖
      en: Awards

  - id: projects
    href: /projects/
    label:
      zh: 项目
      en: Projects

  - id: notes
    href: /notes/
    label:
      zh: 笔记
      en: Notes
```

其中：

- href 是共享事实；
- label 才是双语字段。

---

# 9. Homepage 配置整改

当前首页中英文分别存储一套 sections。

这是不必要的。

模块：

```text
About
Education
Publications
Awards
Projects
Notes
```

本身应该只有一份顺序配置。

建议：

```yaml
sections:

  - source: profile

  - source: education

  - source: publications

  - source: awards

  - source: projects
    featuredOnly: true
    limit: 3

  - source: notes
```

模块标题不要再存在这里。

统一在 UI 文案表中维护：

```ts
sectionLabels = {
  profile: {
    zh: "关于我",
    en: "About"
  },

  education: {
    zh: "教育经历",
    en: "Education"
  },

  ...
}
```

这样：

> 页面结构和语言完全解耦。

---

# 10. Education 数据整改

建议每条教育经历必须具有稳定 ID。

例如：

```yaml
- id: ucas-master

  start: 2026-09
  end: null

  degree:
    zh: 硕士
    en: Master's Degree

  school:
    zh: 中国科学院大学
    en: University of Chinese Academy of Sciences

  description:
    zh: ...
    en: ...

  image: /images/uploads/education/caslogo.png
```

不要再把：

```text
2026.09 至今
September 2026 – Present
```

分别存储。

改成：

```yaml
start: 2026-09
end: null
```

由前端根据 locale 格式化。

这样时间永远不可能中英文不一致。

---

# 11. Publications 数据整改

论文是非常典型的“绝大多数字段不需要翻译”的对象。

推荐：

```yaml
- id: low-cost-thermal-infrared-camera-calibration

  title: Low-Cost Thermal-Infrared Camera Calibration Using a Passive Perforated Checkerboard

  year: 2025

  authors:
    - Kaixiang Lu
    - Xueli Guo
    - Mingyang Zhou
    - Kaixin Feng
    - You Li

  venue: ...

  status: published

  image: /images/uploads/publication/lowcostcalibration.jpg

  links:
    - type: paper
      label: IEEE
      url: https://...

```

不要存：

```yaml
status:
  zh: 见刊
  en: Published
```

如果状态是有限枚举，应改成：

```yaml
status: published
```

前端统一翻译：

```text
published

zh → 已发表
en → Published
```

只有真正属于内容本身的自然语言才双语化。

---

# 12. Awards 数据整改

推荐：

```yaml
- id: robomaster-2025

  year: 2025

  title:
    zh: RoboMaster 机甲大师高校联盟赛
    en: RoboMaster University League

  issuer:
    zh: ...
    en: ...

  description:
    zh: 步兵对抗赛国家级一等奖
    en: ...

  image: /images/uploads/award/robomasterlogo.jpeg
```

图片和年份只保存一次。

---

# 13. Notes 数据整改

推荐：

```yaml
- id: navigation-basics

  url: https://...
  image: /images/uploads/note/djiuav.jpg

  title:
    zh: 导航基础学习笔记
    en: Navigation Fundamentals Notes

  summary:
    zh: ...
    en: ...

  tags:
    - inertial-navigation
    - integrated-navigation
```

Tag 推荐使用稳定 key，而不是直接保存显示文字。

例如：

```ts
tagLabels = {
  "inertial-navigation": {
    zh: "惯性导航",
    en: "Inertial Navigation"
  }
}
```

---

# 14. Social 数据整改

社交信息几乎不需要双语数据。

例如：

```yaml
- id: github
  label: GitHub
  type: code
  url: https://github.com/...

- id: orcid
  label: ORCID
  type: orcid
  url: https://orcid.org/...
```

不应存在两份完全相同的：

```text
social.zh
social.en
```

---

# 15. Projects 是本次整改的重点

废弃：

```text
content/projects/zh/*.md
content/projects/en/*.md
```

改成：

```text
data/projects/<slug>.yaml
```

一项研究项目只有一个文件。

例如：

```yaml
id: autonomous-item-handling-robot

slug: autonomous-item-handling-robot

date: 2026-07-20

featured: false
order: 0

title:
  zh: 自主物料搬运机器人
  en: Autonomous Item Handling Robot

summary:
  zh: |
    ...
  en: |
    ...

cover: /images/uploads/project/item-handling-robot/item-handling-robot.jpg

tags:
  - robotics
  - autonomous-navigation

video:
  type: youtube
  id: ERiQQB5y8SE

links: []

body:
  zh: |
    ## 硬件组成

    ...

  en: |
    ## Hardware Components

    ...
```

这样：

> 新建项目时，从数据结构上就不允许出现“只有英文项目，没有中文项目”。

---

# 16. 项目正文处理方案

项目正文仍然可以使用 Markdown 语法，但 Markdown 只是 YAML 中的一个字符串字段：

```yaml
body:
  zh: |
    ## 系统架构

    本系统采用……

  en: |
    ## System Architecture

    The system ...
```

推荐新增统一的：

```text
renderLocalizedMarkdown()
```

工具。

根据 locale 选择：

```text
body.zh
body.en
```

然后在构建阶段转为 HTML。

不要再让项目正文依赖：

```text
文件在哪个语言目录
```

决定语言。

---

# 17. 项目媒体不要再写进正文 HTML

当前项目正文存在大量：

```html
<img ...>
<iframe ...>
```

以及历史遗留的远程 GitHub 图片地址。

建议逐步改成结构化媒体。

例如：

```yaml
gallery:

  - id: arm-elevation
    src: /images/uploads/project/item-handling-robot/arm-elevation.gif

    caption:
      zh: 机械臂升降
      en: Robotic arm elevation

  - id: arm-extension
    src: /images/uploads/project/item-handling-robot/arm-extension.gif

    caption:
      zh: 机械臂伸缩
      en: Robotic arm extension
```

视频：

```yaml
video:
  provider: youtube
  id: ERiQQB5y8SE
```

组件统一负责生成 iframe。

不要在内容数据里直接维护 iframe HTML。

这样可以避免：

- URL 写错；
- Markdown 链接误塞进 `src`；
- HTML 属性错误；
- 中英文媒体配置不同；
- 同一图片路径写两遍。

---

# 18. 清理当前项目内容漂移

迁移时必须专门检查现有三个项目。

目前需要重点处理：

```text
autonomous-item-handling-robot
autonomous-fruit-harvesting-robot
robomaster-combat-robot
```

需要：

1. 建立三个统一项目实体。
2. 保留当前 slug，避免无意义改变 URL。
3. 将现有英文正文作为迁移基础。
4. 为缺失的中文内容生成正式中文版本。
5. 当前中文 item-handling 项目实际上仍为英文，应重新整理。
6. 对中英文项目现有内容进行去重。
7. 统一项目图片。
8. 修复失效媒体路径。
9. 检查正文中所有旧 `assets/images/...`。
10. 检查错误的 raw.githubusercontent.com 地址。
11. 检查 YouTube iframe。
12. 检查引用但仓库实际上不存在的媒体文件。

禁止简单地：

```text
把 en 文件复制进 zh 字段
```

作为最终迁移结果。

---

# 19. Content Schema 重构

当前 `site.items` 使用宽松对象，再由页面运行过程中转换字段。

这次应彻底改成严格 schema。

建立：

```text
localizedStringSchema
profileSchema
navigationSchema
homeSchema
educationSchema
publicationSchema
awardSchema
noteSchema
socialSchema
projectSchema
```

禁止：

```ts
z.looseObject({})
```

承担核心业务数据。

目标：

> 错误数据在 Astro 加载阶段直接报错，而不是到了组件里再猜字段类型。

---

# 20. 页面组件的数据职责重构

## 当前思路

页面调用：

```text
getSiteEntry(id, locale)
```

locale 同时参与：

- 决定读取哪个文件；
- 决定显示哪种语言。

整改后：

```text
locale 只负责显示语言。
```

例如：

```text
getSiteEntry("profile")
```

获得统一实体。

然后：

```text
localize(profile.name, locale)
localize(profile.motto, locale)
```

---

# 21. 建立统一 localize() 方法

增加：

```ts
localize(value, locale)
```

概念：

```ts
function localize<T>(
  value: { zh: T; en: T },
  locale: Locale
): T {
  return value[locale];
}
```

所有组件统一使用。

禁止各组件分别：

```ts
locale === "zh"
  ? ...
  : ...
```

到处自行实现。

---

# 22. 路由整改

URL 保持：

```text
/zh/
/en/

/zh/publications/
/en/publications/

/zh/awards/
/en/awards/

/zh/projects/
/en/projects/

/zh/projects/<slug>/
/en/projects/<slug>/
```

不建议因为数据结构整改改变公开 URL。

---

# 23. 项目详情路由生成方式改变

当前逻辑相当于：

```text
发现 zh 项目文件
→ 生成 zh 页面

发现 en 项目文件
→ 生成 en 页面
```

整改为：

```text
发现一个 project entity
→ 永远生成：

/zh/projects/<slug>/
/en/projects/<slug>/
```

概念：

```ts
projects.flatMap(project =>
  locales.map(locale => ({
    params: {
      lang: locale,
      slug: project.slug
    }
  }))
)
```

这样中英文页面数量从架构层面保证一致。

---

# 24. 改进语言切换器

目前语言切换应同步整改。

目标：

在：

```text
/zh/projects/autonomous-item-handling-robot/
```

点击 English 后进入：

```text
/en/projects/autonomous-item-handling-robot/
```

而不是回：

```text
/en/
```

同样：

```text
/zh/publications/
↔
/en/publications/
```

语言切换器应该只替换 URL 中：

```text
/zh/
```

和：

```text
/en/
```

保留剩余路径。

统一项目实体后，可以保证对应页面一定存在。

---

# 25. CMS 相关内容删除

确认新数据架构正常后，移除：

```text
.pages.yml
docs/pages-cms-guide.md
```

README 中所有以下内容也应删除或重写：

```text
Pages CMS
CMS 登录方式
CMS GitHub App
CMS 表单
CMS 图片上传
中文内容 / English Content 两套后台
```

如果 GitHub 仓库曾安装 Pages CMS GitHub App，可在代码整改完成后由仓库所有者根据需要解除授权。

该操作不是代码任务。

---

# 26. README 重写

README 应改成三个核心部分：

## 本地开发

```bash
npm install
npm run dev
npm run build
```

## 内容维护

说明：

```text
data/site/
data/projects/
public/images/
```

## 推荐智能体工作流

```text
修改 data
→ npm run validate
→ npm run build
→ git diff
→ commit
→ push
```

不要再把 CMS 写成主要维护入口。

---

# 27. 为本地智能体增加 AGENTS.md

根目录新增：

```text
AGENTS.md
```

这是本次整改非常重要的一步。

告诉 Codex / 本地智能体：

## 普通内容修改时

原则上只允许修改：

```text
data/
public/images/
```

不要无理由修改：

```text
src/components/
src/layouts/
src/pages/
```

---

## 新增任何内容条目时

必须同时完成：

```text
共享数据
中文字段
英文字段
```

---

## 用户只提供中文时

允许智能体：

1. 原样维护中文事实；
2. 根据中文生成自然英文；
3. 不得虚构用户没有提供的事实；
4. 专有名词优先使用项目现有标准英文；
5. 链接、年份、作者、DOI 不做翻译。

---

## 用户只要求修改中文措辞时

智能体必须判断：

### 仅风格变化

英文事实未改变：

可不修改英文。

### 实质信息变化

例如：

```text
新增了研究方向
学校变化
发表状态变化
项目功能变化
奖项增加
```

则必须同步英文。

---

# 28. 增加智能体内容维护说明

新增：

```text
docs/CONTENT_MAINTENANCE.md
```

内容不要写成开发教程。

主要告诉智能体：

```text
我想新增论文 → 修改哪里
我获得新奖项 → 修改哪里
我换研究方向 → 修改哪里
我新增项目 → 修改哪里
我修改个人简介 → 修改哪里
我新增 GitBook 笔记 → 修改哪里
```

让智能体能够快速定位数据，而不用每次扫描整个仓库。

---

# 29. 增加内容完整性检查工具

建议新增：

```text
scripts/validate-content.ts
```

或者等价实现。

增加：

```bash
npm run content:check
```

必须至少检查：

### 双语完整性

所有 Required LocalizedString：

```text
zh != empty
en != empty
```

### ID 唯一性

检测：

```text
education.id
publication.id
award.id
note.id
project.id
project.slug
```

### slug 合法性

推荐：

```text
lowercase-kebab-case
```

### 项目路由冲突

不能两个项目拥有相同 slug。

### 本地媒体

如果：

```text
src = /images/...
```

则检查：

```text
public/images/...
```

是否真实存在。

### 必需 URL

验证基本 URL 格式。

### 日期

检查合法格式。

### featured/order

检查合法值。

---

# 30. 媒体文件检查

额外增加：

```text
npm run media:check
```

可以检查：

- 数据引用了不存在的本地图片；
- 项目 gallery 引用了不存在的 GIF；
- 重复媒体路径；
- 明显错误的 Markdown URL；
- 项目正文中的历史 `/assets/...`；
- `[https://...](https://...)` 被错误用于 HTML `src` 的情况。

外部网站是否真正在线不要作为正常 build 的硬要求。

原因是：

> 网络故障不应该导致学术主页无法构建。

外链存活检查可以单独做：

```text
npm run links:check
```

并作为 warning。

---

# 31. package.json 推荐脚本

建议最终形成：

```text
npm run dev
npm run check
npm run content:check
npm run media:check
npm run build
npm run preview
npm run validate
```

其中：

```text
validate
```

至少执行：

```text
content:check
media:check
astro check
astro build
```

本地智能体提交代码前必须执行：

```bash
npm run validate
```

---

# 32. GitHub Actions 保持自动部署

当前：

```text
push main
→ GitHub Actions
→ Astro build
→ GitHub Pages
```

这套流程是合理的，不需要推倒。

只需要保证：

```text
npm run build
```

包含必要的数据校验。

这样即使本地智能体漏掉检查，GitHub Actions 仍是最后一道保险。

---

# 33. 不建议让本地智能体每次直接盲目 push

推荐流程：

```text
1. 修改内容
2. 执行 npm run validate
3. 查看 git diff
4. 确认只修改预期文件
5. commit
6. push
```

对于普通内容维护，不应该每次完整阅读所有组件代码。

整改完成以后：

> 智能体应该能够只读 AGENTS.md + 对应 data 文件，就完成绝大多数主页维护任务。

这才是本次架构整改真正要达到的维护效率。

---

# 34. 图片目录处理原则

第一阶段不要为了“看起来更漂亮”立即大规模重命名：

```text
public/images/uploads/
```

否则会产生大量无意义路径变更。

先保留兼容。

但新增项目建议统一：

```text
public/images/uploads/project/<project-slug>/
```

例如：

```text
public/images/uploads/project/autonomous-item-handling-robot/
```

后续可以单独安排一次 media cleanup，再决定是否将：

```text
uploads
```

改名。

不要把数据架构迁移和全站图片 URL 迁移绑成一个高风险提交。

---

# 35. 删除历史兼容代码

完成迁移以后，检查并删除：

```text
getSiteEntry(id, locale)
```

中依赖：

```text
`${locale}/${id}`
```

的代码。

删除：

```text
project.id.startsWith(`${locale}/`)
```

删除：

```text
project.id.split("/").slice(1)
```

之类因为语言目录产生的路径处理。

新的 project ID 本身就是稳定 ID。

---

# 36. SectionRenderer 同步简化

当前 SectionRenderer 同时：

- 根据 source 查询不同语言文件；
- 转换 loose object；
- 判断组件类型；
- 处理 locale；
- 处理项目过滤。

整改后可以显著简化。

建议职责变成：

```text
读取 section config
→ 查询统一数据
→ localize()
→ 渲染组件
```

或者如果首页结构未来基本稳定，也可以考虑进一步减少过度动态化。

但不要为了这次整改大规模重写视觉组件。

---

# 37. 移除不必要的 MDX 依赖评估

当前项目包含：

```text
@astrojs/mdx
```

整改后检查是否仍存在真正的 `.mdx` 内容。

如果项目详情已经全部改为：

```text
YAML + Markdown string + structured media
```

并且没有其他 MDX 页面：

则可以：

```text
删除 @astrojs/mdx
删除 astro.config.mjs 中 mdx integration
```

如果仍需要 MDX，则保留。

这一项必须以实际迁移结果为准，不要预先强删。

---

# 38. Markdown 字符串渲染

如果项目 `body.zh/en` 使用 Markdown 字符串，可以增加一个非常薄的 Markdown 渲染层。

要求：

- 支持标题；
- 段落；
- 粗体；
- 列表；
- 链接；
- 行内代码；
- 必要的代码块。

图片、视频、gallery 尽量通过结构化字段渲染。

不要鼓励：

```text
iframe
style
script
复杂 HTML
```

直接进入正文。

---

# 39. 页面文案与事实数据分开

建立：

```text
src/i18n/ui.ts
```

只存网站 UI 固定文案。

例如：

```text
Home
Projects
Publications
Awards
Notes
Present
View Project
Paper
Code
Demo
```

用户内容则放：

```text
data/
```

原则：

```text
UI 固定词 → src/i18n
个人事实/研究成果 → data
```

不要混在一起。

---

# 40. 不做自动“英文回退中文”

严格禁止这样的长期设计：

```ts
value.en ?? value.zh
```

否则英文缺失永远不会被发现。

推荐：

开发 / build：

```text
直接报错
```

这样可以真正保证双语完整性。

---

# 41. 可以增加翻译审核状态，但不要强制

如果希望知道哪些英文是智能体直接翻译的，可以可选加入：

```yaml
translation:
  enReviewed: false
```

人工确认后：

```yaml
translation:
  enReviewed: true
```

这只是内部维护元数据。

不要显示在网页上。

如果觉得没有必要，也可以完全不加。

核心完整性不依赖它。

---

# 42. SEO 与页面语言

保持：

```html
<html lang="zh">
<html lang="en">
```

页面 title、description 根据 locale 选择对应内容。

后续建议增加：

```text
canonical
hreflang="zh"
hreflang="en"
x-default
```

例如中英文项目详情互相声明对应关系。

统一项目数据以后，实现 hreflang 会非常简单。

---

# 43. 首页根路径策略

当前：

```text
/
→ /zh/
```

可以继续保持。

暂时不要加入：

```text
浏览器语言自动判断
```

这种额外逻辑。

学术主页保持行为简单、稳定即可。

---

# 44. 迁移顺序

整个整改不要一次性“大爆炸式重写”。

按以下顺序执行。

## Phase 1：建立新 schema

先完成：

```text
LocalizedString
新的 site schema
新的 project schema
```

此时旧数据仍可存在。

---

## Phase 2：建立新 data/

创建：

```text
data/site/
data/projects/
```

开始迁移真实数据。

不要先删除旧 content。

---

## Phase 3：完整迁移 Site 数据

依次迁移：

```text
profile
navigation
homepage
education
publications
awards
notes
social
```

完成中英文合并。

---

## Phase 4：迁移 Projects

处理三个现有项目。

完成：

```text
统一项目实体
双语 title
双语 summary
双语 body
共享 metadata
共享 media
```

同时修复已有项目内容漂移。

---

## Phase 5：重构读取层

改造：

```text
src/lib/content.ts
```

从统一数据读取。

建立：

```text
localize()
getSiteEntry()
getProjects()
getProject()
```

---

## Phase 6：重构页面

依次处理：

```text
BaseLayout
Navigation
ProfileSidebar
SectionRenderer
PublicationList
AwardList
EducationTimeline
CollectionList
ProjectLayout
```

只改数据接口，不进行无关 UI 重设计。

---

## Phase 7：路由重构

保证每个 project：

```text
project × [zh, en]
```

固定生成两套路径。

---

## Phase 8：语言切换改进

实现：

```text
当前页面 zh
↔
相同页面 en
```

---

## Phase 9：建立自动验证

完成：

```text
content:check
media:check
validate
```

---

## Phase 10：确认新架构完全工作

运行：

```bash
npm run validate
npm run dev
```

人工检查至少：

```text
/zh/
/en/

/zh/publications/
/en/publications/

/zh/awards/
/en/awards/

/zh/projects/
/en/projects/

三个项目 × 中英文详情页

/zh/notes/
/en/notes/
```

---

## Phase 11：删除旧体系

只有确认全部正常后才删除：

```text
content/site/zh/
content/site/en/
content/projects/zh/
content/projects/en/
.pages.yml
docs/pages-cms-guide.md
```

---

## Phase 12：文档收尾

更新：

```text
README.md
AGENTS.md
docs/CONTENT_MAINTENANCE.md
```

并检查仓库内：

```text
Pages CMS
content/site/zh
content/site/en
content/projects/zh
content/projects/en
```

是否还有历史代码引用。

---

# 45. 迁移验收标准

整改完成后必须满足全部条件。

## 数据

- [ ] 每个实体只有一条记录
- [ ] 不存在 zh/en 两套实体目录
- [ ] 所有 required bilingual field 均有 zh/en
- [ ] 共享事实没有中英文重复
- [ ] ID 唯一
- [ ] slug 唯一
- [ ] 项目媒体路径有效

## 页面

- [ ] 中文首页正常
- [ ] 英文首页正常
- [ ] 中文发表页正常
- [ ] 英文发表页正常
- [ ] 中文获奖页正常
- [ ] 英文获奖页正常
- [ ] 中文项目数量 = 英文项目数量
- [ ] 每个项目同时存在中英文详情页
- [ ] Notes 正常
- [ ] 语言切换保持当前页面
- [ ] 所有图片正常

## 工程

- [ ] `npm run check` 通过
- [ ] `npm run content:check` 通过
- [ ] `npm run media:check` 通过
- [ ] `npm run build` 通过
- [ ] `npm run validate` 通过
- [ ] GitHub Actions 构建成功
- [ ] GitHub Pages 发布正常

## 清理

- [ ] `.pages.yml` 删除
- [ ] Pages CMS 文档删除
- [ ] README 不再以 CMS 为维护入口
- [ ] 旧 locale-based content loader 删除
- [ ] 旧项目 locale filtering 删除
- [ ] 无失效旧数据路径
- [ ] 无重复 CMS 相关逻辑

---

# 46. 最终期望的数据维护体验

整改后，用户可以直接告诉本地智能体：

```text
我获得了 XXX 比赛全国一等奖，2026 年，
主办方是 XXX，这张图作为 Logo。
```

智能体应该自动：

```text
1. 找到 data/site/awards.yaml
2. 建立唯一 ID
3. 填共享年份
4. 填共享图片
5. 写中文标题/主办方/描述
6. 自动生成对应英文
7. npm run validate
8. 检查 diff
9. commit
10. push
```

再比如：

```text
新增这个项目……
```

智能体只新增：

```text
data/projects/new-project.yaml
```

而不是：

```text
先创建 zh/new-project.md
再创建 en/new-project.md
然后祈祷未来两份不会不同步
```

最终目标不是单纯“减少 Markdown 文件”，而是：

> 把学术主页变成一个拥有严格数据契约的静态网站。  
> 人负责提供事实，智能体负责整理双语数据、校验和发布，网站代码只负责展示。

这应当成为今后整个仓库的维护原则。