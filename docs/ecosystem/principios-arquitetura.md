# Princípios de Arquitetura — Ecossistema Gelocci

## 1. Objetivo

Este documento define os princípios de arquitetura que devem orientar a evolução do ecossistema Gelocci.

Ele serve como referência para decisões técnicas, produto, UX, segurança e evolução dos projetos.

---

## 2. Princípios centrais

### 2.1 Simplicidade por padrão

A solução mais simples que resolve bem o problema deve ser preferida.

Complexidade só deve ser adicionada quando houver justificativa real.

---

### 2.2 Produto antes de tecnologia

A tecnologia deve servir ao produto e ao usuário.

Não se deve escolher stack, framework, banco ou backend apenas por entusiasmo técnico.

---

### 2.3 O www deve permanecer leve

O `gelocci.com.br` deve continuar sendo a raiz pública leve do ecossistema.

Stack preferencial:

- HTML5;
- CSS;
- JavaScript puro;
- Node.js apenas para build estático;
- Netlify;
- Cloudflare;
- GitHub.

Backend só deve ser usado no `www` quando houver justificativa forte.

---

### 2.4 Produtos avançados podem ter arquitetura própria

A regra de leveza do `www` não impede que produtos avançados usem backend, banco, autenticação, pagamento e processamento server-side.

Exemplos:

- Asset Allocation;
- IR avançado;
- INSS avançado;
- relatórios;
- áreas autenticadas.

---

### 2.5 Separação entre hub público e produtos avançados

O hub público deve educar, atrair e oferecer ferramentas simples.

Produtos avançados devem resolver jornadas mais completas.

Regra:

```text
O conteúdo público educa e atrai.
As ferramentas gratuitas geram valor imediato.
Os produtos avançados resolvem problemas mais completos.
```

---

### 2.6 Evolução incremental

Evitar construir grandes plataformas antes de validar valor.

Preferir:

1. versão simples;
2. validação;
3. melhoria;
4. expansão;
5. automação.

---

### 2.7 Segurança e privacidade desde a concepção

Qualquer produto que lide com dados financeiros, documentos, login, carteiras ou pagamento deve considerar segurança desde o início.

Segurança não deve ser tratada apenas no final.

---

### 2.8 Clareza para o usuário

Ferramentas financeiras devem explicar:

- o que calculam;
- quais premissas usam;
- como interpretar o resultado;
- quais limitações existem.

---

### 2.9 Cálculo financeiro precisa de revisão

Toda fórmula financeira relevante deve ser revisada pelo agente Financeiro e validada com casos de teste.

---

### 2.10 SEO e performance são requisitos do www

No `www`, SEO e performance são requisitos arquiteturais.

Não são detalhes finais.

---

## 3. Princípios de tecnologia

### 3.1 Dependências devem ser justificadas

Toda dependência nova deve ser avaliada por:

- necessidade;
- peso;
- manutenção;
- segurança;
- impacto na performance;
- alternativa simples.

---

### 3.2 Backend só com motivo claro

Backend é justificado por:

- autenticação;
- persistência em servidor;
- pagamento;
- upload;
- processamento pesado;
- integração privada;
- proteção de chaves;
- relatórios server-side;
- histórico entre dispositivos.

Backend não é justificado por:

- cálculo simples;
- página educativa;
- landing page;
- simulação local;
- gráfico simples;
- formulário sem dado sensível.

---

### 3.3 Evitar acoplamento entre produtos

Cada produto deve ter autonomia suficiente para evoluir sem quebrar os demais.

O `www` não deve carregar complexidade do Asset Allocation.

O Studio não deve contaminar a arquitetura do `www`.

---

### 3.4 Documentar decisões importantes

Decisões arquiteturais relevantes devem ser registradas.

Exemplos:

- adoção de backend;
- criação de subdomínio;
- mudança de stack;
- dependência importante;
- alteração no fluxo de publicação;
- mudança de modelo de dados.

---

## 4. Princípios de experiência

### 4.1 Clareza antes de sofisticação visual

A experiência deve ser bonita, mas antes precisa ser compreensível.

### 4.2 Mobile importa

Ferramentas e páginas públicas devem funcionar bem em celular.

### 4.3 Resultado deve ser interpretável

Calculadoras e simuladores devem explicar o resultado.

### 4.4 CTAs devem ser naturais

Chamadas para produtos futuros devem surgir de forma coerente, sem prejudicar a experiência gratuita.

---

## 5. Princípios de evolução do Studio

### 5.1 O Studio é ferramenta interna

O Gelocci Studio não nasce como produto comercial.

Ele existe para ampliar a capacidade do Gerson de construir e evoluir o ecossistema.

### 5.2 Agentes colaboram

Agentes devem buscar a melhor solução juntos, considerando conflitos entre arquitetura, produto, UX, SEO, segurança, finanças e DevOps.

### 5.3 Human-in-the-loop

O Gerson mantém decisão final.

O Studio pode sugerir, revisar e bloquear tecnicamente, mas não deve publicar ou aplicar mudanças relevantes sem aprovação.

### 5.4 Automação gradual

Antes de automatizar branches, PRs e deploy, o Studio deve amadurecer os fluxos manuais e assistidos.

---

## 6. Princípios de monetização futura

### 6.1 Monetização não deve prejudicar confiança

Produtos comerciais devem preservar transparência e responsabilidade.

### 6.2 O gratuito deve gerar valor real

Ferramentas públicas não devem ser falsas iscas.

Elas devem resolver problemas reais.

### 6.3 Produtos pagos devem resolver jornadas completas

A monetização deve estar associada a valor adicional claro, como:

- persistência;
- relatórios;
- histórico;
- automação;
- análises avançadas;
- importação;
- personalização.

---

## 7. Decisão orientadora

Quando houver dúvida, usar a pergunta:

```text
Esta solução deixa o ecossistema Gelocci mais útil, claro, confiável e sustentável?
```

Se a resposta não for clara, a solução precisa ser repensada.
