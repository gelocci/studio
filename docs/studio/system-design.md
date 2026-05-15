# System Design — Gelocci Studio

## 1. Visão geral

O Gelocci Studio é uma plataforma interna de agentes criada para apoiar a evolução contínua do ecossistema Gelocci.

Seu foco inicial é auxiliar o desenvolvimento, revisão, melhoria, publicação e evolução do site gelocci.com.br, mantendo sua premissa de leveza, simplicidade e uso preferencial de HTML5, CSS e JavaScript puro.

O Gelocci Studio também deverá apoiar, no futuro, produtos comerciais da família Gelocci, como o módulo de Asset Allocation, que poderá exigir backend, autenticação, banco de dados, pagamento e persistência de carteiras.

O Gelocci Studio não nasce como produto comercial. Ele nasce como uma ferramenta interna de apoio ao Gerson.

---

## 2. Objetivos do sistema

O Gelocci Studio deve permitir que o Gerson trabalhe com apoio de uma equipe digital de agentes.

O sistema deve ajudar a:

- analisar projetos;
- identificar oportunidades de melhoria;
- sugerir soluções técnicas;
- revisar arquitetura;
- revisar código;
- validar fórmulas financeiras;
- avaliar segurança e privacidade;
- propor melhorias de UX/UI;
- sugerir melhorias de SEO;
- apoiar conteúdo educativo;
- gerar planos de implementação;
- apoiar publicação e versionamento;
- manter histórico de decisões;
- preservar a coerência do ecossistema Gelocci.

---

## 3. Princípios de arquitetura

### 3.1 Ferramenta interna primeiro

O Gelocci Studio deve ser pensado como ferramenta interna, não como SaaS público.

Por isso, na fase inicial, não é necessário implementar:

- multi-tenant;
- billing;
- marketplace;
- cadastro público;
- planos comerciais;
- onboarding para terceiros.

Esses recursos só devem ser considerados se, no futuro, houver uma decisão explícita de transformar o Gelocci Studio em produto comercial.

### 3.2 Simplicidade antes de sofisticação

A plataforma deve nascer simples e evoluir por fases.

O primeiro objetivo não é automatizar tudo. O primeiro objetivo é organizar e melhorar o fluxo de trabalho atual:

```text
Ideia → Análise → Discussão entre agentes → Plano → Implementação assistida → Revisão → Publicação
```

### 3.3 O Gerson decide

Os agentes podem sugerir, revisar, questionar e bloquear tecnicamente, mas a decisão final é sempre do Gerson.

### 3.4 Human-in-the-loop obrigatório

A plataforma deve exigir aprovação humana para:

- executar alterações relevantes;
- criar branches;
- abrir pull requests;
- fazer merge;
- publicar;
- alterar regras de cálculo;
- mexer em integrações;
- introduzir backend;
- introduzir dependências pesadas.

### 3.5 Leveza do gelocci.com.br

O gelocci.com.br deve continuar sendo leve, público e predominantemente estático.

A stack preferencial do site público é:

- HTML5;
- CSS;
- JavaScript puro;
- Node.js apenas para build estático;
- Netlify;
- Cloudflare;
- GitHub.

Backend só deve ser usado quando houver necessidade real.

### 3.6 Separação entre hub público e produtos avançados

O gelocci.com.br deve funcionar como hub público, educativo e de aquisição.

Produtos avançados, como Asset Allocation, IR automatizado, leitura de documentos financeiros e áreas autenticadas, devem poder evoluir em módulos ou subdomínios próprios.

---

## 4. Visão de alto nível da arquitetura

A arquitetura conceitual do Gelocci Studio pode ser representada assim:

