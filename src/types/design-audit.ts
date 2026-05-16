export interface CssFileInput {
  path: string;
  content: string;
}

export interface CssTokenOccurrence {
  name: string;
  value: string;
  filePath: string;
}

export interface CssTokenSummary {
  name: string;
  values: string[];
  definedIn: string[];
}

export interface CssFileSummary {
  path: string;
  sizeBytes: number;
  lineCount: number;
  rootBlockCount: number;
  lightModeBlockCount: number;
  importantCount: number;
  tokens: CssTokenOccurrence[];
  varUsages: string[];
  hexColors: string[];
  fontFamilies: string[];
  mediaQueries: string[];
  hasCalculatorPattern: boolean;
  hasFaqPattern: boolean;
  hasChartPattern: boolean;
}

export interface CssAnalysis {
  totalCssFiles: number;
  files: CssFileSummary[];
  tokenSummary: CssTokenSummary[];
  duplicateTokens: CssTokenSummary[];
  usedButNotDefined: string[];
  definedButNotUsed: string[];
  totals: {
    importantCount: number;
    rootBlockCount: number;
    lightModeBlockCount: number;
    hexColorCount: number;
    mediaQueryCount: number;
  };
  detectedPatterns: string[];
}

export interface DesignAuditReportInput {
  projectName: string;
  projectPath: string;
  generatedAt: Date;
  analysis: CssAnalysis;
}

export interface DesignAuditResult {
  projectName: string;
  projectPath: string;
  totalCssFiles: number;
  reportPath: string;
}
