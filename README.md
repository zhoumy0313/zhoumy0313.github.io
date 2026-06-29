# Personal Academic Site

一个基于 Astro 的个人学术主页。站点代码负责页面结构、样式和构建；可编辑内容全部放在 `content/` 目录，并通过 Pages CMS 可视化维护。

## 本地运行

安装依赖：

```bash
npm install
```

启动开发服务器：

```bash
npm run dev
```

构建前检查：

```bash
npm run check
```

生产构建：

```bash
npm run build
```

预览生产构建：

```bash
npm run preview
```

## 部署到 GitHub Pages

仓库已包含 GitHub Actions 部署文件：

```text
.github/workflows/deploy.yml
```

它会在以下情况自动部署：

- push 到 `main` 分支
- Pages CMS 保存内容并 commit 到 GitHub
- 在 GitHub Actions 页面手动点击 `Run workflow`

当前远端仓库是用户主页仓库：

```text
zhoumy0313/zhoumy0313.github.io
```

因此发布地址为：

```text
https://zhoumy0313.github.io/
```

### GitHub 网页端设置步骤

1. 打开 GitHub 仓库页面。
2. 进入 `Settings`。
3. 左侧进入 `Pages`。
4. 在 `Build and deployment` 区域找到 `Source`。
5. 将 `Source` 设置为 `GitHub Actions`。
6. 回到仓库的 `Actions` 页面。
7. 选择 `Deploy to GitHub Pages` workflow。
8. 点击 `Run workflow` 手动运行一次，或直接 push 到 `main` 触发部署。

部署成功后，Actions 运行记录里会显示最终访问地址。

### 用户主页仓库与项目仓库的区别

如果仓库名是：

```text
用户名.github.io
```

站点发布在根路径：

```text
https://用户名.github.io/
```

如果以后改成普通项目仓库，例如：

```text
personal-academic-site
```

站点会发布在：

```text
https://用户名.github.io/personal-academic-site/
```

workflow 会自动识别这两种情况，不需要手动修改 `astro.config.mjs`。

## 内容维护方式

主页内容使用 Pages CMS 维护，独立笔记站点继续使用 GitBook。不要再把 GitBook Space 直接同步到本仓库的 `content/site/` 或 `content/projects/`，否则 Pages CMS 和 GitBook 会同时写同一批文件，容易产生冲突。

Pages CMS 配置文件位于：

```text
.pages.yml
```

详细的 `.pages.yml` 字段映射和日常维护说明见：

```text
docs/pages-cms-guide.md
```

Pages CMS 会提供表单式编辑界面，直接读写这些内容：

```text
content/site/
content/projects/
public/
```

日常维护时只改 Pages CMS 后台暴露出的内容字段，不需要改 `src/` 代码。

推荐流程：

```text
在 Pages CMS 修改主页内容
-> Pages CMS commit 到 GitHub main 分支
-> GitHub Actions 自动构建
-> GitHub Pages 自动更新网站
```

笔记站点的推荐流程：

```text
在 GitBook 维护独立笔记站点
-> 获得每个笔记或 Space 的公开链接
-> 在 Pages CMS 的 notes 配置里添加外链条目
-> 主页 Notes 页面跳转到 GitBook
```

### Pages CMS 使用步骤

1. 打开 `https://app.pagescms.org`。
2. 使用 GitHub 账号登录。
3. 安装 Pages CMS GitHub App，并授权访问 `zhoumy0313.github.io` 仓库。
4. 在 Pages CMS 中选择该仓库和 `main` 分支。
5. Pages CMS 会自动读取 `.pages.yml`。
6. 在后台编辑中文内容、英文内容、研究项目和图片资源。
7. 点击保存后，Pages CMS 会向 GitHub 提交 commit。
8. GitHub Actions 会自动部署新版本。

### Pages CMS 中的内容分组

后台会显示两个主要分组：

```text
中文内容
English Content
```

每个分组中包含：

```text
个人信息与 About / Profile and About
导航栏 / Navigation
首页模块 / Homepage Sections
教育经历 / Education
发表内容 / Publications
获奖经历 / Awards
学习笔记外链 / Study Note Links
社交链接 / Social Links
研究项目 / Projects
```

### 图片维护