```text
Gerson
  |
  v
Interface do Gelocci Studio
  |
  v
Orquestrador Gelocci
  |
  +--> Studio Lead
  +--> Conselho de Agentes
  |      |
  |      +--> Arquiteto
  |      +--> Desenvolvedor
  |      +--> Revisor
  |      +--> QA
  |      +--> Segurança
  |      +--> Produto
  |      +--> UX/UI
  |      +--> SEO
  |      +--> Financeiro
  |      +--> Conteúdo
  |      +--> DevOps
  |
  v
Módulos de Apoio
  |
  +--> Leitor de Repositório
  +--> Analisador de Projeto
  +--> Gerador de Recomendações
  +--> Executor Assistido
  +--> Histórico de Decisões
  +--> Integração com Git
  +--> Integração com LLM
```

---

## 5. Módulos principais

### 5.1 Interface do Gelocci Studio

A interface será o ponto de interação entre o Gerson e os agentes.

Na fase inicial, pode ser simples.

Ela deve permitir:

- cadastrar projetos;
- registrar demandas;
- visualizar análises;
- visualizar recomendações;
- aprovar ou rejeitar propostas;
- consultar histórico;
- acompanhar planos de implementação;
- gerar documentos.

No início, essa interface pode ser substituída parcialmente por arquivos Markdown e comandos locais, desde que o fluxo fique bem documentado.

---

### 5.2 Orquestrador Gelocci

O Orquestrador é responsável por coordenar o trabalho dos agentes.

Ele deve:

- receber a demanda;
- interpretar o objetivo;
- identificar o tipo de tarefa;
- selecionar os agentes necessários;
- distribuir contexto;
- coletar pareceres;
- consolidar conflitos;
- solicitar nova rodada quando necessário;
- gerar uma proposta consolidada;
- encaminhar para o Studio Lead.

O Orquestrador não é o dono da decisão. Ele é o coordenador do fluxo.

---

### 5.3 Studio Lead

O Studio Lead é o agente responsável por revisar a solução consolidada.

Ele deve verificar se a proposta está alinhada com:

- a visão do Gerson;
- os princípios do Gelocci Studio;
- a leveza do gelocci.com.br;
- a estratégia do ecossistema Gelocci;
- a qualidade esperada;
- a separação entre hub público e produtos avançados.

O Studio Lead pode:

- aprovar;
- aprovar com observações;
- solicitar mudanças;
- bloquear uma solução.

---

### 5.4 Conselho de Agentes

O Conselho de Agentes é o conjunto de agentes especialistas que participa conforme o tipo de demanda.

Nem todo agente precisa participar de toda demanda.

Exemplo:

Para uma alteração visual na home:

- UX/UI;
- Produto;
- SEO;
- Arquiteto;
- Desenvolvedor;
- QA;
- Studio Lead.

Para uma alteração em cálculo financeiro:

- Financeiro;
- Desenvolvedor;
- QA;
- Arquiteto;
- Segurança, se houver dados sensíveis;
- Studio Lead.

Para uma alteração de deploy:

- DevOps;
- QA;
- Segurança;
- Arquiteto;
- Studio Lead.

---

### 5.5 Leitor de Repositório

Responsável por ler a estrutura de um projeto.

Na fase inicial, deve conseguir analisar o repositório local do gelocci.com.br.

Deve ignorar:

- `.git`;
- `node_modules`;
- `dist`;
- `build`;
- `.next`;
- `out`;
- arquivos temporários;
- logs.

Deve coletar:

- árvore de arquivos;
- arquivos HTML;
- arquivos CSS;
- arquivos JavaScript;
- scripts de build;
- arquivos de configuração;
- README;
- documentação;
- páginas principais;
- dependências.

---

### 5.6 Analisador de Projeto

Responsável por transformar os dados do repositório em uma visão compreensível.

Deve identificar:

- stack;
- padrões existentes;
- páginas principais;
- ferramentas existentes;
- scripts;
- componentes reutilizados;
- inconsistências;
- possíveis riscos;
- oportunidades de melhoria.

---

### 5.7 Gerador de Recomendações

Responsável por transformar análises em recomendações priorizadas.

Cada recomendação deve conter:

