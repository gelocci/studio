# System Design — Ecossistema Gelocci

## 1. Visão geral

O ecossistema Gelocci é o guarda-chuva de produtos digitais, ferramentas financeiras, conteúdos educativos e plataformas internas criadas para apoiar educação financeira, simulações, planejamento, investimentos e evolução tecnológica dos produtos da marca.

O Gelocci não deve ser entendido apenas como o site `gelocci.com.br`. O site é a raiz pública da marca, mas o ecossistema pode conter outros produtos, módulos e plataformas, cada um com seu próprio propósito, arquitetura, system design, layout e roadmap.

A estrutura inicial do ecossistema é composta por:

- `gelocci.com.br`, como raiz pública da marca;
- Hub de Ferramentas, como conjunto de ferramentas financeiras públicas;
- Gelocci Studio, como plataforma interna de orquestração, desenvolvimento e evolução;
- Asset Allocation, como produto comercial futuro;
- possíveis produtos futuros, como IR, INSS, planejamento financeiro, relatórios e educação financeira avançada.

---

## 2. Objetivo do documento

Este documento define a visão arquitetural macro do ecossistema Gelocci.

Ele serve para orientar:

- separação entre produtos;
- relação entre site público, ferramentas e produtos avançados;
- princípios de arquitetura;
- regras de leveza do `www`;
- critérios para uso de backend;
- estratégia de subdomínios;
- documentação por produto;
- padrões de evolução;
- papel do Gelocci Studio no ecossistema.

Cada produto poderá ter seu próprio system design específico.

---

## 3. Estrutura conceitual do ecossistema

```text
Gelocci
│
├── www
│   └── Raiz pública da marca
│
├── Hub de Ferramentas
│   └── Ferramentas financeiras públicas dentro do www
│
├── Studio
│   └── Plataforma interna de orquestração, desenvolvimento e evolução
│
├── Asset Allocation
│   └── Produto futuro, provável subdomínio asset.gelocci.com.br
│
├── IR
│   └── Produto futuro para imposto de renda, notas de corretagem e relatórios
│
├── INSS
│   └── Produto futuro para simulação previdenciária e leitura de CNIS
│
└── Outros produtos futuros
```

---

## 4. Componentes principais

### 4.1 Gelocci

Gelocci é a marca e o guarda-chuva do ecossistema.

Ele representa a visão maior:

- educação financeira;
- ferramentas financeiras;
- planejamento;
- investimentos;
- simulações;
- produtos digitais;
- conteúdo;
- tecnologia aplicada à vida financeira.

O Gelocci deve preservar uma imagem de confiança, clareza, leveza, didática e qualidade técnica.

---

### 4.2 www

O `www`, representado pelo site `gelocci.com.br`, é a raiz pública da marca.

Ele deve ser:

- leve;
- rápido;
- estático sempre que possível;
- acessível;
- educativo;
- confiável;
- otimizado para SEO;
- simples de manter;
- orientado a aquisição de público.

A stack preferencial do `www` é:

- HTML5;
- CSS;
- JavaScript puro;
- Node.js apenas para build estático;
- Netlify;
- Cloudflare;
- GitHub.

O `www` deve evitar backend, banco de dados, frameworks pesados ou autenticação, salvo quando houver justificativa muito forte.

---

### 4.3 Hub de Ferramentas

O Hub de Ferramentas é uma área do `www` dedicada a ferramentas financeiras públicas.

Ele deve reunir calculadoras, simuladores e experiências interativas de uso gratuito ou predominantemente gratuito.

Exemplos de ferramentas:

- calculadora de juros compostos;
- conversor de taxas;
- simulador de aposentadoria;
- calculadora Black-Scholes;
- calculadora de IR;
- ferramentas educativas sobre investimentos;
- simuladores simples de planejamento financeiro.

O Hub de Ferramentas deve seguir as premissas do `www`:

- HTML;
- CSS;
- JavaScript puro;
- sem login obrigatório;
- execução preferencial no navegador;
- sem backend quando o cálculo puder ser feito localmente.

---

### 4.4 Gelocci Studio

O Gelocci Studio é a plataforma interna de orquestração, desenvolvimento e evolução do ecossistema.

Ele não é, inicialmente, um produto comercial. Seu papel é apoiar o Gerson na criação e evolução dos produtos Gelocci.

O Studio deve apoiar:

- análise de repositórios;
- geração de recomendações;
- discussão entre agentes;
- revisão de arquitetura;
- revisão de código;
- QA;
- segurança;
- SEO;
- produto;
- conteúdo;
- publicação;
- decisões técnicas;
- evolução contínua.

