# Pages CMS 使用说明

这份文档说明本项目如何使用 Pages CMS 维护网站内容，以及 `.pages.yml` 和 `content/` 文件之间的对应关系。

## 核心结论

Pages CMS 不是数据库，也不是新的内容存储位置。它是一个可视化 GitHub 文件编辑器。

当前流程是：

```text
在 Pages CMS 后台编辑
-> Pages CMS 修改 GitHub 仓库里的 Markdown 文件
-> GitHub 产生 commit
-> GitHub Actions 自动构建 Astro
-> GitHub Pages 发布新网页
```

所以 `content/` 目录必须保留。Astro 构建时仍然从 `content/` 读取内容。

## 关键文件

```text
.pages.yml
```

定义 Pages CMS 后台显示哪些表单、每个表单对应哪个文件、每个字段对应 Markdown frontmatter 里的哪个字段。

```text
content/site/zh/*.md
content/site/en/*.md
content/projects/zh/*.md
content/projects/en/*.md
```

保存网站的真实内容。

```text
public/images/uploads/
```

Pages CMS 默认图片上传目录。发布后引用路径是 `/images/uploads/filename.jpg`。

## 字段映射规则

`.pages.yml` 中最重要的是这几个键：

```yaml
path: content/site/zh/profile.md
fields:
  - name: name
    label: 姓名
    type: string
```

含义是：

- `path` 决定这个表单保存到哪个文件。
- `fields[].name` 决定写入 frontmatter 的哪个字段。
- `fields[].label` 决定 Pages CMS 后台显示的字段名称。
- `fields[].type` 决定后台使用什么编辑控件。

例如 Pages CMS 中的“姓名”字段保存后会写入：

```md
---
name: "周明杨"
---
```

## 内容分组

`.pages.yml` 目前配置了两个顶层分组：

```text
中文内容
English Content
```

每个分组下都有这些编辑入口：

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

## 文件与表单对应关系

中文内容：

```text
个人信息与 About -> content/site/zh/profile.md
导航栏 -> content/site/zh/navigation.md
首页模块 -> content/site/zh/homepage.md
教育经历 -> content/site/zh/education.md
发表内容 -> content/site/zh/publications.md
获奖经历 -> content/site/zh/awards.md
学习笔记外链 -> content/site/zh/notes.md
社交链接 -> content/site/zh/social.md
研究项目 -> content/projects/zh/*.md
```

英文内容：

```text
Profile and About -> content/site/en/profile.md
Navigation -> content/site/en/navigation.md
Homepage Sections -> content/site/en/homepage.md
Education -> content/site/en/education.md
Publications -> content/site/en/publications.md
Awards -> content/site/en/awards.md
Study Note Links -> content/site/en/notes.md
Social Links -> content/site/en/social.md
Projects -> content/projects/en/*.md
```

## 常见字段类型

当前 `.pages.yml` 主要使用这些类型：

```yaml
type: string
```

单行文本。适合姓名、链接、图片 URL、学校名称等。

```yaml
type: text
```

多行纯文本。适合摘要、描述、作者列表等。

```yaml
type: rich-text
```

富文本 Markdown 编辑器。适合 About 正文和项目详情正文。

```yaml
type: number
```

数字。适合年份、排序权重。

```yaml
type: date
```

日期。适合项目日期。

```yaml
type: boolean
```

开关。适合 `featured`。

```yaml
type: select
```

下拉选择。适合限制可选值，例如项目链接类型。

```yaml
type: object
list: true
```

对象数组。适合教育条目、发表条目、获奖条目、项目链接等可增删的列表。

## 日常内容怎么改

### 修改个人信息

在 Pages CMS 打开：

```text
中文内容 -> 个人信息与 About
English Content -> Profile and About
```

对应文件：

```text
content/site/zh/profile.md
content/site/en/profile.md
```

可以修改姓名、头像、座右铭、单位、专业、邮箱、研究方向和 About 正文。

### 修改首页模块顺序

在 Pages CMS 打开：

```text
中文内容 -> 首页模块
English Content -> Homepage Sections
```

对应文件：

```text
content/site/zh/homepage.md
content/site/en/homepage.md
```

每个首页模块包含：

```text
渲染类型 type
模块标题 title
数据来源 source
筛选条件 filter
显示数量上限 limit
```

如果项目模块设置：

```yaml
filter:
  featured: true
```

首页只显示 `featured: true` 的项目。项目总页仍显示全部项目。

### 新增教育经历

在 Pages CMS 打开：

```text
中文内容 -> 教育经历
English Content -> Education
```

