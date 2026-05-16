# Gerador de Workflow dos Agentes — Gelocci Studio

## 1. Objetivo

O gerador de workflow dos agentes transforma achados técnicos em uma execução estruturada de agentes.

Ele é o primeiro passo para sair de relatórios estáticos e avançar para agentes lendo achados, tomando decisões e alimentando a interface visual.

---

## 2. Comando

```powershell
npm run studio -- run-agents C:\Users\geloc\projetos\www
```

---

## 3. Saída

O comando gera um JSON em:

```text
runs/<projeto>/workflow-<timestamp>.json
```

Exemplo:

```text
runs/www/workflow-2026-05-16T12-00-00-000Z.json
```

---

## 4. O que esta versão faz

A primeira versão:

- lê os arquivos CSS do projeto;
- executa a análise visual/CSS;
- transforma achados em findings estruturados;
- seleciona agentes recomendados;
- calcula risco;
- cria nós de agentes;
- cria arestas do fluxo;
- define status iniciais;
- salva um workflow em JSON.

---

## 5. O que esta versão ainda não faz

Esta versão ainda não:

- usa LLM;
- altera arquivos;
- cria branch;
- cria PR;
- lê o JSON pela interface visual;
- executa agentes com prompts reais;
- faz revisão semântica profunda.

Esses recursos virão em blocos seguintes.

---

## 6. Estratégia

O relatório Markdown deixa de ser a saída principal.

A saída mais importante passa a ser o workflow estruturado:

```text
achados
  ↓
agentes convocados
  ↓
decisões
  ↓
status
  ↓
nível de autonomia
  ↓
workflow visual
```

---

## 7. Próximos passos

Próximas evoluções:

1. fazer a interface visual carregar um arquivo JSON de workflow;
2. conectar o `run-agents` ao cockpit;
3. criar decisões reais por agente;
4. adicionar LLM nos pareceres;
5. criar plano de implementação;
6. criar branch;
7. abrir PR.
