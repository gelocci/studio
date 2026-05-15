# System Design — Asset Allocation

## 1. Visão geral

O Asset Allocation será um produto futuro da família Gelocci, voltado à construção, análise, balanceamento e acompanhamento de carteiras de ativos.

Diferente do `www` e do Hub de Ferramentas, o Asset Allocation tem potencial comercial claro e poderá exigir arquitetura própria, com backend, banco de dados, autenticação, persistência, relatórios e pagamento.

O produto deve nascer conectado ao ecossistema Gelocci, mas separado o suficiente para evoluir como aplicação própria.

Subdomínio provável:

```text
asset.gelocci.com.br
```

---

## 2. Proposta de valor

O Asset Allocation deve ajudar o usuário a responder perguntas como:

- minha carteira está bem diversificada?
- estou concentrado demais em um ativo ou classe?
- qual é minha alocação atual?
- qual seria minha alocação alvo?
- o que preciso comprar ou vender para rebalancear?
- minha carteira está coerente com meu perfil e objetivos?
- como minha carteira se comporta frente a benchmarks?

A proposta central é:

```text
Ajudar o investidor a sair do improviso e organizar sua carteira com visão de alocação, risco, retorno e rebalanceamento.
```

---

## 3. Público-alvo

Público inicial:

- investidores pessoa física;
- investidores iniciantes e intermediários;
- pessoas que já possuem alguns ativos;
- usuários que querem organizar carteira;
- usuários interessados em renda passiva;
- usuários que buscam disciplina de rebalanceamento.

O produto não deve prometer recomendação personalizada de investimento sem estrutura regulatória adequada.

Ele deve atuar como ferramenta de organização, simulação e educação.

---

## 4. Relação com o ecossistema Gelocci

O Asset Allocation se relaciona com:

| Componente | Relação |
|---|---|
| www | Porta de entrada, landing pages, conteúdos educativos e simulador simples |
| Hub de Ferramentas | Ferramentas públicas relacionadas a carteira e rebalanceamento |
| Studio | Apoio à evolução, revisão, produto, UX, segurança e publicação |
| Produtos futuros | Pode se conectar a IR, relatórios e planejamento financeiro |

---

## 5. MVP proposto

O MVP deve ser pequeno, mas com valor real.

### 5.1 MVP público inicial

Pode nascer no `www` ou como landing simples:

- explicação sobre asset allocation;
- simulador simples de alocação;
- cadastro manual de percentuais;
- visualização por classe de ativos;
- sugestão educativa de rebalanceamento;
- sem login;
- sem persistência no servidor.

### 5.2 MVP produto

Primeira versão como produto próprio:

- cadastro/login;
- criação de carteira;
- cadastro de ativos;
- lançamentos de compra e venda;
- cálculo de posição atual;
- definição de alocação alvo;
- cálculo de diferença entre alocação atual e alvo;
- sugestão de rebalanceamento;
- dashboard simples;
- persistência em banco.

---

## 6. Funcionalidades principais

### 6.1 Carteira

O usuário deve poder criar uma ou mais carteiras.

Cada carteira deve conter:

- nome;
- objetivo;
- moeda;
- data de criação;
- classes de ativos;
- ativos;
- alocação alvo;
- posição atual.

### 6.2 Lançamentos

O produto deve trabalhar com lançamentos, não apenas cadastro estático de ativos.

Tipos iniciais:

- compra;
- venda;
- provento, futuro;
- aporte, futuro;
- retirada, futuro.

Campos possíveis:

- data;
- ativo;
- tipo;
- quantidade;
- preço;
- custos;
- observação.

### 6.3 Ativos

O produto deve permitir ativos como:

- renda fixa;
- ações;
- fundos imobiliários;
- ETFs;
- fundos;
- caixa;
- ativos internacionais;
- cripto, se decidido no futuro;
- outros.

Observação importante:

Fundos imobiliários devem ser tratados como renda variável, não como categoria separada equivalente a renda fixa e renda variável. Eles podem ser uma subclasse dentro de renda variável ou uma classe específica dentro de ativos de risco, desde que a comunicação seja clara.

### 6.4 Classes de ativos

A modelagem deve permitir classes e subclasses.

Exemplo:

```text
Renda fixa
  ├── Pós-fixado
  ├── Prefixado
  └── IPCA+

Renda variável
  ├── Ações
  ├── Fundos imobiliários
  └── ETFs

Internacional
  ├── ETFs globais
  └── Ações internacionais

Alternativos
  └── Outros
```

### 6.5 Alocação alvo

O usuário deve poder definir percentuais alvo por classe, subclasse ou ativo.

### 6.6 Rebalanceamento

O sistema deve comparar:

```text
alocação atual
vs
alocação alvo
```

E indicar:

- excesso;
- falta;
- percentual atual;
- percentual alvo;
- diferença;
- valor financeiro a ajustar.

### 6.7 Dashboard

O dashboard deve exibir:

- valor total da carteira;
- distribuição por classe;
- distribuição por ativo;
- divergência da alocação alvo;
- próximos ajustes sugeridos;
- evolução, futuro;
- risco e retorno, futuro.

### 6.8 Relatórios

Relatórios futuros:

- carteira atual;
- rebalanceamento;
- evolução patrimonial;
- consolidação por classe;
- relatório para apoio ao IR;
- histórico de operações.

---

## 7. Arquitetura técnica esperada

Diferente do `www`, o Asset Allocation provavelmente exigirá backend.

### 7.1 Frontend

