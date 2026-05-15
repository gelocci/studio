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

### 4.3 Backend apenas quando necessário

Backend só deve ser usado quando houver necessidade real, como autenticação, persistência, pagamento, upload de arquivos, processamento server-side, integração privada, proteção de chaves ou geração de relatórios personalizados.

### 4.4 Separação entre público e avançado

O `www` deve concentrar páginas públicas, educativas e ferramentas abertas. Funcionalidades avançadas devem migrar para produtos próprios quando necessário.

### 4.5 Produto antes de tecnologia

A decisão tecnológica deve seguir o valor para o usuário. Não se deve adotar backend, framework ou banco apenas por entusiasmo técnico.

### 4.6 SEO e performance são requisitos arquiteturais

SEO e performance são requisitos centrais da arquitetura do `www`.

---

## 5. Estrutura funcional

```text
gelocci.com.br
│
├── Home
├── Hub de Ferramentas
├── Educação financeira
├── Landing pages
├── Páginas institucionais
└── Portas de entrada para produtos futuros
```

---

## 6. Camadas do www

| Camada | Responsabilidade |
|---|---|
| Conteúdo | Textos, explicações, páginas educativas, FAQs e materiais de apoio |
| Ferramentas | Calculadoras, simuladores e experiências interativas |
| Layout | Identidade visual, responsividade, cards, botões, formulários e gráficos |
| Build estático | Preparação dos arquivos finais publicados |
| Publicação | Deploy e entrega via GitHub, Netlify e Cloudflare |

Node.js deve ser ferramenta de build, não backend do site público.

---

## 7. Stack técnica

| Camada | Tecnologia |
|---|---|
| Marcação | HTML5 |
| Estilo | CSS |
| Interação | JavaScript puro |
| Build | Node.js |
| Hospedagem | Netlify |
| DNS/cache/proteção | Cloudflare |
| Versionamento | Git/GitHub |

---

## 8. Padrões de páginas

### 8.1 Home

A home deve explicar rapidamente o que é o Gelocci, quais problemas ele ajuda a resolver, quais ferramentas estão disponíveis, quais conteúdos existem e quais produtos avançados virão no futuro.

### 8.2 Página de ferramenta

Toda ferramenta deve conter título claro, explicação curta, formulário de entrada, resultado, explicação do cálculo, exemplos, FAQ, links relacionados e chamada para produto avançado quando fizer sentido.

### 8.3 Página educativa

Toda página educativa deve conter título direto, introdução clara, explicação por blocos, exemplos práticos, links para ferramentas relacionadas, FAQ e chamada para próximos conteúdos.

### 8.4 Landing page

Landing pages devem ter foco em conversão, com promessa principal, problema, solução, benefícios, demonstração, chamada para ação, FAQ e links relacionados.

---

## 9. Relação com o Hub de Ferramentas

O Hub de Ferramentas vive dentro do `www`, mas possui documentação própria em:

```text
docs/products/tools-hub/system-design.md
```

O Hub deve reunir calculadoras e simuladores, facilitar descoberta de ferramentas, conectar ferramentas a conteúdos educativos, criar caminhos para produtos avançados e preservar leveza.

---

## 10. Relação com produtos futuros

O `www` deve atuar como porta de entrada para produtos avançados, especialmente Asset Allocation, IR e INSS.

Funcionalidades com login, histórico, upload, relatórios ou cobrança devem migrar para produtos próprios.

---

## 11. SEO

Cada página deve considerar título claro, meta description, headings bem estruturados, URLs amigáveis, conteúdo indexável, links internos, textos explicativos, FAQ quando fizer sentido, performance e mobile.

Textos importantes devem estar no HTML e não depender exclusivamente de JavaScript.

---

## 12. Performance

O `www` deve priorizar CSS enxuto, JavaScript mínimo, imagens otimizadas, scripts externos minimizados, carregamento assíncrono quando necessário e build estático simples.

---

## 13. Responsividade e acessibilidade

O `www` deve funcionar bem em desktop, tablet e celular, com textos legíveis, botões clicáveis, formulários acessíveis, contraste adequado, labels nos campos e mensagens de erro compreensíveis.

---

## 14. Segurança e privacidade

O `www` deve evitar coleta desnecessária de dados, minimizar scripts externos, respeitar consentimento de cookies e não tratar uploads de documentos financeiros sem arquitetura adequada.

---

## 15. Publicação e versionamento

Fluxo preferencial:

```text
feature branch
  ↓
develop
  ↓
main
  ↓
deploy
```

O processo deve preservar commits claros, build validado, revisão antes de publicar, possibilidade de rollback e changelog quando relevante.

---

## 16. Relação com o Gelocci Studio

O Gelocci Studio deve apoiar o `www` em análise de estrutura, revisão de layout, SEO, ferramentas, cálculos, backlog, commits, publicação, conteúdo e oportunidades de produto.

Uma das responsabilidades do Studio é proteger a leveza e coerência do site público.

---

## 17. Riscos

| Risco | Mitigação |
|---|---|
| O www virar aplicação pesada | Manter regra de leveza e separar produtos avançados |
| Inconsistência visual | Criar diretrizes de layout e revisar páginas novas |
| Conteúdo financeiro impreciso | Revisar fórmulas, explicar premissas e usar agente financeiro |
| SEO fraco | Estruturar headings, conteúdo de apoio e links internos |
| Excesso de ferramentas sem estratégia | Manter roadmap e priorizar por valor |

---

## 18. Roadmap inicial

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

- O `www` é a raiz pública do ecossistema Gelocci.
- HTML5, CSS e JavaScript puro continuam sendo a base preferencial.
- O Hub de Ferramentas permanece inicialmente dentro do `www`.
- Produtos que exigirem login, banco, backend ou pagamento devem ser tratados como produtos próprios.
- O Gelocci Studio deve ajudar a evoluir o `www` sem comprometer sua simplicidade.
