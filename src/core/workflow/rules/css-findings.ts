import type { CssAnalysis } from "../../../types/design-audit.js";
import type { Finding } from "../../../types/workflow-run.js";

export function buildFindingsFromCssAnalysis(analysis: CssAnalysis): Finding[] {
  const findings: Finding[] = [];

  if (analysis.totalCssFiles === 0) {
    findings.push({
      id: "css-no-files",
      type: "CSS_NOT_FOUND",
      severity: "HIGH",
      title: "Nenhum arquivo CSS encontrado",
      summary: "O auditor visual não encontrou arquivos CSS no projeto.",
      affectedFiles: [],
      recommendedAgents: ["arquiteto", "ux-ui"],
      autonomyLevel: 2
    });

    return findings;
  }

  if (analysis.duplicateTokens.length > 0) {
    findings.push({
      id: "css-duplicate-tokens",
      type: "CSS_DUPLICATE_TOKENS",
      severity: "MEDIUM",
      title: "Tokens CSS duplicados encontrados",
      summary: `${analysis.duplicateTokens.length} token(s) CSS foram definidos em mais de um arquivo. Isso pode ser intencional, mas precisa de revisão para evitar divergência entre temas e páginas.`,
      affectedFiles: uniqueFiles(analysis.duplicateTokens.flatMap((token) => token.definedIn)),
      recommendedAgents: ["arquiteto", "ux-ui", "revisor"],
      autonomyLevel: 2
    });
  }

  if (analysis.usedButNotDefined.length > 0) {
    findings.push({
      id: "css-used-token-not-defined",
      type: "CSS_USED_TOKEN_NOT_DEFINED",
      severity: "HIGH",
      title: "Tokens usados mas não definidos",
      summary: `${analysis.usedButNotDefined.length} token(s) foram usados com var(), mas não foram encontrados nas definições analisadas.`,
      affectedFiles: [],
      recommendedAgents: ["arquiteto", "desenvolvedor", "qa"],
      autonomyLevel: 3
    });
  }

  if (analysis.totals.importantCount > 0) {
    findings.push({
      id: "css-important-usage",
      type: "CSS_IMPORTANT_USAGE",
      severity: analysis.totals.importantCount > 10 ? "MEDIUM" : "LOW",
      title: "Uso de !important identificado",
      summary: `Foram encontrados ${analysis.totals.importantCount} uso(s) de !important. Isso pode indicar dívida de especificidade ou tentativa de padronização forçada.`,
      affectedFiles: analysis.files
        .filter((file) => file.importantCount > 0)
        .map((file) => file.path),
      recommendedAgents: ["arquiteto", "ux-ui", "revisor"],
      autonomyLevel: 2
    });
  }

  if (analysis.totals.hexColorCount > 25) {
    findings.push({
      id: "css-many-hex-colors",
      type: "CSS_MANY_DIRECT_HEX_COLORS",
      severity: "LOW",
      title: "Muitas cores hexadecimais diretas",
      summary: `Foram encontradas ${analysis.totals.hexColorCount} ocorrências de cores hexadecimais. Avaliar se parte delas deveria usar tokens CSS.`,
      affectedFiles: analysis.files
        .filter((file) => file.hexColors.length > 0)
        .map((file) => file.path),
      recommendedAgents: ["ux-ui", "arquiteto"],
      autonomyLevel: 1
    });
  }

  if (analysis.totals.lightModeBlockCount === 0) {
    findings.push({
      id: "css-no-light-mode",
      type: "CSS_LIGHT_MODE_NOT_FOUND",
      severity: "MEDIUM",
      title: "Tema claro não identificado",
      summary: "Nenhum bloco de tema claro foi identificado. Se o projeto exige alternância de tema, isso precisa ser revisado.",
      affectedFiles: analysis.files.map((file) => file.path),
      recommendedAgents: ["ux-ui", "qa"],
      autonomyLevel: 2
    });
  }

  if (analysis.detectedPatterns.includes("tokens ou padrões de gráficos encontrados")) {
    findings.push({
      id: "css-chart-patterns",
      type: "CSS_CHART_PATTERNS_FOUND",
      severity: "LOW",
      title: "Padrões de gráficos encontrados",
      summary: "Foram identificados tokens ou padrões de gráficos. Eles devem ser validados nos temas claro e escuro.",
      affectedFiles: analysis.files
        .filter((file) => file.hasChartPattern)
        .map((file) => file.path),
      recommendedAgents: ["ux-ui", "qa"],
      autonomyLevel: 1
    });
  }

  if (findings.length === 0) {
    findings.push({
      id: "css-no-critical-finding",
      type: "NO_CRITICAL_FINDING",
      severity: "LOW",
      title: "Nenhum achado crítico identificado",
      summary: "A análise visual/CSS não identificou achados automáticos relevantes nesta rodada.",
      affectedFiles: [],
      recommendedAgents: ["studio-lead"],
      autonomyLevel: 1
    });
  }

  return findings;
}

function uniqueFiles(files: string[]): string[] {
  return Array.from(new Set(files)).sort((a, b) => a.localeCompare(b));
}
