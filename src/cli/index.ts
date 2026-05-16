import path from "node:path";
import { existsSync } from "node:fs";
import { auditProject } from "../core/audit/audit-project.js";

function printHelp(): void {
  console.log(`
Gelocci Studio CLI

Uso:
  npm run studio -- audit <caminho-do-projeto>

Exemplo:
  npm run studio -- audit C:\\Users\\geloc\\projetos\\www

Comandos:
  audit   Analisa um projeto local e gera relatório em Markdown.
`);
}

async function main(): Promise<void> {
  const [, , command, ...args] = process.argv;

  if (!command || command === "--help" || command === "-h") {
    printHelp();
    return;
  }

  if (command !== "audit") {
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

  const result = await auditProject({
    projectPath,
    outputRoot: path.resolve("reports")
  });

  console.log("");
  console.log("Auditoria concluída.");
  console.log(`Projeto: ${result.projectName}`);
  console.log(`Arquivos analisados: ${result.totalFiles}`);
  console.log(`Relatório: ${result.reportPath}`);
}

main().catch((error: unknown) => {
  console.error("Erro inesperado ao executar o Gelocci Studio:");
  console.error(error);
  process.exitCode = 1;
});
