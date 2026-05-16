# Layout Guidelines — www

## 1. Objetivo

Este documento define as diretrizes visuais do `www`, representado pelo site `gelocci.com.br`, com base no design system e nos CSS existentes.

O `www` deve continuar sendo a raiz pública do ecossistema Gelocci: leve, rápido, editorial, educativo e visualmente consistente.

---

## 2. Base visual obrigatória

Novas páginas do `www` devem usar a base visual existente:

- `base.css`;
- `theme.css`;
- CSS específico da página;
- tokens CSS em `:root`;
- suporte a `html.light-mode`;
- fontes Playfair Display e Outfit;
- header e footer compartilhados.

Evitar criar estilos totalmente independentes sem necessidade.

---

## 3. Princípios visuais do www

### 3.1 Editorial e público

O `www` deve parecer uma mistura de site editorial, hub de ferramentas e vitrine de produtos futuros.

### 3.2 Leve e performático

Visual sofisticado não deve justificar excesso de scripts, imagens ou bibliotecas.

### 3.3 Consistente

Header, footer, cards, botões, FAQs e seções devem manter padrão entre páginas.

### 3.4 Mobile first

Toda página deve funcionar bem em celular.

### 3.5 Tema claro/escuro

Toda página nova deve funcionar corretamente no tema escuro e no tema claro.

---

## 4. Estrutura padrão de página

```text
Header fixo
  ↓
Hero ou article hero
  ↓
Conteúdo principal
  ↓
Cards ou blocos complementares
  ↓
FAQ ou links relacionados
  ↓
CTA, quando fizer sentido
  ↓
Footer
```

---

## 5. Header

Padrão esperado:

- `nav` fixo no topo;
- fundo semi-transparente;
- blur;
- borda inferior sutil;
- logo com Playfair Display;
- ponto verde animado;
- links discretos;
- menu mobile.

Diretrizes:

- não criar header diferente por página;
- evitar pulos visuais entre páginas;
- preservar altura e espaçamento;
- garantir boa experiência mobile.

---

## 6. Hero

O hero deve variar por tipo de página:

### 6.1 Home

Pode ser mais impactante, com gradientes, destaque visual e CTA forte.

### 6.2 Página educativa

Usar padrão de article hero:

- eyebrow;
- H1 forte;
- lead;
- metadados quando aplicável.

### 6.3 Página de ferramenta

Usar hero funcional:

- título claro;
- descrição curta;
- promessa de utilidade;
- caminho para o formulário ou simulador.

---

## 7. Tipografia

Diretrizes:

- H1 e H2 devem usar Playfair Display;
- corpo deve usar Outfit;
- labels e badges devem usar Outfit com espaçamento de letras;
- textos longos devem ter largura controlada;
- parágrafos educativos devem usar boa altura de linha.

Escalas devem seguir os tokens e padrões existentes.

---

## 8. Cores

Usar tokens existentes:

- `--bg`;
- `--bg-2`;
- `--bg-card`;
- `--bg-hover`;
- `--green`;
- `--green-border`;
- `--green-glow`;
- `--gold`;
- `--text`;
- `--text-soft`;
- `--muted-*`.

Regras:

- não usar hex direto quando houver token;
- validar modo claro;
- validar contraste;
- reservar verde para ação/destaque;
- usar dourado com moderação.

---

## 9. Cards

Cards do `www` devem ser usados para:

- ferramentas;
- conteúdos;
- benefícios;
- estatísticas;
- chamadas para produtos futuros.

Padrão:

- fundo `--bg-card`;
- borda `--muted-3`;
- hover sutil;
- título claro;
- texto curto;
- link ou CTA.

---

## 10. Botões

Tipos:

| Tipo | Uso |
|---|---|
| Primário | ação principal |
| Secundário | ação alternativa |
| Ghost | link discreto |
| Danger | raramente usado no `www` |

Regras:

- não usar dois botões primários concorrentes no mesmo bloco;
- texto deve começar com verbo;
- botão deve ser confortável em mobile;
- foco/hover deve usar tokens verdes.

---

## 11. Seções educativas

Páginas educativas devem usar padrões de `educacao.css`:

- `article-hero`;
- `article-eyebrow`;
- `article-meta`;
- `article-lead`;
- `article-body`;
- `pull-quote`;
- `visual-section`.

Diretrizes:

- textos devem ser escaneáveis;
- exemplos práticos são preferíveis a abstrações;
- links internos devem conectar conteúdos e ferramentas.

---

## 12. FAQs

Usar padrão compartilhado de `faq.css`.

FAQ deve aparecer quando ajudar:

- SEO;
- dúvidas frequentes;
- explicação de limitações;
- conexão com ferramentas.

Evitar FAQ genérica sem valor.

---

## 13. Landing pages

Landing pages devem seguir identidade do `www`, mas com mais foco em conversão.

Estrutura recomendada:

```text
Hero
Problema
Solução
Benefícios
Demonstração
Como funciona
CTA
FAQ
Links relacionados
```

---

## 14. Home

A home pode ter visual mais expressivo que páginas internas.

Diretrizes:

- preservar performance;
- usar gradientes com moderação;
- destacar ferramentas;
- reforçar proposta do Gelocci;
- criar caminhos claros para educação, ferramentas e produtos futuros.

---

## 15. Tema claro

Toda página precisa ser testada com `html.light-mode`.

Itens críticos:

- fundo;
- textos;
- cards;
- bordas;
- botões;
- gráficos;
- tooltips;
- FAQs;
- header;
- menu mobile.

---

## 16. Riscos atuais

Pontos a observar:

- duplicação de estilos entre CSS comum e CSS de página;
- repetição de header em arquivos específicos;
- uso de `!important` em alguns compartilhados;
- necessidade de padronizar ainda mais páginas de calculadora;
- necessidade de validar consistência do tema claro em todas as páginas.

---

## 17. Regra de evolução

Toda nova página do `www` deve responder:

```text
Ela parece parte do Gelocci?
Ela é leve?
Ela funciona bem em mobile?
Ela respeita tema claro e escuro?
Ela tem conteúdo indexável?
Ela evita complexidade desnecessária?
```

Se alguma resposta for não, a página deve ser revisada antes de publicação.