- tipo;
- título;
- descrição;
- justificativa;
- impacto;
- esforço;
- risco;
- agentes envolvidos;
- status;
- próximos passos.

Tipos iniciais:

- TECHNICAL;
- PRODUCT;
- UX_UI;
- SEO;
- FINANCIAL;
- SECURITY;
- CONTENT;
- DEVOPS.

---

### 5.8 Executor Assistido

Responsável por apoiar a implementação de recomendações aprovadas.

Na fase inicial, pode apenas gerar:

- plano de alteração;
- lista de arquivos afetados;
- conteúdo completo dos arquivos;
- comandos Git;
- checklist de testes.

Em fases futuras, poderá:

- criar branch;
- alterar arquivos automaticamente;
- rodar testes;
- abrir pull request;
- preparar changelog.

---

### 5.9 Histórico de Decisões

Responsável por manter registro das decisões importantes.

Deve armazenar:

- demandas;
- pareceres dos agentes;
- conflitos;
- decisão final;
- justificativa;
- data;
- arquivos afetados;
- commits relacionados.

Na fase inicial, isso pode ser feito em Markdown.

No futuro, pode ir para banco de dados.

---

### 5.10 Integração com Git

Responsável por apoiar o fluxo de versionamento.

Na fase inicial:

- orientar comandos;
- conferir branch;
- sugerir commit;
- sugerir merge;
- sugerir tag;
- sugerir rollback.

Em fases futuras:

- criar branch;
- criar commit;
- abrir PR;
- consultar status do repositório;
- acompanhar deploy.

---

### 5.11 Integração com LLM

Responsável por conectar os agentes aos modelos de linguagem.

Na fase inicial, não haverá modelo local próprio.

A plataforma deve usar provedores externos via API, com possibilidade de troca futura.

Premissas:

- evitar acoplamento a um único provedor;
- manter chaves fora do repositório;
- registrar custo e uso;
- separar prompts por agente;
- permitir evolução para modelos locais no futuro.

---

## 6. Agentes iniciais

### 6.1 Orquestrador Gelocci

Coordena o fluxo de trabalho.

### 6.2 Studio Lead

Revisa a solução consolidada e garante alinhamento estratégico.

### 6.3 Arquiteto Gelocci

Avalia estrutura, padrões, organização e complexidade.

### 6.4 Desenvolvedor Gelocci

Propõe e implementa soluções técnicas.

### 6.5 Revisor Gelocci

Revisa código, consistência e legibilidade.

### 6.6 QA Gelocci

Valida comportamento, build, console, responsividade e regressões.

### 6.7 Segurança Gelocci

Avalia segurança, privacidade, scripts externos, cookies, LGPD e exposição de dados.

### 6.8 Produto Gelocci

Avalia valor para o usuário, priorização, proposta de valor e roadmap.

### 6.9 UX/UI Gelocci

Avalia experiência visual, hierarquia, responsividade e consistência com o design system.

### 6.10 SEO Gelocci

Avalia conteúdo indexável, headings, títulos, descrições e links internos.

### 6.11 Financeiro Gelocci

Valida conceitos, fórmulas, premissas, cálculos e explicações financeiras.

### 6.12 Conteúdo Gelocci

Apoia textos, artigos, FAQs, explicações educativas e roteiros.

### 6.13 DevOps Gelocci

Apoia build, Git, branches, deploy, versionamento, tags e rollback.

---

## 7. Modelo de decisão

Cada agente deve emitir um parecer estruturado.

Pareceres possíveis:

```text
APPROVED
APPROVED_WITH_NOTES
CHANGES_REQUESTED
BLOCKED
```

### 7.1 APPROVED

O agente aprova a solução.

### 7.2 APPROVED_WITH_NOTES

O agente aprova, mas registra observações.

### 7.3 CHANGES_REQUESTED

O agente entende que a solução precisa de ajuste antes de avançar.

### 7.4 BLOCKED

