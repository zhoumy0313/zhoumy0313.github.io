import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { parse } from "yaml";

export const root = process.cwd();
export async function yamlFiles(directory: string): Promise<string[]> {
  return (await readdir(join(root, directory))).filter((name) => name.endsWith(".yaml")).sort().map((name) => join(root, directory, name));
}
export async function readYaml(path: string): Promise<Record<string, unknown>> { return parse(await readFile(path, "utf8")) as Record<string, unknown>; }
export function walk(value: unknown, visit: (value: unknown, key: string) => void, key = "root"): void {
  visit(value, key);
  if (Array.isArray(value)) value.forEach((item, index) => walk(item, visit, `${key}[${index}]`));
  else if (value && typeof value === "object") Object.entries(value).forEach(([childKey, child]) => walk(child, visit, `${key}.${childKey}`));
}
export function fail(message: string): never { throw new Error(message); }