当前内容支持两种图片写法：

```text
https://res.cloudinary.com/.../image.jpg
/images/uploads/example.jpg
```

如果图片已经放在 Cloudinary、GitHub 图床或其他 CDN，直接在图片字段中填写完整 URL。

如果希望把图片上传到本仓库，可以在 Pages CMS 的媒体库上传。默认上传目录是：

```text
public/images/uploads/
```

发布后的引用路径是：

```text
/images/uploads/filename.jpg
```

## 当前内容结构

```text
.pages.yml
content/
  site/
    zh/
      profile.md
      navigation.md
      homepage.md
      education.md
      publications.md
      awards.md
      notes.md
      social.md
    en/
      profile.md
      navigation.md
      homepage.md
      education.md
      publications.md
      awards.md
      notes.md
      social.md
  projects/
    zh/
      *.md
    en/
      *.md
public/
  images/
    uploads/
```

`zh` 是中文内容，`en` 是英文内容。中英文页面结构一致，但文字内容分别维护。

## 页面与 URL

站点使用双语路径：

```text
/zh/
/zh/education/
/zh/publications/
/zh/awards/
/zh/projects/
/zh/projects/project-slug/
/zh/notes/

/en/
/en/education/
/en/publications/
/en/awards/
/en/projects/
/en/projects/project-slug/
/en/notes/
```

根路径 `/` 会自动跳转到 `/zh/`。

## 可编辑文件说明

### `profile.md`

控制侧边栏个人信息和首页 About 文本。

常用字段：

```yaml
name: "周明杨"
avatar: "https://example.com/avatar.jpg"
motto: "厚积薄发，继往开来。"
location: "中国武汉"
organization: "中国科学院精密测量院"
position: "中国科学院大学硕士"
title: "测绘科学与技术"
research:
  - 机器人定位导航
  - 具身智能
email: "zhoumy0313@gmail.com"
```

frontmatter 下方的正文会渲染为 About 内容。

### `navigation.md`

控制顶部导航栏。

```yaml
items:
  - label: "首页"
    href: "/"
  - label: "发表"
    href: "/publications/"
  - label: "获奖"
    href: "/awards/"
  - label: "项目"
    href: "/projects/"
  - label: "笔记"
    href: "/notes/"
```

这里的 `href` 写不带语言前缀的路径即可，程序会自动生成 `/zh/...` 或 `/en/...`。

### `homepage.md`

控制首页展示哪些模块、模块顺序、标题和筛选规则。

示例：

```yaml
sections:
  - type: markdown
    title: 关于我
    source: profile
  - type: timeline
    title: 教育经历
    source: education
  - type: collection-list
    title: 发表内容
    source: publications
  - type: collection-list
    title: 研究项目
    source: projects
    filter:
      featured: true
    limit: 3
```

首页项目列表如果配置了：

```yaml
filter:
  featured: true
```

则首页只显示项目 Markdown 中 `featured: true` 的项目。`/projects/` 项目页不受这个筛选影响，会显示全部项目。

如果希望首页显示全部项目，删除 `filter` 即可。

### `education.md`

控制教育经历列表。

```yaml
items:
  - degree: "硕士"
    school: "中国科学院大学"
    period: "2026.09 至今"
    description: "中国科学院精密测量科学与技术创新研究院 - 测绘科学与技术专业"
    image: "https://example.com/cas-logo.png"
```

`image` 可使用外链，也可以使用 `public/` 下的资源路径，例如 `/images/cas-logo.png`。

### `publications.md`

控制发表内容列表。卡片本身不会跳转；如果配置 `links`，会在卡片底部显示链接按钮。

```yaml
items:
  - title: "Paper Title"
    venue: "IEEE Conference"
    date: 2025
    authors: "Author A, Author B"
    status: "Published"
    image: "https://example.com/paper-cover.jpg"
    links:
      - title: "PDF"
        url: "https://example.com/paper.pdf"
      - title: "Code"
        url: "https://github.com/example/repo"
```

如果不需要链接按钮，可以删除 `links` 或设置为空数组。

### `awards.md`

控制获奖经历列表。卡片只展示信息，不跳转。

