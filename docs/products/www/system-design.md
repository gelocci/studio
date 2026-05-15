# System Design — www

## 1. Visão geral

O `www`, representado pelo site `gelocci.com.br`, é a raiz pública do ecossistema Gelocci.

Ele deve funcionar como a principal porta de entrada da marca, reunindo conteúdo educativo, ferramentas financeiras, simuladores, páginas de aquisição e links para produtos avançados da família Gelocci.

O `www` deve permanecer leve, rápido, público e preferencialmente estático. Sua prioridade é entregar valor imediato ao usuário com baixa fricção, boa experiência, excelente performance e forte potencial de SEO.

Produtos mais avançados, como Asset Allocation, IR avançado, INSS avançado ou áreas autenticadas, podem nascer a partir do `www`, mas devem ser separados em módulos ou subdomínios próprios quando exigirem backend, banco de dados, autenticação, pagamento ou processamento server-side.

---

## 2. Papel do www no ecossistema Gelocci

O `www` tem quatro papéis principais:

| Papel | Descrição |
|---|---|
| Presença pública | Representar a marca Gelocci na internet |
| Educação | Publicar conteúdos claros sobre finanças, investimentos e planejamento |
| Ferramentas | Disponibilizar calculadoras e simuladores financeiros públicos |
| Aquisição | Direcionar usuários para produtos avançados futuros, como Asset Allocation |

O `www` não deve ser tratado como uma aplicação pesada. Ele deve ser tratado como um hub público leve, com foco em utilidade, clareza e alcance orgânico.

---

## 3. Objetivos do www

O `www` deve:

- apresentar a marca Gelocci;
- explicar a proposta de valor do ecossistema;
- disponibilizar ferramentas financeiras gratuitas ou predominantemente gratuitas;
- publicar conteúdo educativo;
- ranquear bem em mecanismos de busca;
- funcionar bem em dispositivos móveis;
- carregar rapidamente;
- preservar uma experiência limpa e confiável;
- servir como porta de entrada para produtos comerciais futuros;
- manter baixo custo operacional;
- permitir evolução contínua com simplicidade.

---

## 4. Princípios de arquitetura

### 4.1 Leveza por padrão

O `www` deve ser leve por padrão.

A stack preferencial é:

- HTML5;
- CSS;
- JavaScript puro;
- Node.js apenas para build estático;
- Netlify;
- Cloudflare;
- GitHub.

Frameworks pesados, backend e banco de dados não devem ser adotados sem justificativa forte.

### 4.2 Execução no navegador sempre que possível

Cálculos, simulações e gráficos simples devem rodar diretamente no navegador.

Exemplos:

- juros compostos;
- equivalência de taxas;
- Black-Scholes;
- simulações simples;
- cálculos básicos de IR;
- cálculos financeiros sem dados sensíveis.

### 4.3 Backend apenas quando necessário

Backend só deve ser usado quando houver necessidade real, como:

- autenticação;
- persistência de dados em servidor;
- pagamento;
- upload de arquivos;
- leitura de PDFs ou documentos;
- processamento server-side;
- integração com APIs privadas;
- proteção de chaves ou regras sensíveis;
- geração de relatórios personalizados.

### 4.4 Separação entre público e avançado

O `www` deve concentrar páginas públicas, educativas e ferramentas abertas.

Funcionalidades avançadas devem migrar para produtos próprios quando necessário.

Exemplos:

- `asset.gelocci.com.br`;
- futuro produto de IR;
- futuro produto de INSS;
- área autenticada;
- plataforma de relatórios.

### 4.5 Produto antes de tecnologia

A decisão tecnológica deve seguir o valor para o usuário.

Não se deve adotar backend, framework ou banco apenas por entusiasmo técnico.

### 4.6 SEO e performance são requisitos arquiteturais

O `www` depende de alcance orgânico. Por isso, SEO e performance não são detalhes visuais; são requisitos centrais da arquitetura.

---

## 5. Estrutura funcional do www

A estrutura conceitual do `www` é:

