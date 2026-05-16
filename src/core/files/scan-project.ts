import path from "node:path";
import fg from "fast-glob";
import type { ProjectScan, FileGroup } from "../../types/audit.js";

const IGNORE_PATTERNS = [
  "**/.git/**",
  "**/node_modules/**",
  "**/dist/**",
  "**/build/**",
  "**/.next/**",
  "**/out/**",
  "**/.cache/**",
  "**/coverage/**",
  "**/tmp/**",
  "**/temp/**",
  "**/*.log",
  "**/.DS_Store",
  "**/Thumbs.db"
];

export async function scanProject(projectPath: string): Promise<ProjectScan> {
  const entries = await fg(["**/*"], {
    cwd: projectPath,
    onlyFiles: true,
    dot: true,
    ignore: IGNORE_PATTERNS,
    absolute: false
  });

  const normalized = entries
    .map((entry) => entry.replaceAll("\\", "/"))
    .sort((a, b) => a.localeCompare(b));

  const groups = groupFiles(normalized);

  return {
    totalFiles: normalized.length,
    files: normalized,
    groups,
    topLevelFolders: getTopLevelFolders(normalized),
    detectedStack: detectStack(normalized)
  };
}

function groupFiles(files: string[]): FileGroup[] {
  const html = byExtension(files, [".html"]);
  const css = byExtension(files, [".css"]);
  const js = byExtension(files, [".js", ".mjs", ".cjs"]);
  const ts = byExtension(files, [".ts", ".tsx"]);
  const markdown = byExtension(files, [".md"]);
  const json = byExtension(files, [".json"]);
  const images = byExtension(files, [".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif", ".ico"]);
  const configs = files.filter((file) =>
    file.endsWith(".yml") ||
    file.endsWith(".yaml") ||
    file.endsWith(".toml") ||
    file.endsWith(".config.js") ||
    file.endsWith(".config.mjs") ||
    file.endsWith(".config.ts") ||
    file === "netlify.toml" ||
    file === ".gitignore"
  );

  return [
    { name: "HTML", files: html },
    { name: "CSS", files: css },
    { name: "JavaScript", files: js },
    { name: "TypeScript", files: ts },
    { name: "Markdown", files: markdown },
    { name: "JSON", files: json },
    { name: "Imagens", files: images },
    { name: "Configurações", files: configs }
  ];
}

function byExtension(files: string[], extensions: string[]): string[] {
  return files.filter((file) => extensions.includes(path.extname(file).toLowerCase()));
}

function getTopLevelFolders(files: string[]): string[] {
  const folders = new Set<string>();

  for (const file of files) {
    const [first] = file.split("/");
    if (first && first !== file) {
      folders.add(first);
    }
  }

  return Array.from(folders).sort((a, b) => a.localeCompare(b));
}

function detectStack(files: string[]): string[] {
  const stack = new Set<string>();

  if (files.some((file) => file.endsWith(".html"))) stack.add("HTML");
  if (files.some((file) => file.endsWith(".css"))) stack.add("CSS");
  if (files.some((file) => file.endsWith(".js"))) stack.add("JavaScript");
  if (files.includes("package.json")) stack.add("Node.js");
  if (files.includes("netlify.toml")) stack.add("Netlify");
  if (files.some((file) => file.includes("cloudflare"))) stack.add("Cloudflare");
  if (files.some((file) => file.toLowerCase().includes("chart"))) stack.add("Gráficos/Charts");

  return Array.from(stack);
}