新增一个教育条目即可。需要填写：

```text
degree
school
period
description
image
```

### 新增发表内容

在 Pages CMS 打开：

```text
中文内容 -> 发表内容
English Content -> Publications
```

新增一个发表条目即可。`links` 是卡片底部的按钮列表，例如 PDF、代码仓库、论文页面。

### 新增获奖经历

在 Pages CMS 打开：

```text
中文内容 -> 获奖经历
English Content -> Awards
```

新增一个获奖条目即可。获奖卡片只展示内容，不跳转。

### 新增笔记入口

在 Pages CMS 打开：

```text
中文内容 -> 学习笔记外链
English Content -> Study Note Links
```

每个笔记条目都需要一个 `url`。这个 URL 可以指向 GitBook 的某个 Space 或某篇公开笔记。

### 新增项目

在 Pages CMS 打开：

```text
中文内容 -> 研究项目
English Content -> Projects
```

项目是 collection，可以新增 Markdown 文件。

建议中英文项目使用相同文件名：

```text
content/projects/zh/robot-navigation.md
content/projects/en/robot-navigation.md
```

这样中英文项目详情页 slug 保持一致。

## 图片怎么处理

当前图片字段使用普通字符串，兼容两种写法：

```text
https://res.cloudinary.com/.../image.jpg
/images/uploads/example.jpg
```

如果使用 Cloudinary 或其他图床，直接粘贴完整 URL。

如果使用 Pages CMS 上传图片：

1. 在 Pages CMS 的媒体库上传图片。
2. 图片会保存到 `public/images/uploads/`。
3. 在图片字段中填写发布路径，例如：

```text
/images/uploads/example.jpg
```

当前没有把图片字段设置为 `type: image`，原因是项目里已有大量 Cloudinary 外链。使用 `type: string` 对外链更稳定。

## 什么时候需要改 `.pages.yml`

只修改内容时，不需要改 `.pages.yml`。

需要改 `.pages.yml` 的情况：

- 想在 Pages CMS 后台新增一个可编辑字段。
- 想修改后台字段显示名称。
- 想新增一种内容类型。
- 想改变图片上传目录。
- 想把字段控件从文本框改成下拉框、开关、富文本等。

## 新增字段的完整流程

如果只是让 CMS 后台多显示一个字段，但网页不显示它，只改 `.pages.yml` 和内容文件即可。

如果要让网页也展示这个字段，需要三步：

1. 在 `content/.../*.md` 中增加字段。
2. 在 `.pages.yml` 中增加同名字段。
3. 在 Astro 组件或读取逻辑中渲染这个字段。

例如要给个人信息新增手机号：

```yaml
phone: "123456789"
```

`.pages.yml` 里增加：

```yaml
- name: phone
  label: 电话
  type: string
```

然后还需要在侧边栏组件中读取并展示 `phone`，否则网站页面不会显示。

## 修改后台显示名称

如果只想把后台字段名从“单位”改成“所在机构”，只改 `label`：

```yaml
- name: organization
  label: 所在机构
  type: string
```

不要改 `name`。`name` 是真实数据字段名，改错会导致原字段不再被 Pages CMS 正确读取。

## 修改字段类型

字段类型要和内容实际格式匹配。

例如：

```yaml
featured: true
```

对应：

```yaml
type: boolean
```

例如：

```yaml
tags:
  - ROS2
  - Navigation
```

对应：

```yaml
type: string
list: true
```

例如：

```yaml
links:
  - label: "代码仓库"
    url: "https://github.com/example/navigation"
```

对应：

```yaml
type: object
list: true
fields:
  - name: label
    type: string
  - name: url
    type: string
```

## 保存后网页没有更新怎么办

检查顺序：

1. Pages CMS 是否成功保存。
2. GitHub 仓库是否出现新的 commit。
3. GitHub Actions 的 `Deploy to GitHub Pages` 是否运行成功。
4. 如果 Actions 失败，打开失败日志查看是哪个 Markdown 字段格式不对。
5. 如果 Actions 成功但网页没变，等待 GitHub Pages 缓存刷新，或强制刷新浏览器。

## 不建议做的事

- 不要再把 GitBook 同步到 `content/site/` 或 `content/projects/`。
- 不要随意改 `.pages.yml` 中的 `name`。
- 不要删除 `content/` 目录。
- 不要删除 `.pages.yml`。
- 不要把仓库内图片路径写成 `public/images/...`。

仓库内图片在内容中应写成：

```text
/images/uploads/example.jpg
```

而不是：

```text
public/images/uploads/example.jpg
```