```text
gelocci.com.br
│
├── Home
├── Hub de Ferramentas
│   ├── Juros compostos
│   ├── Equivalência de taxas
│   ├── Black-Scholes
│   ├── Simulador de aposentadoria
│   ├── Simulador INSS
│   └── Calculadora IR
│
├── Educação financeira
│   ├── Conceitos básicos
│   ├── Investimentos
│   ├── Renda fixa
│   ├── Renda variável
│   ├── Opções
│   ├── Previdência
│   └── Planejamento
│
├── Landing pages
│   ├── Asset Allocation
│   ├── IR
│   └── INSS
│
├── Páginas institucionais
│   ├── Sobre
│   ├── Privacidade
│   └── Termos
│
└── Portas de entrada para produtos futuros
```

---

## 6. Camadas do www

### 6.1 Conteúdo

Camada responsável por textos, explicações, páginas educativas, FAQs e materiais de apoio.

Deve priorizar:

- clareza;
- didática;
- linguagem acessível;
- responsabilidade financeira;
- boa estrutura semântica;
- potencial de SEO.

### 6.2 Ferramentas

Camada responsável por calculadoras e simuladores.

Deve priorizar:

- entrada simples de dados;
- validações claras;
- resultado compreensível;
- explicação das premissas;
- gráficos quando agregarem valor;
- ausência de login obrigatório;
- execução local no navegador.

### 6.3 Layout

Camada responsável por identidade visual, responsividade, cards, botões, formulários, gráficos, cabeçalho e rodapé.

Deve seguir diretrizes específicas em:

```text
docs/products/www/layout-guidelines.md
```

### 6.4 Build estático

Camada responsável por gerar a versão final publicada.

O build atual com Node.js deve continuar tendo papel limitado:

- montar header e footer;
- preparar arquivos estáticos;
- gerar pasta de publicação;
- evitar duplicação desnecessária.

Node.js deve ser ferramenta de build, não backend do site público.

### 6.5 Publicação

Camada responsável por deploy e entrega do site.

Stack preferencial:

- GitHub;
- Netlify;
- Cloudflare.

---

## 7. Stack técnica

### 7.1 Stack principal

| Camada | Tecnologia |
|---|---|
| Marcação | HTML5 |
| Estilo | CSS |
| Interação | JavaScript puro |
| Build | Node.js |
| Hospedagem | Netlify |
| DNS/cache/proteção | Cloudflare |
| Versionamento | Git/GitHub |

### 7.2 Bibliotecas permitidas

Bibliotecas externas podem ser usadas quando agregarem valor claro.

Exemplos aceitáveis:

- biblioteca de gráficos, quando necessária;
- bibliotecas pequenas e bem mantidas;
- utilitários específicos para cálculo ou visualização, quando justificados.

Toda dependência nova deve ser avaliada considerando:

- peso;
- manutenção;
- segurança;
- impacto na performance;
- necessidade real;
- possibilidade de fazer com JavaScript puro.

### 7.3 Tecnologias evitadas no www

Evitar no `www`, salvo justificativa forte:

- backend próprio;
- banco de dados;
- autenticação obrigatória;
- frameworks frontend pesados;
- renderização server-side complexa;
- dependências grandes para problemas simples;
- coleta excessiva de dados;
- scripts externos desnecessários.

---

## 8. Padrões de páginas

### 8.1 Home

A home deve explicar rapidamente:

- o que é o Gelocci;
- quais problemas ele ajuda a resolver;
- quais ferramentas estão disponíveis;
- quais conteúdos existem;
- quais produtos avançados virão no futuro.

A home deve ser visualmente forte, mas sem comprometer performance.

### 8.2 Página de ferramenta

Toda ferramenta deve seguir uma estrutura mínima:

1. título claro;
2. explicação curta;
3. formulário de entrada;
4. resultado;
5. explicação do cálculo;
6. exemplos de uso;
7. FAQ;
8. links relacionados;
9. chamada para produto avançado, quando fizer sentido.

### 8.3 Página educativa

Toda página educativa deve seguir uma estrutura mínima:

1. título direto;
2. introdução clara;
3. explicação por blocos;
4. exemplos práticos;
5. links para ferramentas relacionadas;
6. FAQ;
7. chamada para próximos conteúdos.

### 8.4 Landing page

Landing pages devem ter foco em conversão.

Estrutura sugerida:

1. promessa principal;
2. problema do usuário;
3. solução proposta;
4. benefícios;
5. demonstração ou exemplo;
6. chamada para ação;
7. FAQ;
8. links para ferramentas gratuitas relacionadas.

---

## 9. Hub de Ferramentas dentro do www

O Hub de Ferramentas vive dentro do `www`, mas possui documentação própria em:

```text
docs/products/tools-hub/system-design.md
```

No `www`, ele deve funcionar como uma área de alto valor para o usuário e alto potencial de SEO.

O Hub deve:

- reunir calculadoras e simuladores;
- facilitar descoberta de ferramentas;
- conectar ferramentas a conteúdos educativos;
- criar caminhos para produtos avançados;
- preservar leveza e execução no navegador.

---

## 10. Relação com produtos futuros

O `www` deve atuar como porta de entrada para produtos avançados.

### 10.1 Asset Allocation

O `www` pode conter:

- landing page do Asset Allocation;
- explicações sobre alocação de ativos;
- simulador público simples;
- conteúdo educativo;
- chamadas para `asset.gelocci.com.br`.

O produto completo deve ter documentação própria em:

```text
docs/products/asset-allocation/system-design.md
```

### 10.2 IR

O `www` pode conter:

- calculadora básica;
- conteúdo educativo;
- explicações sobre imposto em investimentos;
- chamadas para produto avançado futuro.

Funcionalidades com upload, histórico ou relatórios devem migrar para produto próprio.

### 10.3 INSS

O `www` pode conter:

- simulador simples;
- conteúdo educativo;
- explicações de regras;
- chamadas para produto avançado futuro.

Funcionalidades com leitura de CNIS, upload ou relatórios devem migrar para produto próprio.

---

## 11. SEO

SEO é um requisito central do `www`.

Cada página deve considerar:

- título claro;
- meta description;
- headings bem estruturados;
- URLs amigáveis;
- conteúdo indexável;
- links internos;
- textos explicativos;
- FAQ quando fizer sentido;
- performance;
- mobile;
- dados estruturados futuramente, se justificável.

### 11.1 Conteúdo indexável

Textos importantes devem estar no HTML e não depender exclusivamente de JavaScript.

### 11.2 Links internos

Ferramentas, artigos e landing pages devem estar conectados.

Exemplo:

```text
Artigo sobre juros compostos
  ↓
Calculadora de juros compostos
  ↓
Conteúdo sobre planejamento financeiro
  ↓
Produto futuro relacionado
```

### 11.3 Páginas de aquisição

As páginas do `www` devem preparar o usuário para produtos futuros, sem transformar o site em uma vitrine agressiva.

---

## 12. Performance

O `www` deve priorizar performance.

Boas práticas:

- CSS enxuto;
- JavaScript mínimo;
- imagens otimizadas;
- scripts externos minimizados;
- carregamento assíncrono quando necessário;
- evitar dependências grandes;
- evitar renderização bloqueante;
- manter build estático simples.

Critérios desejados:

- carregamento rápido em mobile;
- boa nota em ferramentas de performance;
- baixa dependência de rede externa;
- experiência fluida mesmo em conexões medianas.

---

## 13. Responsividade e acessibilidade

O `www` deve funcionar bem em:

- desktop;
- tablet;
- celular.

Requisitos mínimos:

- textos legíveis;
- botões clicáveis em mobile;
- formulários acessíveis;
- contraste adequado;
- navegação clara;
- labels nos campos;
- mensagens de erro compreensíveis;
- gráficos com apoio textual quando possível.

---

## 14. Segurança e privacidade

Mesmo sendo estático, o `www` deve seguir cuidados básicos.

### 14.1 Dados do usuário

Evitar coletar dados pessoais sem necessidade.

Quando usar armazenamento local, deixar claro quando fizer sentido.

### 14.2 Cookies e analytics

