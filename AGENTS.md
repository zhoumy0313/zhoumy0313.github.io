# Agent Maintenance Rules

## Scope

- 普通内容修改优先只编辑 `data/` 和 `public/images/`。
- 不要无理由修改 `src/components/`、`src/layouts/` 或 `src/pages/`。
- `data/` 是唯一内容事实源。不要建立按语言拆分的目录或重复实体。

## Adding or editing content

- 新实体必须一次性填写共享字段以及所有必填 `zh`、`en` 字段。
- 日期、年份、URL、作者、媒体路径、`featured`、`order`、ID 和 slug 等共享事实只保存一次。
- 用户只提供中文时，可以基于中文自然地生成英文，但不得虚构事实。
- 用户只调整中文文风且事实不变时，可以不改英文；事实发生变化时必须同步英文。
- 新项目只创建 `data/projects/<slug>.yaml` 一个文件，保持 `id`、`slug` 和文件名一致。
- Markdown 仅用于 `about`、项目 `body.zh` 与 `body.en` 等长文本字段；不要在正文中加入 `iframe`、`style`、`script` 或 HTML 图片。
- 本地媒体放在 `public/images/`，数据中使用 `/images/...` 路径；项目视频使用结构化 provider/id。

## Before committing

```bash
npm run validate
git diff
```

确认没有缺失翻译、无效本地媒体、旧 `/assets/...` 路径、重复 ID/slug、临时迁移代码或无关视觉改动后再提交。
