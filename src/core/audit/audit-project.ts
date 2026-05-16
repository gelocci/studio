import path from "node:path";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { scanProject } from "../files/scan-project.js";
import { buildAuditReport } from "../../output/markdown/audit-report.js";
import type { AuditResult, PackageJsonSummary } from "../../types/audit.js";

export interface AuditProjectInput {
  projectPath: string;
  outputRoot: string;
}

export async function auditProject(input: AuditProjectInput): Promise<AuditResult> {
  const projectPath = path.resolve(input.projectPath);
  const projectName = path.basename(projectPath);

  const scan = await scanProject(projectPath);
  const packageJson = await readPackageJson(projectPath);

  const now = new Date();
  const timestamp = now
    .toISOString()
    .replace(/[:.]/g, "-");

  const outputDir = path.join(input.outputRoot, projectName);
  await mkdir(outputDir, { recursive: true });

  const reportPath = path.join(outputDir, `audit-${timestamp}.md`);

  const report = buildAuditReport({
    projectName,
    projectPath,
    generatedAt: now,
    scan,
    packageJson
  });

  await writeFile(reportPath, report, "utf-8");

  return {
    projectName,
    projectPath,
    totalFiles: scan.totalFiles,
    reportPath
  };
}

async function readPackageJson(projectPath: string): Promise<PackageJsonSummary | null> {
  const packagePath = path.join(projectPath, "package.json");

  try {
    const content = await readFile(packagePath, "utf-8");
    const parsed = JSON.parse(content) as {
      name?: string;
      version?: string;
      scripts?: Record<string, string>;
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };

    return {
      name: parsed.name ?? null,
      version: parsed.version ?? null,
      scripts: parsed.scripts ?? {},
      dependencies: parsed.dependencies ?? {},
      devDependencies: parsed.devDependencies ?? {}
    };
  } catch {
    return null;
  }
}
