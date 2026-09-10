import { readYaml, walk, yamlFiles } from "./content-utils.ts";
const files=[...await yamlFiles("data/site"),...await yamlFiles("data/projects")]; const urls=new Set<string>();
for(const file of files){walk(await readYaml(file),(value,key)=>{if((key.endsWith(".url")||key.endsWith(".URL"))&&typeof value==="string")urls.add(value)})}
for(const url of urls){try{const response=await fetch(url,{method:"HEAD",redirect:"follow",signal:AbortSignal.timeout(8000)});if(!response.ok)console.warn(`WARN ${response.status}: ${url}`)}catch(error){console.warn(`WARN ${url}: ${error instanceof Error?error.message:String(error)}`)}}
console.log(`External link check completed with warnings only: ${urls.size} URLs.`);
