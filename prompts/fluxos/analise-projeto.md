# Fluxo — Análise de Projeto

## 1. Objetivo

Este fluxo serve para analisar um projeto do ecossistema Gelocci e gerar diagnóstico técnico, de produto, SEO, UX/UI, segurança e roadmap.

É o fluxo base para o futuro comando:

```text
studio audit <projeto>
```

---

## 2. Quando usar

Use este fluxo quando o Gerson quiser:

- avaliar um repositório;
- revisar a estrutura de um projeto;
- identificar melhorias;
- gerar backlog;
- avaliar qualidade geral;
- preparar uma nova frente de evolução.

Exemplos:

```text
Analisar o www
Analisar o Hub de Ferramentas
Analisar o Asset Allocation
Avaliar o estado atual do projeto
Gerar diagnóstico do repositório
```

---

## 3. Agentes participantes

Agentes obrigatórios:

- Orquestrador Gelocci;
- Arquiteto Gelocci;
- Produto Gelocci;
- UX/UI Gelocci;
- SEO Gelocci;
- Segurança Gelocci;
- QA Gelocci;
- Studio Lead.

Agentes condicionais:

- Financeiro Gelocci, quando houver ferramentas, cálculos ou conteúdo financeiro;
- DevOps Gelocci, quando houver build, deploy ou pipeline;
- Desenvolvedor Gelocci, quando for necessário estimar implementação;
- Revisor Gelocci, quando houver código ou documentação já alterada.

---

## 4. Entradas necessárias

O fluxo deve receber:

- nome do projeto;
- objetivo do projeto;
- caminho do repositório ou arquivos analisados;
- system design aplicável;
- stack esperada;
- público-alvo;
- restrições conhecidas;
- histórico relevante, se houver.

---

## 5. Sequência do fluxo

```text
Gerson solicita análise
  ↓
Orquestrador classifica o projeto
  ↓
Orquestrador seleciona agentes
  ↓
Arquiteto avalia estrutura e stack
  ↓
Produto avalia proposta de valor e roadmap
  ↓
UX/UI avalia experiência e consistência visual
  ↓
SEO avalia potencial orgânico e estrutura semântica
  ↓
Segurança avalia riscos e privacidade
  ↓
QA avalia testabilidade e riscos de regressão
  ↓
Financeiro avalia fórmulas e conceitos, se aplicável
  ↓
DevOps avalia build/deploy, se aplicável
  ↓
Orquestrador consolida pareceres
  ↓
Studio Lead revisa a conclusão
  ↓
Gerson decide próximos passos
```

---

## 6. Saída esperada

O fluxo deve gerar um relatório com:

```text
Projeto:
Objetivo:
Resumo executivo:
Diagnóstico técnico:
Diagnóstico de produto:
Diagnóstico UX/UI:
Diagnóstico SEO:
Diagnóstico de segurança:
Diagnóstico QA:
Diagnóstico financeiro, se aplicável:
Diagnóstico DevOps, se aplicável:
Riscos:
Quick wins:
Recomendações priorizadas:
Próximos passos:
Decisão do Studio Lead:
```

---

## 7. Regras de decisão

A análise pode terminar com:

- `APPROVED`: projeto está coerente e pode evoluir;
- `APPROVED_WITH_NOTES`: projeto está coerente, mas há melhorias recomendadas;
- `CHANGES_REQUESTED`: há ajustes importantes antes de avançar;
- `BLOCKED`: há risco relevante ou desalinhamento grave.

---

## 8. Regras específicas

- Não propor backend para o `www` sem justificativa real.
- Não sugerir frameworks pesados por padrão.
- Priorizar melhorias incrementais.
- Separar problemas técnicos de problemas de produto.
- Gerar recomendações executáveis, não genéricas.
- Indicar impacto, esforço e risco de cada recomendação.

---

## 9. Resultado ideal

Ao final deste fluxo, o Gerson deve saber:

- o estado atual do projeto;
- o que está bom;
- o que precisa melhorar;
- o que deve ser priorizado;
- quais riscos existem;
- quais próximos passos fazem sentido.
