# Gelocci Studio

O **Gelocci Studio** é uma plataforma interna de agentes criada para apoiar a evolução contínua do ecossistema Gelocci.

Ele funciona como uma equipe digital de apoio ao Gerson, auxiliando em arquitetura, desenvolvimento, revisão, testes, segurança, publicação, SEO, produto, conteúdo e evolução das ferramentas financeiras.

O Studio não nasce como produto comercial. Ele nasce como ferramenta interna para acelerar, organizar e qualificar a evolução do `gelocci.com.br`, do Hub de Ferramentas, do Asset Allocation e de futuros produtos da família Gelocci.

---

## Objetivo

Apoiar a criação, evolução e manutenção dos produtos digitais da família Gelocci, mantendo o `gelocci.com.br` leve, rápido, organizado e orientado a valor para o usuário.

---

## Escopo inicial

O escopo inicial do Gelocci Studio inclui:

- documentar o conceito da plataforma;
- definir o ecossistema Gelocci;
- definir system designs dos principais produtos;
- documentar agentes e suas responsabilidades;
- criar prompts operacionais dos agentes;
- criar fluxos de trabalho entre agentes;
- apoiar análise, revisão e evolução dos projetos Gelocci;
- preparar a base para um futuro auditor local do `www`.

---

## Estrutura atual

```text
docs/
│
├── studio/
│   ├── conceito.md
│   └── system-design.md
│
├── ecosystem/
│   ├── system-design.md
│   ├── diretrizes-documentacao.md
│   ├── principios-arquitetura.md
│   └── roadmap.md
│
├── products/
│   ├── www/
│   │   └── system-design.md
│   │
│   ├── tools-hub/
│   │   └── system-design.md
│   │
│   └── asset-allocation/
│       └── system-design.md
│
└── agentes/
    ├── orquestrador.md
    ├── studio-lead.md
    ├── arquiteto.md
    ├── desenvolvedor.md
    ├── revisor.md
    ├── qa.md
    ├── seguranca.md
    ├── produto.md
    ├── ux-ui.md
    ├── seo.md
    ├── financeiro.md
    └── devops.md
```

```text
prompts/
│
├── agentes/
│   ├── orquestrador.md
│   ├── studio-lead.md
│   ├── arquiteto.md
│   ├── desenvolvedor.md
│   ├── revisor.md
│   ├── qa.md
│   ├── seguranca.md
│   ├── produto.md
│   ├── ux-ui.md
│   ├── seo.md
│   ├── financeiro.md
│   └── devops.md
│
└── fluxos/
    ├── analise-projeto.md
    ├── melhoria-pagina.md
    ├── revisao-ferramenta-financeira.md
    ├── implementacao-assistida.md
    └── publicacao-assistida.md
```

---

## Premissas

- O Gelocci Studio é uma ferramenta interna.
- O Gerson mantém a decisão final sobre qualquer alteração.
- O `gelocci.com.br` deve permanecer leve, preferencialmente em HTML5, CSS e JavaScript puro.
- Backend só deve ser usado no `www` quando houver justificativa real.
- Produtos avançados, como Asset Allocation, podem usar backend, banco, autenticação e pagamento quando fizer sentido.
- Toda recomendação relevante deve ser revisada antes de virar implementação.
- Agentes podem sugerir, revisar e bloquear tecnicamente, mas não publicam nem decidem sozinhos.

---

## Agentes principais

O Gelocci Studio será organizado como uma equipe digital interna com agentes especializados:

| Agente | Papel |
|---|---|
| Orquestrador | Coordena demandas, seleciona agentes e consolida pareceres |
| Studio Lead | Revisa a solução final e protege a visão do Gelocci Studio |
| Arquiteto | Avalia estrutura, padrões, complexidade e aderência ao system design |
| Desenvolvedor | Propõe e implementa soluções técnicas aprovadas |
| Revisor | Revisa qualidade, legibilidade e consistência |
| QA | Valida comportamento, build, responsividade e regressões |
| Segurança | Avalia privacidade, scripts, dependências, cookies e riscos |
| Produto | Avalia valor para o usuário, priorização e roadmap |
| UX/UI | Avalia experiência visual, layout e clareza |
| SEO | Avalia conteúdo indexável, headings, links internos e intenção de busca |
| Financeiro | Valida fórmulas, conceitos, cálculos e premissas financeiras |
| DevOps | Apoia Git, build, deploy, versionamento e rollback |

---

## Fluxos operacionais

Os fluxos atuais são:

- análise de projeto;
- melhoria de página;
- revisão de ferramenta financeira;
- implementação assistida;
- publicação assistida.

Esses fluxos serão usados inicialmente de forma assistida e, no futuro, poderão alimentar uma CLI local e uma plataforma de orquestração de agentes.

---

## Direção tecnológica

A direção inicial do Studio é simples e local:

- Node.js;
- TypeScript;
- Markdown;
- JSON;
- Git;
- prompts versionados;
- leitura do repositório `www`;
- geração de relatórios locais;
- integração futura com LLM via API.

A evolução futura poderá incluir:

- CLI local;
- auditor do `www`;
- LiteLLM;
- Langfuse;
- LangGraph;
- Docker sandbox;
- dashboard interno.

---

## Relação com o ecossistema Gelocci

O Gelocci é o guarda-chuva.

Dentro dele:

- `gelocci.com.br` é a raiz pública;
- Hub de Ferramentas fica dentro do `www`;
- Gelocci Studio é a plataforma interna de evolução;
- Asset Allocation será produto futuro, provavelmente em `asset.gelocci.com.br`;
- IR, INSS e outros produtos poderão surgir depois.

Cada produto relevante deverá ter seu próprio system design, layout guidelines e roadmap quando fizer sentido.

---

## Próximos passos

Próximos blocos planejados:

1. corrigir e fortalecer o README;
2. analisar o design system e os CSS reais do `www`;
3. gerar diretrizes visuais reais do ecossistema;
4. criar `layout-guidelines.md` do `www`;
5. criar `layout-guidelines.md` do Hub de Ferramentas;
6. iniciar o primeiro protótipo operacional do auditor local.