O Gelocci Studio possui seu próprio system design em:

```text
docs/studio/system-design.md
```

---

### 4.5 Asset Allocation

O Asset Allocation será um produto futuro da família Gelocci.

Seu objetivo será apoiar o usuário na construção, análise, balanceamento e acompanhamento de uma carteira de ativos.

Diferente do `www`, o Asset Allocation poderá exigir uma arquitetura mais robusta, pois tende a envolver:

- autenticação;
- persistência de carteiras;
- histórico de lançamentos;
- compra e venda de ativos;
- cálculo de alocação;
- rebalanceamento;
- relatórios;
- cobrança;
- backend;
- banco de dados;
- processamento server-side.

O subdomínio provável é:

```text
asset.gelocci.com.br
```

Esse produto deverá ter seu próprio system design em:

```text
docs/products/asset-allocation/system-design.md
```

---

### 4.6 IR

O produto ou módulo de IR poderá apoiar cálculos de imposto de renda, especialmente relacionados a investimentos.

Possibilidades futuras:

- importação de notas de corretagem;
- cálculo de preço médio;
- cálculo de lucro/prejuízo;
- apuração mensal;
- relatórios;
- consolidação anual;
- apoio à declaração;
- geração de informações para DARF ou declaração.

Esse tipo de produto provavelmente exigirá backend quando envolver upload, processamento de documentos, persistência ou relatórios personalizados.

---

### 4.7 INSS

O produto ou módulo de INSS poderá apoiar simulações previdenciárias.

Possibilidades futuras:

- simulação de aposentadoria;
- leitura de CNIS;
- cálculo de média salarial;
- cenários de contribuição;
- relatórios;
- planejamento previdenciário.

A versão simples pode viver no `www`, mas funcionalidades com upload de CNIS, histórico ou relatórios personalizados provavelmente exigirão backend.

---

## 5. Princípios do ecossistema

### 5.1 O Gelocci é o guarda-chuva

O Gelocci deve organizar produtos, ferramentas e conteúdos sob uma visão comum.

Cada produto pode ter autonomia técnica, mas deve respeitar princípios gerais de marca, qualidade, segurança, clareza e experiência.

### 5.2 O www deve permanecer leve

O `gelocci.com.br` deve continuar sendo a raiz pública leve da marca.

Ele não deve virar uma aplicação pesada apenas porque outros produtos do ecossistema exigem backend.

### 5.3 Produtos avançados podem ter arquitetura própria

Produtos como Asset Allocation, IR avançado ou INSS avançado podem exigir backend, autenticação, banco de dados, filas, APIs e pagamento.

Isso não contradiz a leveza do `www`, desde que esses produtos sejam separados adequadamente.

### 5.4 Cada produto deve ter system design próprio

Todo produto relevante deve possuir documentação própria.

Exemplos:

```text
docs/products/www/system-design.md
docs/products/tools-hub/system-design.md
docs/products/asset-allocation/system-design.md
docs/products/ir/system-design.md
docs/products/inss/system-design.md
```

### 5.5 O Studio apoia, mas não define sozinho

O Gelocci Studio deve apoiar a evolução dos produtos, mas a decisão final é sempre do Gerson.

### 5.6 Simplicidade por padrão

A solução mais simples que resolve bem o problema deve ser preferida.

Complexidade só deve ser adicionada quando houver justificativa funcional, técnica ou comercial.

### 5.7 Segurança e privacidade desde o início

Qualquer produto que trate dados financeiros, documentos, carteiras, simulações pessoais ou informações sensíveis deve considerar segurança e privacidade desde a concepção.

### 5.8 Clareza para o usuário

As ferramentas e produtos devem explicar conceitos financeiros de forma clara, responsável e acessível.

O usuário deve entender o que está sendo calculado, quais premissas foram usadas e quais limitações existem.

---

## 6. Estratégia de domínios e subdomínios

A estrutura provável de domínios será:

```text
gelocci.com.br
www.gelocci.com.br
asset.gelocci.com.br
ir.gelocci.com.br
inss.gelocci.com.br
studio.gelocci.com.br
```

### 6.1 gelocci.com.br / www.gelocci.com.br

Raiz pública da marca.

Deve conter:

- home;
- hub de ferramentas;
- educação financeira;
- páginas de aquisição;
- links para produtos avançados;
- conteúdo institucional;
- páginas de SEO.

### 6.2 asset.gelocci.com.br

