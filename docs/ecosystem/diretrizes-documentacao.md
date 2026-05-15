# Diretrizes de Documentação — Ecossistema Gelocci

## 1. Objetivo

Este documento define o padrão de documentação do ecossistema Gelocci.

Ele serve para manter consistência entre documentos do Studio, do ecossistema, dos produtos, dos agentes, dos prompts e dos fluxos operacionais.

---

## 2. Idioma oficial

A documentação deve ser escrita em **português do Brasil**.

Termos técnicos em inglês podem ser mantidos quando forem consolidados ou mais claros no contexto técnico.

Exemplos aceitos:

- system design;
- roadmap;
- layout;
- frontend;
- backend;
- deploy;
- build;
- branch;
- commit;
- pull request;
- merge;
- rollback;
- prompt;
- agent;
- LLM;
- SEO;
- UX/UI.

---

## 3. Nome dos arquivos

Os arquivos devem usar nomes simples, preferencialmente em minúsculas e com hífen quando necessário.

Como o contexto vem da pasta, não é necessário prefixar tudo com `gelocci`.

Exemplos recomendados:

```text
docs/studio/system-design.md
docs/ecosystem/system-design.md
docs/products/www/system-design.md
docs/products/asset-allocation/system-design.md
```

Evitar:

```text
docs/gelocci-studio-system-design.md
docs/gelocci-ecosystem-system-design.md
docs/gelocci-www-system-design.md
```

---

## 4. Estrutura de pastas

A estrutura documental principal é:

```text
docs/
│
├── studio/
├── ecosystem/
├── products/
└── agentes/
```

A estrutura de prompts é:

```text
prompts/
│
├── agentes/
├── base/
└── fluxos/
```

A estrutura de produtos é:

```text
docs/products/
│
├── www/
├── tools-hub/
├── asset-allocation/
├── ir/
└── inss/
```

---

## 5. Tipos de documento

### 5.1 Conceito

Define o que algo é, o que não é, seus objetivos e limites.

Exemplo:

```text
docs/studio/conceito.md
```

### 5.2 System design

Define arquitetura, responsabilidades, módulos, fluxos, tecnologias e decisões técnicas.

Exemplos:

```text
docs/studio/system-design.md
docs/products/www/system-design.md
```

### 5.3 Roadmap

Define evolução planejada, fases, prioridades e próximos passos.

Exemplo:

```text
docs/products/asset-allocation/roadmap.md
```

### 5.4 Layout guidelines

Define diretrizes visuais, componentes, padrões de tela e experiência.

Exemplo:

```text
docs/products/www/layout-guidelines.md
```

### 5.5 Prompt

Define como um agente ou fluxo deve se comportar quando executado.

Exemplo:

```text
prompts/agentes/orquestrador.md
```

### 5.6 Documento de agente

Define papel, responsabilidades, entradas, saídas e poder de bloqueio de um agente.

Exemplo:

```text
docs/agentes/studio-lead.md
```

---

## 6. Regra de documentos completos

Sempre que um documento for alterado, a preferência é gerar o documento completo para substituição.

Evitar trabalhar com trechos soltos, salvo quando o Gerson pedir explicitamente.

Essa regra reduz erro de edição manual e mantém a documentação mais confiável.

---

## 7. Estilo de escrita

A documentação deve ser:

- clara;
- objetiva;
- organizada;
- escaneável;
- sem excesso de jargão;
- com tabelas quando ajudarem;
- com listas curtas quando possível;
- com blocos de código para estruturas e fluxos.

Evitar:

- documentos longos sem divisão;
- parágrafos excessivamente grandes;
- termos técnicos sem necessidade;
- duplicação sem propósito;
- decisões ambíguas.

---

## 8. Estrutura recomendada para system design

Um system design deve conter, quando aplicável:

1. visão geral;
2. objetivo;
3. papel no ecossistema;
4. princípios;
5. arquitetura conceitual;
6. módulos;
7. stack técnica;
8. fluxos;
9. segurança;
10. performance;
11. riscos;
12. roadmap ou próximos passos;
13. decisões iniciais.

---

## 9. Estrutura recomendada para agentes

Um documento de agente deve conter:

1. papel;
2. responsabilidades;
3. entradas;
4. saídas;
5. critérios de avaliação;
6. poder de bloqueio;
7. formato de parecer;
8. princípio central.

---

## 10. Estrutura recomendada para prompts

Um prompt deve conter:

1. identidade do agente ou fluxo;
2. papel;
3. responsabilidades;
4. critérios de decisão;
5. regras específicas;
6. formato obrigatório de resposta;
7. limites;
8. instruções contra invenção de fatos.

---

## 11. Versionamento

A documentação deve ser versionada no Git.

Commits devem ser feitos por blocos lógicos, não necessariamente por arquivo.

Exemplos:

```text
Documenta system designs iniciais dos produtos principais
Documenta agentes principais do Studio
Adiciona prompts de fluxos operacionais
```

---

## 12. Critério para criar novo documento

Criar um novo documento quando:

- o tema terá evolução própria;
- o assunto é recorrente;
- a decisão precisa ser preservada;
- o produto terá roadmap próprio;
- há risco de misturar responsabilidades;
- o conteúdo ficaria grande demais em outro documento.

---

## 13. Relação com o Gelocci Studio

O Gelocci Studio deve usar estes documentos como fonte de contexto.

Agentes e fluxos devem respeitar:

- system designs;
- diretrizes;
- roadmaps;
- decisões arquiteturais;
- prompts versionados.

---

## 14. Direção futura

Com a evolução do Studio, estes documentos poderão alimentar automaticamente agentes, prompts e auditorias de projeto.

A documentação deve ser tratada como parte operacional do Studio, não apenas como registro estático.