```yaml
items:
  - title: "RoboMaster机甲大师高校联盟赛"
    issuer: "中国大学生机器人大赛组委会"
    date: 2025
    description: "步兵对抗赛国家级一等奖"
    image: "https://example.com/award.jpg"
```

### `notes.md`

控制笔记列表。每个笔记条目都是外链。

```yaml
items:
  - title: "导航基础学习笔记"
    summary: "惯性导航、组合导航等导航基础知识学习笔记。"
    image: "https://example.com/note-cover.jpg"
    url: "https://example.gitbook.io/research-reading"
    tags:
      - notes
      - navigation
```

### `social.md`

控制侧边栏社交链接。

```yaml
items:
  - label: "GitHub"
    url: "https://github.com/zhoumy0313"
  - label: "Email"
    url: "mailto:zhoumy0313@gmail.com"
```

## Project Markdown

只有项目有独立详情页。项目文件放在：

```text
content/projects/zh/
content/projects/en/
```

项目文件使用 `.md`，不要使用 `.mdx`，这样更适合 Pages CMS 和普通 Markdown 工具编辑。

示例：

```md
---
title: "Autonomous Robot Navigation System"
summary: "An indoor navigation project covering mapping, localization, path planning, and system integration."
date: 2026-03-01
tags:
  - ROS2
  - Navigation
  - Robotics
cover: "/images/project-default.svg"
video: "https://example.com/navigation-demo.mp4"
links:
  - label: "Repository"
    url: "https://github.com/example/navigation"
    type: "code"
featured: true
order: 10
---

Project detail content goes here.
```

字段说明：

- `title`: 项目标题，必填。
- `summary`: 项目摘要，必填。
- `date`: 项目日期，必填。
- `tags`: 标签，可为空。
- `cover`: 项目封面图，可使用外链或 `/images/...`。
- `video`: 演示视频地址，可选。
- `links`: 项目相关链接，可选。
- `featured`: 是否在首页 featured 项目列表展示。
- `order`: 排序权重，数字越小越靠前。

中英文项目建议使用相同文件名，例如：

```text
content/projects/zh/robot-navigation.md
content/projects/en/robot-navigation.md
```

这样中英文项目详情页路径会保持一致。

## 图片资源约定

图片可以使用两种方式：

1. 使用外部 CDN 或图床 URL：

```yaml
image: "https://example.com/image.jpg"
```

2. 使用仓库内 `public/images/` 的资源：

```yaml
image: "/images/example.jpg"
```

`public/` 中的资源会原样发布到站点根路径。

## 代码目录说明

日常内容维护通常不需要修改这些目录：

```text
src/components/   页面组件
src/layouts/      页面布局
src/lib/          内容读取、路径处理、校验逻辑
src/pages/        Astro 路由页面
src/styles/       全局样式
```

如果只是改个人信息、教育经历、发表内容、获奖经历、项目、笔记和社交链接，只改 `content/` 即可。

## 常见问题

### 项目页面有两个项目，但首页只显示一个项目？

这是因为首页 `homepage.md` 中的项目模块可能配置了：

```yaml
filter:
  featured: true
```

这表示首页只展示 `featured: true` 的项目。项目总页 `/projects/` 会展示所有项目。

解决方式：

- 想让某个项目出现在首页：在对应项目 Markdown 里设置 `featured: true`。
- 想让首页显示全部项目：删除 `homepage.md` 里的 `filter` 配置。

### 修改 Pages CMS 后网页没有立刻更新？

检查三处：

1. Pages CMS 是否已经成功 commit 到 GitHub。
2. GitHub 仓库 `Actions` 页面中 `Deploy to GitHub Pages` 是否运行成功。
3. GitHub 仓库 `Settings -> Pages` 是否已经设置为 `GitHub Actions`。

### GitBook 还需要连接这个仓库吗？

不建议。GitBook 更适合维护独立笔记站点，不适合直接编辑这个仓库里大量 frontmatter 配置。主页内容用 Pages CMS，笔记正文用 GitBook，主页 Notes 页面只保存 GitBook 外链。

### GitHub Pages 打开后图片或链接 404？

优先检查图片路径。

仓库内图片应放在 `public/images/`，内容中引用为：

```yaml
image: "/images/filename.jpg"
```

不要写成：

```yaml
image: "public/images/filename.jpg"
```
