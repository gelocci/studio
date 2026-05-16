import path from "node:path";
import { existsSync } from "node:fs";
import { auditProject } from "../core/audit/audit-project.js";
import { auditDesign } from "../core/design/audit-design.js";
import { runAgents } from "../core/workflow/run-agents.js";

function printHelp(): void {
  console.log(`
Gelocci Studio CLI

Uso:
  npm run studio -- audit <caminho-do-projeto>
  npm run studio -- design-audit <caminho-do-projeto>
  npm run studio -- run-agents <caminho-do-projeto>

Exemplos:
  npm run studio -- audit C:\\Users\\geloc\\projetos\\www
  npm run studio -- design-audit C:\\Users\\geloc\\projetos\\www
  npm run studio -- run-agents C:\\Users\\geloc\\projetos\\www

Comandos:
  audit         Analisa um projeto local e gera relatório estrutural em Markdown.
  design-audit Analisa CSS, tokens, temas e padrões visuais do projeto.
  run-agents   Gera uma execução inicial de agentes em JSON a partir dos achados.
`);
}

async function main(): Promise<void> {
  const [, , command, ...args] = process.argv;

  if (!command || command === "--help" || command === "-h") {
    printHelp();
    return;
  }

  if (command !== "audit" && command !== "design-audit" && command !== "run-agents") {
    console.error(`Comando desconhecido: ${command}`);
    printHelp();
    process.exitCode = 1;
    return;
  }

  const projectPathArg = args[0];

  if (!projectPathArg) {
    console.error("Informe o caminho do projeto a ser analisado.");
    printHelp();
    process.exitCode = 1;
    return;
  }

  const projectPath = path.resolve(projectPathArg);

  if (!existsSync(projectPath)) {
    console.error(`Caminho não encontrado: ${projectPath}`);
    process.exitCode = 1;
    return;
  }

  if (command === "audit") {
    const result = await auditProject({
      projectPath,
      outputRoot: path.resolve("reports")
    });

    console.log("");
    console.log("Auditoria concluída.");
    console.log(`Projeto: ${result.projectName}`);
    console.log(`Arquivos analisados: ${result.totalFiles}`);
    console.log(`Relatório: ${result.reportPath}`);
    return;
  }

  if (command === "design-audit") {
    const result = await auditDesign({
      projectPath,
      outputRoot: path.resolve("reports")
    });

    console.log("");
    console.log("Auditoria visual concluída.");
    console.log(`Projeto: ${result.projectName}`);
    console.log(`Arquivos CSS analisados: ${result.totalCssFiles}`);
    console.log(`Relatório: ${result.reportPath}`);
    return;
  }

  const result = await runAgents({
    projectPath,
    outputRoot: path.resolve("runs")
  });

  console.log("");
  console.log("Execução de agentes gerada.");
  console.log(`Projeto: ${result.projectName}`);
  console.log(`Achados: ${result.findingsCount}`);
  console.log(`Agentes: ${result.agentsCount}`);
  console.log(`Workflow: ${result.workflowPath}`);
}

main().catch((error: unknown) => {
  console.error("Erro inesperado ao executar o Gelocci Studio:");
  console.error(error);
  process.exitCode = 1;
});
