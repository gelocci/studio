import type {
  CssAnalysis,
  CssFileInput,
  CssFileSummary,
  CssTokenOccurrence,
  CssTokenSummary
} from "../../types/design-audit.js";

const ROOT_PATTERN = /:root\s*\{([\s\S]*?)\}/g;
const LIGHT_MODE_PATTERN = /(html\.light-mode|html\[data-theme=["']light["']\]|:root\.light-mode)\s*\{/g;
const IMPORTANT_PATTERN = /!important/g;
const TOKEN_PATTERN = /--([a-zA-Z0-9-_]+)\s*:\s*([^;]+);/g;
const VAR_USAGE_PATTERN = /var\(\s*(--[a-zA-Z0-9-_]+)\s*\)/g;
const HEX_PATTERN = /#[0-9a-fA-F]{3,8}\b/g;
const FONT_FAMILY_PATTERN = /font-family\s*:\s*([^;]+);/g;
const MEDIA_PATTERN = /@media\s*([^\{]+)\{/g;

export function analyzeCssFiles(files: CssFileInput[]): CssAnalysis {
  const summaries = files.map(analyzeSingleFile);
  const tokenOccurrences = summaries.flatMap((summary) => summary.tokens);
  const tokenSummary = summarizeTokens(tokenOccurrences);
  const duplicateTokens = tokenSummary.filter((token) => token.definedIn.length > 1);
  const allVarUsages = uniqueSorted(summaries.flatMap((summary) => summary.varUsages));
  const definedTokenNames = new Set(tokenSummary.map((token) => token.name));
  const usedButNotDefined = allVarUsages.filter((token) => !definedTokenNames.has(token));
  const definedButNotUsed = tokenSummary
    .map((token) => token.name)
    .filter((token) => !allVarUsages.includes(token));

  return {
    totalCssFiles: files.length,
    files: summaries,
    tokenSummary,
    duplicateTokens,
    usedButNotDefined,
    definedButNotUsed,
    totals: {
      importantCount: summaries.reduce((sum, item) => sum + item.importantCount, 0),
      rootBlockCount: summaries.reduce((sum, item) => sum + item.rootBlockCount, 0),
      lightModeBlockCount: summaries.reduce((sum, item) => sum + item.lightModeBlockCount, 0),
      hexColorCount: summaries.reduce((sum, item) => sum + item.hexColors.length, 0),
      mediaQueryCount: summaries.reduce((sum, item) => sum + item.mediaQueries.length, 0)
    },
    detectedPatterns: detectPatterns(summaries)
  };
}

function analyzeSingleFile(file: CssFileInput): CssFileSummary {
  const tokens = extractTokens(file.path, file.content);
  const varUsages = extractMatches(file.content, VAR_USAGE_PATTERN).map((match) => match[1]);
  const hexColors = uniqueSorted(extractMatches(file.content, HEX_PATTERN).map((match) => match[0]));
  const fontFamilies = uniqueSorted(
    extractMatches(file.content, FONT_FAMILY_PATTERN).map((match) => normalizeCssValue(match[1]))
  );
  const mediaQueries = uniqueSorted(
    extractMatches(file.content, MEDIA_PATTERN).map((match) => normalizeCssValue(match[1]))
  );

  return {
    path: file.path,
    sizeBytes: Buffer.byteLength(file.content, "utf-8"),
    lineCount: countLines(file.content),
    rootBlockCount: countMatches(file.content, ROOT_PATTERN),
    lightModeBlockCount: countMatches(file.content, LIGHT_MODE_PATTERN),
    importantCount: countMatches(file.content, IMPORTANT_PATTERN),
    tokens,
    varUsages: uniqueSorted(varUsages),
    hexColors,
    fontFamilies,
    mediaQueries,
    hasCalculatorPattern: file.content.includes("calculator") || file.path.includes("calculadora"),
    hasFaqPattern: file.content.includes("faq") || file.path.includes("faq"),
    hasChartPattern: file.content.includes("chart") || file.path.includes("chart") || file.content.includes("--chart-")
  };
}

function extractTokens(filePath: string, content: string): CssTokenOccurrence[] {
  const occurrences: CssTokenOccurrence[] = [];
  const matches = extractMatches(content, TOKEN_PATTERN);

  for (const match of matches) {
    occurrences.push({
      name: `--${match[1]}`,
      value: normalizeCssValue(match[2]),
      filePath
    });
  }

  return occurrences;
}

function summarizeTokens(occurrences: CssTokenOccurrence[]): CssTokenSummary[] {
  const map = new Map<string, CssTokenSummary>();

  for (const occurrence of occurrences) {
    const existing = map.get(occurrence.name);

    if (!existing) {
      map.set(occurrence.name, {
        name: occurrence.name,
        values: [occurrence.value],
        definedIn: [occurrence.filePath]
      });
      continue;
    }

    if (!existing.values.includes(occurrence.value)) {
      existing.values.push(occurrence.value);
    }

    if (!existing.definedIn.includes(occurrence.filePath)) {
      existing.definedIn.push(occurrence.filePath);
    }
  }

  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
}

function detectPatterns(files: CssFileSummary[]): string[] {
  const patterns: string[] = [];

  if (files.some((file) => file.path.includes("base.css"))) {
    patterns.push("base.css encontrado");
  }

  if (files.some((file) => file.path.includes("theme.css"))) {
    patterns.push("theme.css encontrado");
  }

  if (files.some((file) => file.hasCalculatorPattern)) {
    patterns.push("padrões de calculadora encontrados");
  }

  if (files.some((file) => file.hasFaqPattern)) {
    patterns.push("padrões de FAQ encontrados");
  }

  if (files.some((file) => file.hasChartPattern)) {
    patterns.push("tokens ou padrões de gráficos encontrados");
  }

  if (files.some((file) => file.lightModeBlockCount > 0)) {
    patterns.push("tema claro identificado");
  }

  if (files.some((file) => file.fontFamilies.some((font) => font.toLowerCase().includes("playfair")))) {
    patterns.push("Playfair Display identificado");
  }

  if (files.some((file) => file.fontFamilies.some((font) => font.toLowerCase().includes("outfit")))) {
    patterns.push("Outfit identificado");
  }

  return patterns;
}

function extractMatches(content: string, pattern: RegExp): RegExpMatchArray[] {
  pattern.lastIndex = 0;
  return Array.from(content.matchAll(pattern));
}

function countMatches(content: string, pattern: RegExp): number {
  pattern.lastIndex = 0;
  return Array.from(content.matchAll(pattern)).length;
}

function countLines(content: string): number {
  if (content.length === 0) {
    return 0;
  }

  return content.split(/\r?\n/).length;
}

function normalizeCssValue(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}
