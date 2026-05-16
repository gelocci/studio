import type {
  CssFileSummary,
  CssTokenSummary,
  DesignAuditReportInput
} from "../../types/design-audit.js";

export function buildDesignAuditReport(input: DesignAuditReportInput): string {
  const { analysis } = input;
  const lines: string[] = [];

  lines.push(`# Relatório de Auditoria Visual/CSS — ${input.projectName}`);
  lines.push("");
  lines.push(`Gerado em: ${input.generatedAt.toLocaleString("pt-BR")}`);
  lines.push("");
  lines.push("## 1. Resumo");
  lines.push("");
  lines.push(`- Projeto: \`${input.projectName}\``);
  lines.push(`- Caminho: \`${input.projectPath}\``);
  lines.push(`- Arquivos CSS analisados: ${analysis.totalCssFiles}`);
  lines.push(`- Blocos \`:root\`: ${analysis.totals.rootBlockCount}`);
  lines.push(`- Blocos de tema claro: ${analysis.totals.lightModeBlockCount}`);
  lines.push(`- Usos de \`!important\`: ${analysis.totals.importantCount}`);
  lines.push(`- Ocorrências de cores hexadecimais: ${analysis.totals.hexColorCount}`);
  lines.push(`- Media queries: ${analysis.totals.mediaQueryCount}`);
  lines.push("");
  lines.push("## 2. Padrões detectados");
  lines.push("");

  if (analysis.detectedPatterns.length === 0) {
    lines.push("Nenhum padrão visual específico detectado automaticamente.");
  } else {
    for (const pattern of analysis.detectedPatterns) {
      lines.push(`- ${pattern}`);
    }
  }

  lines.push("");
  lines.push("## 3. Arquivos CSS");
  lines.push("");
  lines.push("| Arquivo | Linhas | Tamanho | :root | Light mode | !important | Tokens | var() | Hex | Media queries |");
  lines.push("|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|");

  for (const file of analysis.files) {
    lines.push(
      `| \`${file.path}\` | ${file.lineCount} | ${file.sizeBytes} | ${file.rootBlockCount} | ${file.lightModeBlockCount} | ${file.importantCount} | ${file.tokens.length} | ${file.varUsages.length} | ${file.hexColors.length} | ${file.mediaQueries.length} |`
    );
  }

  lines.push("");
  lines.push("## 4. Tokens CSS");
  lines.push("");
  appendTokenTable(lines, analysis.tokenSummary);

  lines.push("");
  lines.push("## 5. Tokens duplicados");
  lines.push("");

  if (analysis.duplicateTokens.length === 0) {
    lines.push("Nenhum token duplicado identificado.");
  } else {
    lines.push("Tokens definidos em mais de um arquivo:");
    lines.push("");
    appendTokenTable(lines, analysis.duplicateTokens);
  }

  lines.push("");
  lines.push("## 6. Tokens usados mas não definidos");
  lines.push("");

  if (analysis.usedButNotDefined.length === 0) {
    lines.push("Nenhum token usado sem definição foi identificado.");
  } else {
    for (const token of analysis.usedButNotDefined) {
      lines.push(`- \`${token}\``);
    }
  }

  lines.push("");
  lines.push("## 7. Tokens definidos mas não usados");
  lines.push("");

  if (analysis.definedButNotUsed.length === 0) {
    lines.push("Nenhum token definido sem uso foi identificado.");
  } else {
    for (const token of analysis.definedButNotUsed) {
      lines.push(`- \`${token}\``);
    }
  }

  lines.push("");
  lines.push("## 8. Fontes detectadas");
  lines.push("");
  appendFileList(lines, analysis.files, (file) => file.fontFamilies, "Nenhuma declaração de fonte identificada.");

  lines.push("");
  lines.push("## 9. Cores hexadecimais por arquivo");
  lines.push("");
  appendFileList(lines, analysis.files, (file) => file.hexColors, "Nenhuma cor hexadecimal identificada.");

  lines.push("");
  lines.push("## 10. Media queries por arquivo");
  lines.push("");
  appendFileList(lines, analysis.files, (file) => file.mediaQueries, "Nenhuma media query identificada.");

  lines.push("");
  lines.push("## 11. Primeiras observações automáticas");
  lines.push("");
  lines.push("- Este relatório ainda não usa LLM.");
  lines.push("- Tokens duplicados podem ser intencionais, especialmente para tema claro ou compatibilidade.");
  lines.push("- Muitos usos de `!important` podem indicar dívida de especificidade.");
  lines.push("- Cores hexadecimais diretas devem ser avaliadas: quando houver token equivalente, preferir `var(--token)`.");
  lines.push("- Arquivos com tema claro devem ser testados junto com gráficos, cards, FAQs e formulários.");
  lines.push("");
  lines.push("## 12. Próximos passos sugeridos");
  lines.push("");
  lines.push("1. Revisar tokens duplicados e decidir quais são canônicos.");
  lines.push("2. Confirmar se `base.css` e `theme.css` concentram os tokens principais.");
  lines.push("3. Avaliar usos de `!important`.");
  lines.push("4. Validar consistência de tema claro nas ferramentas.");
  lines.push("5. Evoluir este relatório para recomendações dos agentes UX/UI, Arquiteto e QA.");
  lines.push("");

  return lines.join("\n");
}

function appendTokenTable(lines: string[], tokens: CssTokenSummary[]): void {
  if (tokens.length === 0) {
    lines.push("Nenhum token CSS identificado.");
    return;
  }

  lines.push("| Token | Valores | Definido em |");
  lines.push("|---|---|---|");

  for (const token of tokens) {
    lines.push(
      `| \`${token.name}\` | ${token.values.map((value) => `\`${escapePipe(value)}\``).join("<br>")} | ${token.definedIn.map((file) => `\`${file}\``).join("<br>")} |`
    );
  }
}

function appendFileList(
  lines: string[],
  files: CssFileSummary[],
  selector: (file: CssFileSummary) => string[],
  emptyMessage: string
): void {
  let hasAny = false;

  for (const file of files) {
    const values = selector(file);

    if (values.length === 0) {
      continue;
    }

    hasAny = true;
    lines.push(`### \`${file.path}\``);
    lines.push("");

    for (const value of values) {
      lines.push(`- \`${value}\``);
    }

    lines.push("");
  }

  if (!hasAny) {
    lines.push(emptyMessage);
  }
}

function escapePipe(value: string): string {
  return value.replaceAll("|", "\\|");
}