Produto de Asset Allocation.

Deve conter:

- área autenticada;
- gestão de carteira;
- lançamentos;
- rebalanceamento;
- relatórios;
- possível cobrança.

### 6.3 ir.gelocci.com.br

Produto futuro para imposto de renda.

Pode nascer dentro do `www` em versão simples e depois migrar para subdomínio se houver necessidade.

### 6.4 inss.gelocci.com.br

Produto futuro para simulação previdenciária.

Pode nascer dentro do `www` em versão simples e depois migrar para subdomínio se houver necessidade.

### 6.5 studio.gelocci.com.br

Possível endereço futuro da ferramenta interna Gelocci Studio.

Por ser ferramenta interna, pode também permanecer apenas local ou restrita, sem exposição pública.

---

## 7. Critérios para usar backend

Backend só deve ser adotado quando houver necessidade real.

Critérios que justificam backend:

- autenticação;
- persistência de dados em servidor;
- pagamento;
- upload de arquivos;
- processamento de PDF ou documentos;
- integração com APIs privadas;
- cálculos pesados ou sensíveis;
- geração de relatórios server-side;
- proteção de regras ou chaves;
- necessidade de histórico entre dispositivos;
- área premium;
- multiusuário;
- auditoria;
- controle de permissões.

Critérios que não justificam backend sozinhos:

- cálculo simples que pode rodar no navegador;
- página educativa;
- landing page;
- formulário simples sem dados sensíveis;
- ferramenta pública sem login;
- visualização de gráfico simples;
- simulação local sem persistência.

---

## 8. Critérios para separar produto do www

Um módulo deve sair do `www` e virar produto separado quando apresentar uma ou mais destas características:

- precisa de login;
- precisa salvar dados do usuário;
- possui cobrança;
- manipula documentos;
- exige backend;
- tem roadmap próprio;
- possui identidade visual mais específica;
- tem fluxo de produto completo;
- exige segurança mais rigorosa;
- precisa escalar independentemente;
- tem potencial comercial relevante.

O Asset Allocation se enquadra nessa categoria.

---

## 9. Relação entre hub público e produtos comerciais

O `www` e o Hub de Ferramentas podem funcionar como porta de entrada para produtos comerciais.

Exemplos:

- uma calculadora simples de carteira pode apontar para o Asset Allocation;
- uma calculadora simples de IR pode apontar para o produto de IR avançado;
- um simulador básico de INSS pode apontar para um produto previdenciário mais completo;
- artigos educativos podem conduzir o usuário para ferramentas relacionadas.

A regra é:

```text
O conteúdo público educa e atrai.
As ferramentas gratuitas geram valor imediato.
Os produtos avançados resolvem problemas mais completos.
```

---

## 10. Organização da documentação

A documentação do ecossistema deve ficar no repositório `gelocci-studio`, pois ele funciona como centro de governança, arquitetura e evolução.

Estrutura recomendada:

```text
docs/
│
├── studio/
│   ├── conceito.md
│   ├── system-design.md
│   ├── roadmap.md
│   └── decisoes-arquiteturais.md
│
├── ecosystem/
│   ├── system-design.md
│   ├── principios-arquitetura.md
│   ├── diretrizes-documentacao.md
│   ├── identidade-visual.md
│   └── roadmap.md
│
├── products/
│   ├── www/
│   │   ├── system-design.md
│   │   ├── layout-guidelines.md
│   │   └── roadmap.md
│   │
│   ├── tools-hub/
│   │   ├── system-design.md
│   │   ├── layout-guidelines.md
│   │   └── roadmap.md
│   │
│   ├── asset-allocation/
│   │   ├── system-design.md
│   │   ├── layout-guidelines.md
│   │   └── roadmap.md
│   │
│   ├── ir/
│   │   ├── system-design.md
│   │   └── roadmap.md
│   │
│   └── inss/
│       ├── system-design.md
│       └── roadmap.md
```

---

## 11. Padrão de idioma e nomenclatura

### 11.1 Idioma

A documentação do ecossistema Gelocci deve ser escrita em português do Brasil.

Termos técnicos consolidados em inglês podem ser mantidos quando fizerem mais sentido, como:

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

### 11.2 Nomes de arquivos

Os nomes de arquivos devem usar kebab-case ou nomes simples por contexto.

Como o contexto já vem da pasta, não é necessário prefixar tudo com `gelocci`.

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

### 11.3 Nomes oficiais

Alguns nomes devem ser preservados:

- Gelocci;
- Gelocci Studio;
- Studio Lead;
- Asset Allocation;
- Hub de Ferramentas.

