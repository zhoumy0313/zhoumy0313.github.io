import { access } from "node:fs/promises";
import { join } from "node:path";
import { fail, readYaml, root, walk, yamlFiles } from "./content-utils.ts";
const files=[...await yamlFiles("data/site"),...await yamlFiles("data/projects")]; const refs=new Map<string,string[]>();
for(const file of files){const data=await readYaml(file); walk(data,(value,key)=>{if(typeof value!=="string")return;if(value.includes("/assets/")||/<(?:img|iframe)\b/i.test(value)||/src\s*=\s*["'][^"']*\[[^"']*/i.test(value)) fail(`${file}: legacy or malformed media reference at ${key}`);if(value.startsWith("/images/")){const uses=refs.get(value)??[];uses.push(file);refs.set(value,uses)}})}
for(const [ref,uses] of refs){try{await access(join(root,"public",ref))}catch{fail(`Missing local media ${ref}, referenced by ${uses.join(", ")}`)}}
console.log(`Media check passed: ${refs.size} unique local assets.`);
