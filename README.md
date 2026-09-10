# Mingyang Zhou Academic Homepage

基于 Astro、TypeScript 与 Astro Content Collections 的双语静态学术主页。内容采用单一事实源：每个实体只保存一次，只有需要翻译的字段包含严格的 `zh` / `en` 值。

## 本地运行

```bash
npm install
npm run dev
```

```bash
npm run check          # Astro 类型与内容检查
npm run content:check  # 双语字段、ID、slug、日期和 URL 检查
npm run media:check    # 本地媒体及旧错误路径检查
npm run links:check    # 外链可达性检查（仅警告）
npm run build          # 生成静态站点
npm run validate       # 提交前完整验证
npm run preview        # 预览 dist
```

## 目录结构

```text
data/site/       个人资料、导航、首页顺序、教育、论文、奖项、笔记和社交链接
data/projects/   每个项目一个 YAML 文件，文件内同时包含 zh/en 字段
public/images/   站点本地图片、GIF 等静态媒体
src/i18n/        固定 UI 文案
src/             Astro 页面、布局、组件与严格 Content Schema
scripts/         内容、媒体和外链检查
```

具体内容入口和字段规则见 [`docs/CONTENT_MAINTENANCE.md`](docs/CONTENT_MAINTENANCE.md)。面向本地智能体的约束见 [`AGENTS.md`](AGENTS.md)。

推荐日常流程：

```text
修改 data/ 或 public/images/
→ npm run validate
→ git diff
→ commit
→ push main
→ GitHub Actions 自动部署 GitHub Pages
```

## 路由与部署

站点保留 `/zh/`、`/en/` 及两种语言下的 education、publications、awards、projects、notes 路由。每个项目会固定生成中英文详情页，语言切换保留当前资源路径。根路径重定向到 `/zh/`。

`.github/workflows/deploy.yml` 在推送到 `main` 或手动触发时安装依赖、执行 `npm run validate`，然后部署 `dist/` 到 GitHub Pages。
