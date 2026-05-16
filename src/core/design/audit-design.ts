import path from "node:path";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import fg from "fast-glob";
import { analyzeCssFiles } from "./css-analyzer.js";
import { buildDesignAuditReport } from "../../output/markdown/design-audit-report.js";
import type { DesignAuditResult } from "../../types/design-audit.js";

export interface AuditDesignInput {
  projectPath: string;
  outputRoot: string;
}

const CSS_IGNORE_PATTERNS = [
  "**/.git/**",
  "**/node_modules/**",
  "**/dist/**",
  "**/build/**",
  "**/.next/**",
  "**/out/**",
  "**/.cache/**",
  "**/coverage/**",
  "**/tmp/**",
  "**/temp/**"
];

export async function auditDesign(input: AuditDesignInput): Promise<DesignAuditResult> {
  const projectPath = path.resolve(input.projectPath);
  const projectName = path.basename(projectPath);

  const cssPaths = await fg(["**/*.css"], {
    cwd: projectPath,
    onlyFiles: true,
    dot: true,
    ignore: CSS_IGNORE_PATTERNS,
    absolute: false
  });

  const cssFiles = await Promise.all(
    cssPaths
      .map((filePath) => filePath.replaceAll("\\", "/"))
      .sort((a, b) => a.localeCompare(b))
      .map(async (relativePath) => {
        const absolutePath = path.join(projectPath, relativePath);
        const content = await readFile(absolutePath, "utf-8");

        return {
          path: relativePath,
          content
        };
      })
  );

  const analysis = analyzeCssFiles(cssFiles);

  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, "-");

  const outputDir = path.join(input.outputRoot, projectName);
  await mkdir(outputDir, { recursive: true });

  const reportPath = path.join(outputDir, `design-audit-${timestamp}.md`);

  const report = buildDesignAuditReport({
    projectName,
    projectPath,
    generatedAt: now,
    analysis
  });

  await writeFile(reportPath, report, "utf-8");

  return {
    projectName,
    projectPath,
    totalCssFiles: cssFiles.length,
    reportPath
  };
}
