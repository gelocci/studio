export interface FileGroup {
  name: string;
  files: string[];
}

export interface ProjectScan {
  totalFiles: number;
  files: string[];
  groups: FileGroup[];
  topLevelFolders: string[];
  detectedStack: string[];
}

export interface PackageJsonSummary {
  name: string | null;
  version: string | null;
  scripts: Record<string, string>;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}

export interface AuditReportInput {
  projectName: string;
  projectPath: string;
  generatedAt: Date;
  scan: ProjectScan;
  packageJson: PackageJsonSummary | null;
}

export interface AuditResult {
  projectName: string;
  projectPath: string;
  totalFiles: number;
  reportPath: string;
}
