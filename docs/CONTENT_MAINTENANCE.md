# 内容维护入口

## 按任务定位

| 任务 | 文件 |
| --- | --- |
| 修改个人简介、研究方向、邮箱 | `data/site/profile.yaml` |
| 修改导航 | `data/site/navigation.yaml` |
| 调整首页 section 顺序或精选项目数量 | `data/site/homepage.yaml` |
| 新增或修改教育经历 | `data/site/education.yaml` |
| 新增论文 | `data/site/publications.yaml` |
| 新增奖项 | `data/site/awards.yaml` |
| 新增学习笔记外链 | `data/site/notes.yaml` |
| 修改社交链接 | `data/site/social.yaml` |
| 新增项目 | `data/projects/<slug>.yaml` |

## 字段规则

共享事实只写一次，包括 `id`、`slug`、日期、年份、作者、URL、图片、视频、tag key、`featured` 与 `order`。真正需要翻译的文字采用字段优先结构：

```yaml
title:
  zh: 中文标题
  en: English title
```

必填双语字段的 `zh` 和 `en` 都必须存在且非空，不提供运行时 fallback。教育时间使用 `YYYY-MM` 的 `start` / `end`，`end: null` 表示至今。论文状态使用 `published`、`preprint`、`accepted` 或 `in-press`，显示文字由 `src/i18n/ui.ts` 翻译。

每个项目只对应一个 `data/projects/<slug>.yaml`，正文保存在 `body.zh` 和 `body.en`。页面会自动生成 `/zh/projects/<slug>/` 与 `/en/projects/<slug>/`。

## 图片、GIF 与视频

- 本地媒体放到 `public/images/` 下适合的子目录。
- 数据路径写作 `/images/...`，不要使用旧 `/assets/...`、仓库 raw URL 或正文 HTML `<img>`。
- 项目图集使用 `gallery`，每项包含共享 `src` 和双语 `caption`。
- 视频使用 `video.provider` 与 `video.id`，由组件生成播放器。
- 外链可用 `npm run links:check` 检查；网络失败只产生警告，不阻断构建。

## 提交前

```bash
npm run validate
git diff
```

`validate` 会依次执行内容检查、媒体检查、Astro 检查和生产构建。
