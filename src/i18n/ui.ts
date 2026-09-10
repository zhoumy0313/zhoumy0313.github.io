import type { Locale } from "@lib/paths";
export const ui = {
  section: { profile: { zh: "关于我", en: "About" }, education: { zh: "教育经历", en: "Education" }, publications: { zh: "发表内容", en: "Publications" }, awards: { zh: "获奖经历", en: "Awards" }, projects: { zh: "研究项目", en: "Research Projects" }, notes: { zh: "学习笔记", en: "Study Notes" } },
  profile: { location: { zh: "地址", en: "Location" }, institution: { zh: "单位", en: "Institution" }, specialty: { zh: "专业", en: "Specialty" }, email: { zh: "邮箱", en: "Email" }, research: { zh: "研究方向", en: "Research" }, social: { zh: "社交链接", en: "Social" } },
  status: { published: { zh: "已发表", en: "Published" }, preprint: { zh: "预印本", en: "Preprint" }, accepted: { zh: "已接收", en: "Accepted" }, "in-press": { zh: "待刊", en: "In press" } },
  linkType: { code: { zh: "代码", en: "Code" }, paper: { zh: "论文", en: "Paper" }, demo: { zh: "演示", en: "Demo" }, video: { zh: "视频", en: "Video" }, external: { zh: "外部链接", en: "External" } },
  tag: { robotics: { zh: "机器人", en: "Robotics" }, "autonomous-navigation": { zh: "自主导航", en: "Autonomous Navigation" }, manipulation: { zh: "机器人操作", en: "Manipulation" }, "agricultural-robotics": { zh: "农业机器人", en: "Agricultural Robotics" }, "computer-vision": { zh: "计算机视觉", en: "Computer Vision" }, "mechanical-design": { zh: "机械设计", en: "Mechanical Design" }, "embedded-systems": { zh: "嵌入式系统", en: "Embedded Systems" }, lesson: { zh: "课程", en: "Lesson" }, notes: { zh: "笔记", en: "Notes" }, "inertial-navigation": { zh: "惯性导航", en: "Inertial Navigation" }, "integrated-navigation": { zh: "组合导航", en: "Integrated Navigation" } },
  present: { zh: "至今", en: "Present" },
} as const;
export function sectionLabel(source: keyof typeof ui.section, locale: Locale): string { return ui.section[source][locale]; }
export function statusLabel(status: keyof typeof ui.status, locale: Locale): string { return ui.status[status][locale]; }
export function linkTypeLabel(type: keyof typeof ui.linkType, locale: Locale): string { return ui.linkType[type][locale]; }
export function tagLabel(tag: keyof typeof ui.tag, locale: Locale): string { return ui.tag[tag][locale]; }
