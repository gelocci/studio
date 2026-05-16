import path from "node:path";
import { copyFile, mkdir, readdir, stat } from "node:fs/promises";

export interface PublishWorkflowInput {
  projectName: string;
  runsRoot: string;
  webPublicRoot: string;
}

export interface PublishWorkflowResult {
  projectName: string;
  sourcePath: string;
  targetPath: string;
}

export async function publishWorkflow(input: PublishWorkflowInput): Promise<PublishWorkflowResult> {
  const projectRunsDir = path.join(input.runsRoot, input.projectName);
  const latestWorkflow = await findLatestWorkflow(projectRunsDir);

  const targetDir = path.join(input.webPublicRoot, "workflows");
  const targetPath = path.join(targetDir, "latest.json");

  await mkdir(targetDir, { recursive: true });
  await copyFile(latestWorkflow, targetPath);

  return {
    projectName: input.projectName,
    sourcePath: latestWorkflow,
    targetPath
  };
}

async function findLatestWorkflow(projectRunsDir: string): Promise<string> {
  let entries: string[];

  try {
    entries = await readdir(projectRunsDir);
  } catch {
    throw new Error(`Nenhuma pasta de execuções encontrada em: ${projectRunsDir}`);
  }

  const workflowFiles = entries.filter((entry) => /^workflow-.*\.json$/i.test(entry));

  if (workflowFiles.length === 0) {
    throw new Error(`Nenhum workflow encontrado em: ${projectRunsDir}`);
  }

  const withStats = await Promise.all(
    workflowFiles.map(async (fileName) => {
      const fullPath = path.join(projectRunsDir, fileName);
      const fileStat = await stat(fullPath);

      return {
        fullPath,
        modifiedTime: fileStat.mtimeMs
      };
    })
  );

  withStats.sort((a, b) => b.modifiedTime - a.modifiedTime);

  return withStats[0].fullPath;
}