Opções:

- HTML/CSS/JS para protótipos públicos simples;
- React/Next.js para produto autenticado e dashboard mais rico.

Recomendação:

- protótipo público simples pode ser HTML/CSS/JS;
- produto autenticado provavelmente deve usar React/Next.js.

### 7.2 Backend

Opções:

- Node.js/TypeScript;
- Java/Spring Boot;
- outro backend se houver justificativa.

Recomendação inicial:

- Node.js/TypeScript, por coerência com o Studio e com o ecossistema JavaScript.

### 7.3 Banco de dados

Opções:

- PostgreSQL;
- SQLite para protótipo local;
- banco gerenciado em fase produtiva.

Recomendação:

- PostgreSQL para produto real.

### 7.4 Autenticação

Opções:

- autenticação própria;
- provedor externo;
- login social, futuro.

Recomendação:

- começar simples, mas com segurança;
- avaliar provedor gerenciado se acelerar o produto.

### 7.5 Pagamento

Opções futuras:

- Mercado Pago;
- Stripe;
- Asaas;
- Pagar.me;
- Iugu.

A escolha dependerá do modelo comercial e público-alvo.

---

## 8. Modelo de dados conceitual

Entidades iniciais:

```text
user
portfolio
asset
asset_class
asset_subclass
transaction
position
target_allocation
rebalance_suggestion
report
subscription
```

### 8.1 user

Representa o usuário autenticado.

### 8.2 portfolio

Representa uma carteira do usuário.

### 8.3 asset

Representa um ativo.

### 8.4 transaction

Representa uma movimentação de compra, venda ou outro evento.

### 8.5 position

Representa a posição consolidada por ativo.

### 8.6 target_allocation

Representa a alocação alvo definida pelo usuário.

### 8.7 rebalance_suggestion

Representa a sugestão calculada para aproximar carteira atual da alocação alvo.

---

## 9. Monetização

Possíveis modelos:

### 9.1 Gratuito

- simulador simples;
- carteira manual limitada;
- conteúdo educativo;
- visualização básica.

### 9.2 Premium

- carteiras múltiplas;
- histórico completo;
- relatórios;
- rebalanceamento avançado;
- importação de dados;
- benchmarks;
- alertas;
- exportações.

### 9.3 Avulso

- relatório único;
- diagnóstico de carteira;
- simulação avançada.

### 9.4 Assinatura

- plano mensal;
- plano anual;
- funcionalidades premium.

---

## 10. Segurança e privacidade

O Asset Allocation terá mais responsabilidade que o `www`, pois poderá armazenar dados financeiros do usuário.

Cuidados obrigatórios:

- autenticação segura;
- proteção de dados pessoais;
- senhas protegidas;
- logs sem dados sensíveis;
- backup;
- controle de acesso;
- política de privacidade clara;
- cuidado com exportações;
- cuidado com integrações externas.

---

## 11. Relação com regulação e comunicação

O produto deve evitar linguagem que pareça recomendação personalizada de investimento sem contexto adequado.

A comunicação deve deixar claro:

- que a ferramenta apoia organização e simulação;
- que resultados dependem das premissas informadas;
- que não há garantia de retorno;
- que o usuário deve avaliar decisões com responsabilidade.

---

## 12. UX/UI

O Asset Allocation deve ter experiência mais parecida com produto SaaS.

Telas esperadas:

- landing page;
- cadastro/login;
- onboarding;
- dashboard;
- carteira;
- lançamentos;
- alocação alvo;
- rebalanceamento;
- relatórios;
- configurações.

Diretrizes específicas ficarão em:

```text
docs/products/asset-allocation/layout-guidelines.md
```

---

## 13. Relação com o Gelocci Studio

O Gelocci Studio deve apoiar o Asset Allocation em:

- definição de MVP;
- revisão de arquitetura;
- revisão de UX;
- revisão de regras financeiras;
- segurança;
- roadmap;
- backlog;
- testes;
- publicação;
- conteúdo educativo;
- landing pages;
- monetização.

---

## 14. Riscos

| Risco | Mitigação |
|---|---|
| Produto ficar complexo demais cedo | MVP pequeno e incremental |
| Parecer recomendação de investimento | Comunicação cuidadosa e foco em simulação |
| Modelagem ruim de ativos | Classes e subclasses flexíveis |
| Dados financeiros sensíveis | Segurança e privacidade desde o início |
| Monetização prematura | Validar valor antes de cobrar |
| Dashboard bonito mas inútil | Priorizar decisões práticas do usuário |

---

## 15. Roadmap inicial

O roadmap detalhado ficará em:

```text
docs/products/asset-allocation/roadmap.md
```

Direções iniciais:

1. criar landing page;
2. criar simulador público simples;
3. validar proposta de valor;
4. definir MVP autenticado;
5. modelar carteira e lançamentos;
6. implementar alocação alvo;
7. implementar rebalanceamento;
8. criar dashboard;
9. avaliar monetização;
10. evoluir para relatórios.

---

## 16. Decisões iniciais

- Asset Allocation será tratado como produto próprio.
- O subdomínio provável é `asset.gelocci.com.br`.
- O produto poderá ser comercial.
- O produto poderá usar backend, banco, autenticação e pagamento.
- O produto deve nascer conectado ao `www`, mas não preso à arquitetura estática do `www`.
- Fundos imobiliários devem ser tratados com clareza como ativos de risco/renda variável, não como renda fixa.
- O MVP deve validar valor antes de sofisticar a arquitetura.
