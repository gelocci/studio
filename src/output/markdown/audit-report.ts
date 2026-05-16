import type { AuditReportInput, FileGroup } from "../../types/audit.js";

export function buildAuditReport(input: AuditReportInput): string {
  const lines: string[] = [];

  lines.push(`# Relatório de Auditoria — ${input.projectName}`);
  lines.push("");
  lines.push(`Gerado em: ${input.generatedAt.toLocaleString("pt-BR")}`);
  lines.push("");
  lines.push("## 1. Resumo");
  lines.push("");
  lines.push(`- Projeto: \`${input.projectName}\``);
  lines.push(`- Caminho: \`${input.projectPath}\``);
  lines.push(`- Total de arquivos analisados: ${input.scan.totalFiles}`);
  lines.push(`- Stack detectada: ${formatList(input.scan.detectedStack)}`);
  lines.push("");
  lines.push("## 2. Pastas principais");
  lines.push("");

  if (input.scan.topLevelFolders.length === 0) {
    lines.push("Nenhuma pasta principal identificada.");
  } else {
    for (const folder of input.scan.topLevelFolders) {
      lines.push(`- \`${folder}/\``);
    }
  }

  lines.push("");
  lines.push("## 3. Distribuição de arquivos");
  lines.push("");
  lines.push("| Grupo | Quantidade |");
  lines.push("|---|---:|");

  for (const group of input.scan.groups) {
    lines.push(`| ${group.name} | ${group.files.length} |`);
  }

  lines.push("");
  lines.push("## 4. Package.json");
  lines.push("");

  if (!input.packageJson) {
    lines.push("Nenhum `package.json` encontrado na raiz do projeto.");
  } else {
    lines.push(`- Nome: ${input.packageJson.name ?? "não informado"}`);
    lines.push(`- Versão: ${input.packageJson.version ?? "não informada"}`);
    lines.push("");
    lines.push("### Scripts");
    lines.push("");

    const scripts = Object.entries(input.packageJson.scripts);

    if (scripts.length === 0) {
      lines.push("Nenhum script definido.");
    } else {
      for (const [name, script] of scripts) {
        lines.push(`- \`${name}\`: \`${script}\``);
      }
    }

    lines.push("");
    lines.push("### Dependências");
    lines.push("");
    lines.push(`- dependencies: ${Object.keys(input.packageJson.dependencies).length}`);
    lines.push(`- devDependencies: ${Object.keys(input.packageJson.devDependencies).length}`);
  }

  lines.push("");
  lines.push("## 5. Arquivos por grupo");
  lines.push("");

  for (const group of input.scan.groups) {
    appendGroup(lines, group);
  }

  lines.push("");
  lines.push("## 6. Primeiras observações automáticas");
  lines.push("");
  lines.push("- Este relatório ainda não usa LLM.");
  lines.push("- A análise atual é estrutural e baseada em arquivos.");
  lines.push("- A próxima evolução será gerar recomendações com agentes.");
  lines.push("- O foco inicial é mapear o projeto e criar uma base para auditorias futuras.");
  lines.push("");
  lines.push("## 7. Próximos passos sugeridos");
  lines.push("");
  lines.push("1. Revisar se a árvore detectada representa bem o projeto.");
  lines.push("2. Confirmar quais arquivos devem ser ignorados em auditorias futuras.");
  lines.push("3. Adicionar análise de conteúdo HTML/CSS/JS.");
  lines.push("4. Adicionar recomendações por agente.");
  lines.push("5. Integrar LLM via API externa em uma fase posterior.");
  lines.push("");

  return lines.join("\n");
}

function appendGroup(lines: string[], group: FileGroup): void {
  lines.push(`### ${group.name}`);
  lines.push("");

  if (group.files.length === 0) {
    lines.push("Nenhum arquivo identificado.");
    lines.push("");
    return;
  }

  const maxItems = 80;
  const visible = group.files.slice(0, maxItems);

  for (const file of visible) {
    lines.push(`- \`${file}\``);
  }

  if (group.files.length > maxItems) {
    lines.push(`- ... mais ${group.files.length - maxItems} arquivo(s)`);
  }

  lines.push("");
}

function formatList(values: string[]): string {
  if (values.length === 0) {
    return "não identificada";
  }

  return values.join(", ");
}
