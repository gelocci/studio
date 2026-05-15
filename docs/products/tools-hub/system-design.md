# System Design — Hub de Ferramentas

## 1. Visão geral

O Hub de Ferramentas é a área do `gelocci.com.br` dedicada a calculadoras, simuladores e experiências interativas de educação financeira.

Ele deve ser um dos principais motores de valor do `www`, oferecendo ferramentas úteis, rápidas, gratuitas ou predominantemente gratuitas, com forte potencial de SEO e boa experiência em dispositivos móveis.

O Hub de Ferramentas pertence ao `www`, mas possui system design próprio porque concentra regras, padrões e decisões específicas para ferramentas financeiras.

---

## 2. Papel no ecossistema Gelocci

O Hub de Ferramentas deve cumprir quatro papéis:

| Papel | Descrição |
|---|---|
| Utilidade imediata | Resolver dúvidas e cálculos financeiros rapidamente |
| Educação prática | Ensinar conceitos por meio de simulações |
| Aquisição | Atrair usuários pelo Google e redes sociais |
| Ponte para produtos futuros | Direcionar usuários para Asset Allocation, IR, INSS e outros produtos avançados |

---

## 3. Ferramentas atuais e candidatas

Ferramentas atuais ou já discutidas:

- calculadora de juros compostos;
- equivalência de taxas;
- Black-Scholes;
- simulador de aposentadoria;
- simulador INSS;
- calculadora IR.

Ferramentas candidatas futuras:

- simulador simples de Asset Allocation;
- simulador de renda passiva;
- comparação entre CDI, IPCA, Ibovespa e carteira;
- simulador de aportes;
- simulador de rebalanceamento;
- calculadora de preço médio;
- calculadora de DARF básica;
- simulador de independência financeira.

---

## 4. Princípios de arquitetura

### 4.1 Execução local no navegador

Toda ferramenta deve rodar no navegador sempre que tecnicamente possível.

### 4.2 Sem login obrigatório

Ferramentas públicas não devem exigir login.

### 4.3 Sem backend para cálculo simples

Cálculos financeiros simples ou moderados devem ser implementados em JavaScript puro.

### 4.4 Clareza antes de sofisticação

A ferramenta deve explicar o resultado de forma clara. Não basta calcular.

### 4.5 Fórmulas revisáveis

Toda ferramenta com cálculo financeiro deve ter fórmulas claras, revisáveis e, quando possível, documentadas.

### 4.6 Caminho para produto avançado

Ferramentas públicas podem apontar para produtos avançados quando houver relação natural, mas sem prejudicar a experiência gratuita.

---

## 5. Estrutura padrão de uma ferramenta

Toda ferramenta deve seguir uma estrutura mínima:

```text
Título
Descrição curta
Formulário de entrada
Botão de cálculo
Resultado principal
Resultados complementares
Gráfico, se agregar valor
Explicação do cálculo
Exemplo prático
FAQ
Links relacionados
Chamada para produto avançado, quando fizer sentido
```

---

## 6. Entrada de dados

Campos devem ser:

- claros;
- bem rotulados;
- validados;
- amigáveis em mobile;
- acompanhados de mensagens de erro compreensíveis.

Exemplos de boas práticas:

- usar labels explícitos;
- informar unidade do campo;
- evitar placeholder como única explicação;
- limitar valores inválidos;
- aceitar casas decimais quando fizer sentido;
- explicar campos financeiros menos óbvios.

---

## 7. Resultado

O resultado deve ser mais do que um número.

Ele deve incluir:

- resultado principal destacado;
- interpretação em linguagem simples;
- detalhes do cálculo;
- premissas utilizadas;
- alertas de limitação;
- próximos passos relacionados.

---

## 8. Gráficos

Gráficos devem ser usados quando facilitarem entendimento.

Critérios:

