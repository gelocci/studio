# Auditor Local — Gelocci Studio

## 1. Objetivo

O auditor local é a primeira funcionalidade operacional do Gelocci Studio.

Ele analisa um projeto local, identifica sua estrutura e gera um relatório em Markdown.

A primeira versão não usa LLM. Ela apenas mapeia arquivos, stack e estrutura do projeto.

---

## 2. Comando inicial

```powershell
npm run studio -- audit C:\Users\geloc\projetos\www
```

Ou:

```powershell
npm run audit -- C:\Users\geloc\projetos\www
```

---

## 3. Saída

O relatório será criado em:

```text
reports/<nome-do-projeto>/audit-<timestamp>.md
```

Exemplo:

```text
reports/www/audit-2026-05-15T20-30-00-000Z.md
```

---

## 4. O que o auditor faz

A primeira versão:

- lê a árvore do projeto;
- ignora `.git`, `node_modules`, `dist`, `build`, `.next`, `out`, logs e temporários;
- identifica arquivos HTML, CSS, JavaScript, TypeScript, Markdown, JSON, imagens e configurações;
- detecta stack básica;
- lê `package.json`, quando existir;
- gera relatório em Markdown.

---

## 5. O que o auditor ainda não faz

Esta versão ainda não:

- usa LLM;
- entende qualidade de código;
- valida SEO;
- valida fórmulas;
- executa build;
- cria recomendações por agente;
- altera arquivos;
- cria branches ou commits.

Esses recursos virão em fases futuras.

---

## 6. Próximas evoluções

Próximas melhorias planejadas:

1. analisar conteúdo HTML;
2. analisar CSS e tokens;
3. identificar páginas principais;
4. gerar recomendações por agente;
5. integrar LLM;
6. gerar backlog em Markdown/JSON;
7. criar implementação assistida.