Cookies e analytics devem respeitar a política de privacidade e o consentimento do usuário.

### 14.3 Scripts externos

Todo script externo deve ser justificado.

Avaliar:

- finalidade;
- impacto de performance;
- privacidade;
- segurança;
- fornecedor;
- possibilidade de alternativa mais simples.

### 14.4 Uploads

Uploads de arquivos não devem ser tratados diretamente pelo `www` sem arquitetura adequada.

Se houver upload de documentos financeiros, isso deve ser feito em produto ou backend específico.

---

## 15. Publicação e versionamento

O fluxo preferencial é:

```text
feature branch
  ↓
develop
  ↓
main
  ↓
deploy
```

O processo deve preservar:

- commits claros;
- build validado;
- revisão antes de publicar;
- possibilidade de rollback;
- changelog quando relevante.

O Gelocci Studio deverá futuramente apoiar esse fluxo, mas a decisão de publicação continua sendo do Gerson.

---

## 16. Relação com o Gelocci Studio

O Gelocci Studio deve apoiar o `www` em:

- análise de estrutura;
- revisão de layout;
- revisão de SEO;
- revisão de ferramentas;
- revisão de cálculos;
- geração de backlog;
- apoio a commits;
- apoio a publicação;
- sugestão de conteúdo;
- identificação de oportunidades de produto.

O Studio não deve empurrar complexidade para o `www`.

Uma das responsabilidades do Studio é proteger a leveza e coerência do site público.

---

## 17. Riscos

### 17.1 Risco de o www virar aplicação pesada

Mitigação:

- manter regra de leveza;
- separar produtos avançados;
- revisar dependências;
- evitar backend desnecessário.

### 17.2 Risco de inconsistência visual

Mitigação:

- criar diretrizes de layout;
- padronizar componentes;
- revisar páginas novas;
- usar o Gelocci Studio para avaliação de UX/UI.

### 17.3 Risco de conteúdo financeiro impreciso

Mitigação:

- revisar fórmulas;
- explicar premissas;
- usar agente financeiro;
- evitar promessas indevidas.

### 17.4 Risco de SEO fraco

Mitigação:

- estruturar headings;
- criar conteúdo de apoio;
- conectar ferramentas e artigos;
- otimizar performance.

### 17.5 Risco de excesso de ferramentas sem estratégia

Mitigação:

- manter roadmap;
- priorizar ferramentas por valor;
- conectar ferramentas a objetivos do ecossistema.

---

## 18. Roadmap inicial do www

O roadmap detalhado ficará em:

```text
docs/products/www/roadmap.md
```

Direções iniciais:

1. fortalecer a home;
2. padronizar páginas de ferramentas;
3. melhorar Hub de Ferramentas;
4. melhorar páginas educativas;
5. revisar SEO;
6. melhorar responsividade;
7. criar chamadas para produtos futuros;
8. preparar base para Asset Allocation;
9. melhorar consistência visual;
10. manter performance.

---

## 19. Decisões iniciais

### 19.1 O www é a raiz pública

O `gelocci.com.br` é a principal entrada pública do ecossistema Gelocci.

### 19.2 O www deve permanecer leve

HTML5, CSS e JavaScript puro continuam sendo a base preferencial.

### 19.3 O Hub de Ferramentas permanece dentro do www

O Hub de Ferramentas deve aproveitar a leveza e o potencial de SEO do site público.

### 19.4 Produtos avançados devem ser separados

Produtos que exigirem login, banco, backend ou pagamento devem ser tratados como produtos próprios.

### 19.5 O Studio protege o www

O Gelocci Studio deve ajudar a evoluir o `www` sem comprometer sua simplicidade.

---

## 20. Direção futura

O `www` deve se consolidar como a raiz pública do ecossistema Gelocci.

Ele deve atrair usuários, educar, oferecer ferramentas úteis e preparar o caminho para produtos avançados.

A evolução do `www` deve ser contínua, mas controlada.

O objetivo não é transformar o site público em uma aplicação complexa. O objetivo é fazer dele uma base forte, rápida, confiável e estratégica para toda a família Gelocci.
