import { basename } from "node:path";
import { fail, readYaml, walk, yamlFiles } from "./content-utils.ts";

const siteFiles = await yamlFiles("data/site"); const projectFiles = await yamlFiles("data/projects");
const expected = new Set(["profile", "navigation", "homepage", "education", "publications", "awards", "notes", "social"].map((id) => `${id}.yaml`));
for (const file of siteFiles) expected.delete(basename(file));
if (expected.size) fail(`Missing site data: ${[...expected].join(", ")}`);

const ids = new Map<string,string>(); const slugs = new Map<string,string>();
function unique(value: unknown, file: string, kind: "id"|"slug") { if (typeof value !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) fail(`${file}: invalid ${kind} ${String(value)}`); const seen=(kind==="id"?ids:slugs).get(value); if(seen) fail(`Duplicate ${kind} ${value}: ${seen}, ${file}`); (kind==="id"?ids:slugs).set(value,file); }
for (const file of [...siteFiles, ...projectFiles]) {
  const data=await readYaml(file);
  walk(data,(value,key)=>{ if(key.endsWith(".zh")||key.endsWith(".en")){if(typeof value!=="string"||!value.trim()) fail(`${file}: empty localized field ${key}`)} if((key.endsWith(".url")||key.endsWith(".URL"))&&typeof value==="string"){try{new URL(value)}catch{fail(`${file}: invalid URL at ${key}`)}} if(key.endsWith(".id")&&!key.endsWith(".video.id")) unique(value,file,"id"); });
  if(projectFiles.includes(file)){ unique(data.slug,file,"slug"); if(data.id!==data.slug) fail(`${file}: project id and slug must match`); if(basename(file,".yaml")!==data.slug) fail(`${file}: filename must match project slug`); if(typeof data.date!=="string"||Number.isNaN(Date.parse(data.date))) fail(`${file}: invalid project date`); if(typeof data.featured!=="boolean"||!Number.isInteger(data.order)) fail(`${file}: featured/order must be boolean/integer`); const body=data.body as Record<string,unknown>; if(!body||typeof body.zh!=="string"||typeof body.en!=="string") fail(`${file}: bilingual project body is required`); if(!/[\u3400-\u9fff]/u.test(body.zh)) fail(`${file}: Chinese project body does not contain Chinese text`); }
}
console.log(`Content check passed: ${siteFiles.length} site files, ${projectFiles.length} projects.`);