---

## 12. Padrões de layout e identidade

Cada produto poderá ter seu próprio layout, mas deve respeitar uma identidade comum da família Gelocci.

Princípios gerais:

- visual limpo;
- boa hierarquia;
- leitura fácil;
- aparência profissional;
- foco em confiança;
- uso consciente de cores;
- responsividade;
- acessibilidade;
- consistência entre páginas;
- clareza nas chamadas para ação.

O `www` deve ser mais leve e editorial.

O Asset Allocation poderá ter aparência mais próxima de produto SaaS, com dashboard, cards, gráficos e área autenticada.

O Studio poderá ter aparência mais operacional, voltada a produtividade, agentes e fluxo de trabalho.

---

## 13. Segurança e privacidade no ecossistema

A segurança deve ser proporcional ao risco de cada produto.

### 13.1 www e Hub de Ferramentas

Riscos menores, pois devem evitar dados sensíveis e processamento em servidor.

Cuidados:

- minimizar scripts externos;
- evitar coleta desnecessária;
- informar uso de cookies;
- não armazenar dados sensíveis sem necessidade;
- manter dependências sob controle.

### 13.2 Produtos comerciais

Riscos maiores.

Cuidados:

- autenticação segura;
- proteção de dados pessoais;
- criptografia quando aplicável;
- controle de acesso;
- logs sem dados sensíveis;
- backup;
- segregação de ambiente;
- política clara de privacidade;
- tratamento cuidadoso de documentos financeiros.

### 13.3 Studio

Por lidar com repositórios, código e decisões, o Studio deve proteger:

- tokens;
- chaves de API;
- repositórios privados;
- prompts internos;
- histórico de decisões;
- logs de execução;
- integrações com Git e LLM.

---

## 14. Roadmap macro do ecossistema

### Fase 1 — Organização

- definir Gelocci como guarda-chuva;
- documentar o ecossistema;
- organizar system designs;
- separar Studio, www, Hub de Ferramentas e produtos futuros;
- definir padrões de documentação.

### Fase 2 — Fortalecimento do www

- melhorar home;
- melhorar Hub de Ferramentas;
- reforçar SEO;
- melhorar identidade visual;
- criar trilhas educativas;
- melhorar chamadas para produtos futuros.

### Fase 3 — Evolução do Hub de Ferramentas

- padronizar calculadoras;
- melhorar experiência mobile;
- melhorar explicações;
- criar links entre ferramentas e conteúdos;
- criar páginas de apoio educativo.

### Fase 4 — Primeira versão do Asset Allocation

- definir system design específico;
- definir MVP;
- criar landing;
- criar fluxo inicial de carteira;
- validar proposta de valor;
- decidir arquitetura técnica.

### Fase 5 — Produtos avançados

- avaliar IR;
- avaliar INSS;
- avaliar relatórios;
- avaliar áreas autenticadas;
- avaliar cobrança.

### Fase 6 — Integração com Gelocci Studio

- usar agentes para revisar produtos;
- gerar backlog;
- apoiar desenvolvimento;
- revisar segurança;
- apoiar publicação;
- sugerir conteúdo e SEO.

---

## 15. Decisões arquiteturais iniciais

### 15.1 O Gelocci é o guarda-chuva

O Gelocci representa a marca e o ecossistema, não apenas o site público.

### 15.2 O www é a raiz pública

O `gelocci.com.br` deve continuar sendo a principal entrada pública da marca.

### 15.3 O Hub de Ferramentas vive dentro do www

O Hub de Ferramentas deve permanecer inicialmente dentro do `www`, aproveitando leveza, SEO e acesso gratuito.

### 15.4 O Studio é interno

O Gelocci Studio é ferramenta interna de evolução, não produto comercial inicial.

### 15.5 O Asset Allocation será produto separado

O Asset Allocation deve ser tratado como produto próprio, provavelmente em subdomínio, com arquitetura específica.

### 15.6 Cada produto relevante terá documentação própria

Nenhum produto deve crescer sem system design, roadmap e diretrizes mínimas.

---

## 16. Direção futura

A direção futura do ecossistema Gelocci é crescer de forma organizada, mantendo uma base pública leve e criando produtos avançados apenas quando houver valor claro.

O `www` deve atrair, educar e oferecer ferramentas úteis.

Os produtos avançados devem resolver problemas mais completos.

O Gelocci Studio deve apoiar a evolução contínua de tudo isso, funcionando como a equipe digital interna do Gerson.