O agente entende que há risco relevante e a solução não deve avançar sem correção ou decisão explícita do Gerson.

---

## 8. Regras de avanço

Uma demanda só pode avançar para implementação se:

1. nenhum agente obrigatório emitir `BLOCKED` sem tratamento;
2. nenhum agente obrigatório emitir `CHANGES_REQUESTED` sem ajuste ou decisão explícita;
3. o Studio Lead aprovar o alinhamento geral;
4. o Gerson aprovar a execução.

Uma implementação só pode avançar para publicação se:

1. build estiver validado;
2. QA aprovar;
3. Segurança aprovar quando aplicável;
4. DevOps orientar o fluxo de publicação;
5. Gerson aprovar a publicação.

---

## 9. Fluxo de trabalho

### 9.1 Fluxo de análise

```text
Demanda do Gerson
  ↓
Orquestrador classifica a demanda
  ↓
Orquestrador seleciona agentes
  ↓
Agentes analisam individualmente
  ↓
Orquestrador consolida pareceres
  ↓
Conflitos são resolvidos em nova rodada
  ↓
Studio Lead revisa
  ↓
Gerson decide
```

### 9.2 Fluxo de implementação assistida

```text
Recomendação aprovada
  ↓
Plano de implementação
  ↓
Lista de arquivos afetados
  ↓
Geração de arquivos completos
  ↓
Aplicação manual ou automatizada
  ↓
Build/testes
  ↓
Revisão
  ↓
Commit
  ↓
Publicação
```

### 9.3 Fluxo futuro de PR automático

```text
Recomendação aprovada
  ↓
Criação de branch
  ↓
Alteração automática
  ↓
Build/testes em sandbox
  ↓
Correções automáticas quando seguras
  ↓
Abertura de pull request
  ↓
Revisão do Gerson
  ↓
Merge
  ↓
Deploy
```

---

## 10. Tecnologias candidatas

### 10.1 Fase documental e protótipos

Na fase inicial, o Gelocci Studio pode ser composto por:

- Markdown;
- Git;
- scripts locais;
- prompts versionados;
- documentação;
- protótipos HTML/CSS/JS.

### 10.2 Fase MVP local

Tecnologias candidatas:

- Node.js;
- TypeScript;
- JavaScript;
- Markdown;
- JSON;
- Git;
- simple-git;
- fast-glob;
- dotenv;
- zod.

### 10.3 Interface futura

Tecnologias candidatas:

- HTML5;
- CSS;
- JavaScript puro;
- ou React/Next.js se a complexidade justificar.

Como o Gelocci Studio é ferramenta interna, pode aceitar mais complexidade que o gelocci.com.br, mas ainda deve evitar excesso.

### 10.4 Persistência futura

Opções:

- arquivos Markdown/JSON no início;
- SQLite para MVP local;
- PostgreSQL se a plataforma crescer;
- banco vetorial apenas se houver necessidade real de busca semântica persistente.

### 10.5 Agentes e LLM

Opções:

- chamadas diretas a APIs de LLM no início;
- LiteLLM como gateway futuro;
- LangGraph ou CrewAI se o fluxo multiagente ficar complexo;
- modelos locais apenas se houver viabilidade técnica e custo aceitável.

### 10.6 Execução segura futura

Opções:

- execução manual no início;
- scripts locais controlados;
- Docker sandbox em fase posterior;
- GitHub Actions ou pipelines para validação.

---

## 11. Estratégia de evolução tecnológica

O Gelocci Studio deve evoluir por necessidade, não por entusiasmo tecnológico.

### 11.1 Início

- documentos;
- prompts;
- Git;
- decisões registradas;
- fluxo manual assistido.

### 11.2 MVP local

- script Node.js para ler repositório;
- análise inicial;
- geração de relatório;
- recomendações estruturadas;
- armazenamento em Markdown/JSON.

### 11.3 MVP com interface

- dashboard simples;
- cadastro de projetos;
- histórico de análises;
- recomendações;
- estados de aprovação.