- não usar gráfico por enfeite;
- manter legibilidade em mobile;
- garantir contraste em tema claro e escuro;
- explicar o gráfico em texto;
- não depender somente de cor para transmitir informação.

---

## 9. Explicação e educação

Cada ferramenta deve ensinar o usuário.

A ferramenta deve responder:

- o que está sendo calculado;
- para que serve;
- quais premissas foram usadas;
- quais limitações existem;
- como interpretar o resultado;
- quais conteúdos relacionados podem ajudar.

---

## 10. SEO

Cada ferramenta deve ser tratada como página de aquisição.

Requisitos:

- título claro;
- meta description;
- headings bem estruturados;
- conteúdo indexável;
- FAQ;
- links internos;
- texto de apoio;
- URL amigável;
- performance boa;
- mobile excelente.

---

## 11. UX/UI

O Hub deve ter aparência consistente com o `www`.

Diretrizes gerais:

- layout limpo;
- formulário organizado;
- resultado bem destacado;
- cards para informações complementares;
- botões claros;
- espaçamento adequado;
- mobile first;
- pouca poluição visual.

Diretrizes específicas de layout ficarão em:

```text
docs/products/tools-hub/layout-guidelines.md
```

---

## 12. Segurança e privacidade

Ferramentas públicas devem evitar dados sensíveis.

Quando houver dados inseridos pelo usuário:

- processar localmente quando possível;
- não enviar para servidor sem necessidade;
- não armazenar sem clareza;
- evitar coleta desnecessária;
- não manipular documentos financeiros no `www` sem arquitetura própria.

---

## 13. Relação com produtos futuros

### 13.1 Asset Allocation

Ferramentas simples de carteira, alocação e rebalanceamento podem servir como entrada para o produto Asset Allocation.

### 13.2 IR

Calculadoras básicas podem servir como entrada para produto avançado de imposto de renda.

### 13.3 INSS

Simulações simples podem servir como entrada para produto previdenciário mais completo.

A regra é:

```text
Ferramenta pública resolve uma dúvida.
Produto avançado resolve uma jornada completa.
```

---

## 14. Relação com o Gelocci Studio

O Gelocci Studio deve apoiar o Hub em:

- revisão de fórmulas;
- padronização visual;
- avaliação de SEO;
- testes de regressão;
- validação de responsividade;
- sugestão de novas ferramentas;
- priorização do roadmap;
- revisão de mensagens e explicações.

---

## 15. Riscos

| Risco | Mitigação |
|---|---|
| Cálculo errado | Revisão pelo agente financeiro e testes com cenários conhecidos |
| Ferramentas inconsistentes | Padrões de layout e estrutura |
| Páginas pobres para SEO | Conteúdo explicativo, FAQ e links internos |
| Excesso de scripts | Preferir JavaScript puro e dependências pequenas |
| Resultado confuso | Explicação em linguagem simples |
| Ferramenta sem propósito | Priorizar por valor para o usuário |

---

## 16. Roadmap inicial

O roadmap detalhado ficará em:

```text
docs/products/tools-hub/roadmap.md
```

Direções iniciais:

1. padronizar estrutura das ferramentas existentes;
2. revisar fórmulas e premissas;
3. melhorar mensagens de erro;
4. melhorar resultados e explicações;
5. reforçar SEO;
6. melhorar gráficos;
7. conectar ferramentas a conteúdos educativos;
8. criar chamadas naturais para produtos futuros;
9. definir novas ferramentas prioritárias;
10. preparar base para simulador público de Asset Allocation.

---

## 17. Decisões iniciais

- O Hub de Ferramentas fica inicialmente dentro do `www`.
- Ferramentas públicas devem rodar no navegador sempre que possível.
- JavaScript puro é a base preferencial.
- Backend só entra para upload, persistência, autenticação, pagamento ou processamento pesado.
- Cada ferramenta deve educar, não apenas calcular.
- O Hub deve ser uma ponte natural para produtos avançados.
