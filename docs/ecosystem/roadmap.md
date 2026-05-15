# Roadmap — Ecossistema Gelocci

## 1. Visão geral

Este roadmap organiza a evolução macro do ecossistema Gelocci.

Ele não substitui os roadmaps específicos de cada produto. Seu papel é mostrar a direção geral e a relação entre `www`, Hub de Ferramentas, Gelocci Studio, Asset Allocation e produtos futuros.

---

## 2. Fase 1 — Fundação documental

Status: em andamento/concluída em grande parte.

Objetivos:

- criar repositório do Gelocci Studio;
- documentar conceito do Studio;
- documentar system design do Studio;
- documentar system design do ecossistema;
- documentar produtos principais;
- documentar agentes;
- documentar prompts;
- documentar fluxos operacionais;
- definir diretrizes e princípios.

Entregas:

- `docs/studio/conceito.md`;
- `docs/studio/system-design.md`;
- `docs/ecosystem/system-design.md`;
- `docs/products/www/system-design.md`;
- `docs/products/tools-hub/system-design.md`;
- `docs/products/asset-allocation/system-design.md`;
- `docs/agentes/`;
- `prompts/agentes/`;
- `prompts/fluxos/`.

---

## 3. Fase 2 — Fortalecimento do www

Objetivo:

Consolidar o `gelocci.com.br` como raiz pública leve, rápida, confiável e com boa experiência.

Frentes:

- melhorar home;
- revisar identidade visual;
- fortalecer posicionamento;
- melhorar páginas educativas;
- melhorar performance;
- melhorar SEO;
- padronizar header/footer;
- revisar responsividade;
- preparar chamadas para produtos futuros.

Resultado esperado:

O `www` deve se tornar uma base pública mais profissional e estratégica.

---

## 4. Fase 3 — Evolução do Hub de Ferramentas

Objetivo:

Transformar o Hub de Ferramentas em uma área forte de aquisição, utilidade e educação prática.

Frentes:

- padronizar páginas de ferramentas;
- revisar fórmulas;
- melhorar explicações;
- melhorar gráficos;
- melhorar mensagens de erro;
- criar FAQs;
- conectar ferramentas a artigos;
- identificar novas ferramentas prioritárias;
- preparar ferramentas como entrada para produtos avançados.

Ferramentas prioritárias:

- juros compostos;
- equivalência de taxas;
- Black-Scholes;
- calculadora IR;
- simulador INSS;
- simulador de aposentadoria;
- simulador público de Asset Allocation.

---

## 5. Fase 4 — Primeira operação real do Gelocci Studio

Objetivo:

Começar a usar o Gelocci Studio operacionalmente, ainda de forma local e controlada.

Frentes:

- criar primeiro auditor local;
- ler repositório do `www`;
- gerar mapa de arquivos;
- gerar relatório Markdown;
- usar prompts dos agentes;
- gerar recomendações;
- criar backlog inicial;
- testar fluxo de análise de projeto.

Tecnologias prováveis:

- Node.js;
- TypeScript;
- Markdown;
- JSON;
- Git;
- API externa de LLM em fase posterior.

Resultado esperado:

O Studio deve começar a apoiar decisões reais sobre o `www`.

---

## 6. Fase 5 — Asset Allocation público inicial

Objetivo:

Preparar a entrada do primeiro produto comercial futuro.

Frentes:

- criar conteúdo educativo sobre asset allocation;
- criar landing page;
- criar simulador público simples;
- explicar alocação por classe de ativos;
- mostrar ideia de rebalanceamento;
- validar interesse;
- conectar com o Hub de Ferramentas;
- preparar system design detalhado do produto.

Resultado esperado:

Validar se o público entende e se interessa pelo produto antes de construir a área autenticada.

---

## 7. Fase 6 — Asset Allocation produto

Objetivo:

Criar a primeira versão real do produto Asset Allocation.

Frentes:

- definir MVP autenticado;
- modelar carteiras;
- modelar ativos;
- modelar lançamentos;
- definir alocação alvo;
- calcular rebalanceamento;
- criar dashboard;
- definir persistência;
- avaliar backend;
- avaliar banco;
- avaliar autenticação;
- avaliar cobrança.

Resultado esperado:

Primeira versão comercial ou pré-comercial do Asset Allocation.

---

## 8. Fase 7 — Produtos futuros: IR e INSS

Objetivo:

Avaliar evolução de ferramentas atuais para produtos mais completos.

### IR

Possibilidades:

- calculadora simples;
- importação de notas;
- apuração mensal;
- relatórios;
- apoio à declaração.

### INSS

Possibilidades:

- simulação simples;
- leitura de CNIS;
- cálculo de média;
- cenários;
- relatórios.

Resultado esperado:

Decidir se IR e INSS continuam como ferramentas públicas ou viram produtos próprios.

---

## 9. Fase 8 — Studio com automação assistida

Objetivo:

Evoluir o Gelocci Studio para apoiar implementação, revisão e publicação.

Frentes:

- criar comandos CLI;
- gerar planos de alteração;
- gerar arquivos completos;
- criar checklists;
- sugerir commits;
- apoiar publicação;
- iniciar integração com LLM;
- avaliar LiteLLM;
- avaliar Langfuse;
- avaliar LangGraph;
- avaliar Docker sandbox.

Resultado esperado:

O Studio deixa de ser apenas documentação e passa a ser ferramenta prática de desenvolvimento.

---

## 10. Fase 9 — Studio maduro

Objetivo:

Transformar o Gelocci Studio em equipe digital interna madura.

Frentes:

- orquestração real de agentes;
- histórico estruturado;
- dashboard interno;
- execução assistida;
- branch/PR assistido;
- validação automatizada;
- análise contínua;
- observabilidade;
- sandbox;
- integração com GitHub.

Resultado esperado:

O Studio passa a acelerar significativamente a evolução do ecossistema Gelocci.

---

## 11. Ordem recomendada de execução

Ordem sugerida:

1. fechar documentação base;
2. fortalecer `www`;
3. padronizar Hub de Ferramentas;
4. criar auditor local do Studio;
5. usar auditor no `www`;
6. gerar backlog real;
7. evoluir Asset Allocation público;
8. validar Asset Allocation produto;
9. evoluir Studio para automação assistida.

---

## 12. Critério de priorização

Priorizar iniciativas que:

- aumentem valor para o usuário;
- melhorem confiança;
- melhorem SEO;
- melhorem performance;
- reduzam retrabalho;
- preparem monetização futura;
- preservem simplicidade;
- ajudem o Gerson a produzir mais e melhor.

---

## 13. Itens fora de escopo no curto prazo

Não priorizar agora:

- SaaS público do Gelocci Studio;
- modelo LLM local;
- Kubernetes;
- microserviços;
- billing complexo;
- dashboards sofisticados;
- automação de deploy sem validação;
- produtos comerciais antes de validar proposta de valor.

---

## 14. Direção estratégica

O ecossistema deve crescer em camadas:

```text
Base pública forte
  ↓
Ferramentas úteis
  ↓
Conteúdo educativo
  ↓
Produtos avançados
  ↓
Studio apoiando evolução contínua
```

A meta não é crescer rápido de forma desorganizada.

A meta é criar um ecossistema confiável, útil, leve e com potencial comercial real.
