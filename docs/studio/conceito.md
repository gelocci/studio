# Gelocci Studio — Conceito

## Sumário

1. [Propósito](#1-propósito)
2. [Definição](#2-definição)
3. [Escopo e limites](#3-escopo-e-limites)
4. [Princípios](#4-princípios)
5. [Estrutura de agentes](#5-estrutura-de-agentes)
6. [Modelo de decisão](#6-modelo-de-decisão)
7. [Fluxo geral](#7-fluxo-geral)
8. [Relação com o gelocci.com.br](#8-relação-com-o-geloccicombr)
9. [Relação com produtos comerciais futuros](#9-relação-com-produtos-comerciais-futuros)
10. [Roadmap inicial](#10-roadmap-inicial)

---

## 1. Propósito

O **Gelocci Studio** é uma plataforma interna de agentes criada para apoiar a evolução contínua do ecossistema Gelocci, especialmente o site `gelocci.com.br`.

Seu objetivo é atuar como uma equipe digital de apoio ao Gerson, auxiliando na análise, arquitetura, desenvolvimento, revisão, testes, segurança, publicação, SEO, produto, conteúdo e evolução das ferramentas financeiras.

O Gelocci Studio não é, inicialmente, um produto comercial. Ele é uma ferramenta interna para acelerar, qualificar e organizar o desenvolvimento dos produtos da família Gelocci.

O ecossistema Gelocci, por outro lado, poderá conter produtos comerciais no futuro, como módulos premium, ferramentas avançadas, áreas autenticadas, relatórios, assinaturas ou soluções específicas, como o módulo de **Asset Allocation**.

---

## 2. Definição

### 2.1 O que o Gelocci Studio é

O Gelocci Studio é uma plataforma interna de trabalho assistido por agentes.

Ele deve apoiar o Gerson em atividades como:

| Área | Apoio esperado |
|---|---|
| Arquitetura | Avaliar estrutura, padrões, modularidade e complexidade |
| Desenvolvimento | Propor e apoiar alterações em HTML, CSS, JavaScript e tecnologias aprovadas |
| Revisão | Revisar qualidade, legibilidade, consistência e riscos |
| QA | Validar comportamento, build, responsividade e regressões |
| Segurança | Avaliar privacidade, dependências, cookies, LGPD e exposição de dados |
| Produto | Avaliar valor para o usuário, priorização e roadmap |
| UX/UI | Melhorar experiência visual, layout, CTAs e consistência |
| SEO | Melhorar indexação, headings, títulos, links internos e intenção de busca |
| Conteúdo | Apoiar textos, FAQs, artigos, roteiros e explicações educativas |
| Finanças | Validar conceitos, fórmulas, cálculos e premissas financeiras |
| DevOps | Apoiar build, Git, branches, deploy, versionamento e rollback |

### 2.2 O que o Gelocci Studio não é

O Gelocci Studio não é:

- uma plataforma SaaS para venda a terceiros, pelo menos em sua fase inicial;
- um substituto da decisão do Gerson;
- um agente autônomo com poder irrestrito;
- uma ferramenta para publicar mudanças sem aprovação;
- uma plataforma que deve tornar o `gelocci.com.br` pesado;
- uma justificativa para usar backend quando HTML, CSS e JavaScript puro forem suficientes.

---

## 3. Escopo e limites

O Gelocci Studio deve apoiar a evolução do ecossistema Gelocci, mas sem misturar responsabilidades.

### 3.1 Escopo inicial

O foco inicial será apoiar:

- o site `gelocci.com.br`;
- o Hub de Ferramentas;
- melhorias de layout, SEO, conteúdo e arquitetura;
- organização do roadmap;
- apoio à criação de produtos futuros, como Asset Allocation.

### 3.2 Limites

O Gelocci Studio não deve tomar decisões finais sozinho.

Toda alteração relevante deve passar por aprovação do Gerson, especialmente quando envolver:

- alteração estrutural;
- publicação;
- criação de backend;
- dependências novas;
- mudança em cálculo financeiro;
- coleta de dados;
- autenticação;
- pagamento;
- manipulação de documentos.

---

## 4. Princípios

### 4.1 O Gerson decide

Os agentes podem sugerir, revisar, questionar e bloquear tecnicamente uma solução, mas a decisão final é sempre do Gerson.

### 4.2 O gelocci.com.br deve permanecer leve

O site `gelocci.com.br` deve continuar baseado preferencialmente em:

- HTML5;
- CSS;
- JavaScript puro;
- Node.js apenas para build estático;
- deploy simples.

Backend só deve ser usado quando houver necessidade real, como autenticação, persistência de dados, pagamento, upload de arquivos, processamento pesado ou integração privada.

Essa premissa se aplica especialmente ao site público `gelocci.com.br`. Produtos avançados ou comerciais poderão adotar backend, banco de dados, autenticação, pagamento e processamento server-side quando houver justificativa funcional, técnica ou comercial.

### 4.3 Qualidade antes de velocidade

O Gelocci Studio deve evitar remendos, soluções frágeis e alterações sem revisão.

### 4.4 Agentes devem colaborar

Os agentes não trabalham de forma isolada. Eles devem debater, apontar conflitos e buscar a melhor solução conjunta.

### 4.5 Bloqueios devem ser justificados

Um agente pode bloquear uma solução, mas precisa explicar claramente:

- o motivo do bloqueio;
- o risco identificado;
- o que precisa ser ajustado;
- quais alternativas existem.

### 4.6 Toda alteração deve ser rastreável

As decisões, recomendações, planos e aprovações devem ser registradas.

### 4.7 Separação entre hub público e produtos avançados

O `gelocci.com.br` deve atuar como hub público, leve, educativo e acessível.

Produtos avançados da família Gelocci, como Asset Allocation, cálculo automatizado de IR, leitura de documentos financeiros, relatórios premium ou áreas autenticadas, devem ser desenvolvidos em módulos, aplicações ou subdomínios separados quando exigirem maior complexidade técnica.

---

## 5. Estrutura de agentes

O Gelocci Studio será composto por agentes especializados, funcionando como uma equipe digital interna.

| Agente | Responsabilidade principal |
|---|---|
| Orquestrador Gelocci | Receber demandas, selecionar agentes, coordenar análises e consolidar pareceres |
| Studio Lead | Revisar a solução consolidada e validar alinhamento com a visão do Gelocci Studio |
| Arquiteto Gelocci | Avaliar estrutura, padrões, organização, complexidade e arquitetura |
| Desenvolvedor Gelocci | Propor e implementar soluções técnicas aprovadas |
| Revisor Gelocci | Revisar código, legibilidade, consistência e duplicidades |
| QA Gelocci | Validar comportamento, testes, build, console, responsividade e regressões |
| Segurança Gelocci | Avaliar privacidade, LGPD, cookies, scripts externos, dependências e exposição de dados |
| Produto Gelocci | Avaliar valor para o usuário, priorização, jornada e roadmap |
| UX/UI Gelocci | Avaliar experiência visual, clareza, layout, responsividade e CTAs |
| SEO Gelocci | Avaliar títulos, descrições, headings, links internos e intenção de busca |
| Financeiro Gelocci | Validar conceitos financeiros, fórmulas, premissas, cálculos e explicações |
| Conteúdo Gelocci | Apoiar textos, artigos, FAQs, roteiros e linguagem educativa |
| DevOps Gelocci | Apoiar build, Git, branches, deploy, versionamento, tags e rollback |

---

## 6. Modelo de decisão

Cada agente pode emitir um parecer estruturado.

| Parecer | Significado |
|---|---|
| `APPROVED` | O agente aprova a solução |
| `APPROVED_WITH_NOTES` | O agente aprova, mas registra observações ou melhorias futuras |
| `CHANGES_REQUESTED` | O agente entende que a solução precisa ser ajustada antes de avançar |
| `BLOCKED` | O agente identifica risco relevante e bloqueia o avanço sem correção ou decisão explícita do Gerson |

### 6.1 Regra de avanço

Uma solução só pode avançar se:

1. nenhum agente obrigatório emitir `BLOCKED` sem tratamento;
2. nenhum agente obrigatório emitir `CHANGES_REQUESTED` sem ajuste ou decisão explícita;
3. o Studio Lead aprovar o alinhamento geral;
4. o Gerson aprovar a execução.

---

## 7. Fluxo geral

O fluxo padrão do Gelocci Studio será:

```text
Gerson cria uma demanda
  ↓
Orquestrador interpreta a demanda
  ↓
Orquestrador seleciona os agentes necessários
  ↓
Agentes emitem parecer individual
  ↓
Orquestrador consolida conflitos
  ↓
Se necessário, ocorre nova rodada de discussão
  ↓
Studio Lead revisa a solução consolidada
  ↓
Gerson aprova ou ajusta a direção
  ↓
Desenvolvedor implementa
  ↓
Revisor, QA e Segurança validam
  ↓
DevOps orienta publicação
  ↓
Gerson decide publicar
```

---

## 8. Relação com o gelocci.com.br

O `gelocci.com.br` é o principal projeto atendido pelo Gelocci Studio.

Ele deve permanecer como hub público, leve e estático da marca Gelocci, com foco em:

- ferramentas financeiras;
- educação financeira;
- simuladores;
- calculadoras;
- páginas de aquisição;
- conteúdo de SEO;
- divulgação de produtos futuros.

Embora o `gelocci.com.br` nasça como hub público, leve e predominantemente gratuito, ele poderá atuar também como porta de entrada para produtos comerciais da família Gelocci.

Produtos mais avançados, como Asset Allocation, cálculo automatizado de IR, leitura de documentos financeiros, relatórios premium ou áreas autenticadas, poderão ser desenvolvidos em módulos separados ou subdomínios próprios, preservando a leveza do site principal.

---

## 9. Relação com produtos comerciais futuros

O Gelocci Studio deve apoiar tanto o `gelocci.com.br` quanto produtos comerciais futuros da família Gelocci.

O primeiro produto comercial previsto é o módulo de **Asset Allocation**, voltado à construção, análise, balanceamento e acompanhamento de carteiras de ativos.

Esse tipo de produto poderá exigir:

- autenticação;
- persistência de carteiras;
- histórico de lançamentos;
- importação de dados;
- cálculos recorrentes;
- relatórios;
- pagamento;
- backend;
- banco de dados;
- integrações externas.

A adoção dessas tecnologias deverá ser feita por necessidade real do produto, sem comprometer a leveza do site público principal.

---

## 10. Roadmap inicial

| Fase | Nome | Objetivo |
|---|---|---|
| 1 | Conceito e system design | Definir propósito, agentes, fluxos, regras, arquitetura e limites |
| 2 | Auditor inicial | Criar mecanismo para analisar o repositório `gelocci.com.br` |
| 3 | Backlog inteligente | Transformar diagnósticos em recomendações priorizadas |
| 4 | Implementação assistida | Permitir que recomendações aprovadas gerem planos de alteração |
| 5 | Publicação assistida | Apoiar build, commit, merge, deploy, changelog e publicação |
| 6 | Evolução contínua | Usar métricas, SEO, conteúdo e feedback para sugerir melhorias |
| 7 | Apoio a produtos comerciais | Apoiar produtos como Asset Allocation, preservando a separação entre hub público e módulos avançados |