### 11.4 Automação assistida

- criação de branches;
- geração de alterações;
- comandos de build;
- PRs;
- checklists;
- changelog.

### 11.5 Plataforma interna madura

- agentes especializados;
- orquestração;
- histórico completo;
- dashboards;
- métricas;
- integração Git;
- integração com deploy;
- análise contínua.

---

## 12. Relação com projetos Gelocci

### 12.1 gelocci.com.br

Projeto principal inicial.

Características:

- site público;
- leve;
- estático;
- HTML/CSS/JS;
- SEO;
- ferramentas financeiras;
- páginas educativas;
- landing pages;
- canal de aquisição.

### 12.2 Asset Allocation

Produto comercial futuro.

Características esperadas:

- gestão de carteira;
- lançamentos de compra e venda;
- alocação por classe de ativos;
- rebalanceamento;
- risco e retorno;
- relatórios;
- autenticação;
- persistência;
- possível cobrança.

Esse projeto poderá exigir backend e banco de dados.

### 12.3 IR e documentos financeiros

Produto futuro possível.

Características esperadas:

- leitura de notas de corretagem;
- cálculo de imposto;
- relatórios;
- geração de informações para declaração;
- upload de arquivos;
- processamento server-side.

Esse projeto provavelmente exigirá backend.

### 12.4 INSS

Produto futuro possível.

Características esperadas:

- simulação de aposentadoria;
- leitura de CNIS;
- cálculo de média;
- cenários;
- relatórios.

Pode começar simples, mas leitura de documentos tende a exigir backend.

---

## 13. Segurança

O Gelocci Studio deve respeitar regras mínimas de segurança.

### 13.1 Segredos

Nunca versionar:

- chaves de API;
- tokens;
- credenciais;
- arquivos `.env`;
- certificados;
- dados sensíveis.

### 13.2 Execução de código

No início, a execução deve ser manual e consciente.

No futuro, se houver execução automática, ela deve ocorrer em ambiente isolado.

### 13.3 Dados pessoais

Qualquer funcionalidade envolvendo dados financeiros, uploads, carteiras, documentos ou informações pessoais deve ser tratada com cuidado especial.

### 13.4 Scripts externos

O uso de scripts externos no gelocci.com.br deve ser minimizado e justificado.

---

## 14. Observabilidade e registro

Mesmo sendo uma ferramenta interna, o Gelocci Studio deve manter registros.

Inicialmente, os registros podem ser em Markdown.

Devem ser registrados:

- decisões arquiteturais;
- demandas relevantes;
- recomendações;
- aprovações;
- bloqueios;
- justificativas;
- releases;
- aprendizados.

No futuro, isso pode evoluir para banco de dados e dashboard.

---

## 15. Primeira versão desejada

A primeira versão prática do Gelocci Studio deve ser um auditor local do projeto gelocci.com.br.

Ela deve:

1. ler o repositório local;
2. identificar arquivos principais;
3. gerar um mapa do projeto;
4. resumir estrutura;
5. sugerir melhorias técnicas;
6. sugerir melhorias de produto;
7. sugerir melhorias de SEO;
8. sugerir melhorias de UX;
9. registrar recomendações em Markdown;
10. permitir que o Gerson use esse relatório como base de evolução.

Essa primeira versão não precisa alterar código automaticamente.

---

## 16. Direção futura

A direção futura do Gelocci Studio é se tornar uma equipe digital interna de apoio ao Gerson.

Ele deve evoluir para:

- propor melhorias;
- discutir alternativas;
- defender qualidade;
- evitar decisões ruins;
- apoiar implementação;
- revisar entregas;
- apoiar publicação;
- sugerir próximos passos;
- preservar a identidade e estratégia do ecossistema Gelocci.

O objetivo final não é substituir o Gerson, mas ampliar sua capacidade de criar, revisar e evoluir produtos digitais com qualidade profissional.
