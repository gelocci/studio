import path from "node:path";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import fg from "fast-glob";
import { analyzeCssFiles } from "../design/css-analyzer.js";
import { buildFindingsFromCssAnalysis } from "./rules/css-findings.js";
import { buildWorkflowFromFindings } from "./workflow-builder.js";
import type { RunAgentsResult } from "../../types/workflow-run.js";

export interface RunAgentsInput {
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

export async function runAgents(input: RunAgentsInput): Promise<RunAgentsResult> {
  const projectPath = path.resolve(input.projectPath);
  const projectName = path.basename(projectPath);

  const cssFiles = await readCssFiles(projectPath);
  const cssAnalysis = analyzeCssFiles(cssFiles);
  const findings = buildFindingsFromCssAnalysis(cssAnalysis);
  const now = new Date();

  const workflow = buildWorkflowFromFindings({
    projectName,
    projectPath,
    generatedAt: now,
    findings
  });

  const timestamp = now.toISOString().replace(/[:.]/g, "-");
  const outputDir = path.join(input.outputRoot, projectName);

  await mkdir(outputDir, { recursive: true });

  const workflowPath = path.join(outputDir, `workflow-${timestamp}.json`);

  await writeFile(workflowPath, `${JSON.stringify(workflow, null, 2)}\n`, "utf-8");

  return {
    projectName,
    projectPath,
    findingsCount: findings.length,
    agentsCount: workflow.nodes.length,
    workflowPath
  };
}

async function readCssFiles(projectPath: string): Promise<Array<{ path: string; content: string }>> {
  const cssPaths = await fg(["**/*.css"], {
    cwd: projectPath,
    onlyFiles: true,
    dot: true,
    ignore: CSS_IGNORE_PATTERNS,
    absolute: false
  });

  return Promise.all(
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
}
