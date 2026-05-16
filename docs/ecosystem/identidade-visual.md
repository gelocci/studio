# Identidade Visual — Ecossistema Gelocci

## 1. Objetivo

Este documento consolida a identidade visual macro do ecossistema Gelocci com base no design system existente e nos CSS atuais do `gelocci.com.br`.

Ele deve orientar o `www`, o Hub de Ferramentas, o Asset Allocation, o Gelocci Studio e produtos futuros.

---

## 2. Direção visual atual

A identidade atual do Gelocci parte de uma estética escura, sofisticada e tecnológica, com forte presença de verde como cor de ação e destaque.

A linguagem visual combina:

- fundo escuro;
- verde vibrante;
- dourado como apoio premium;
- tipografia editorial em títulos;
- tipografia moderna em textos;
- cards escuros;
- bordas sutis;
- brilho moderado;
- ruído visual leve no fundo;
- componentes limpos e responsivos.

---

## 3. Personalidade visual

O Gelocci deve transmitir:

- confiança;
- sofisticação;
- clareza;
- inteligência financeira;
- modernidade;
- educação;
- tecnologia;
- responsabilidade;
- precisão.

O Gelocci não deve parecer:

- corretora agressiva;
- promessa de enriquecimento;
- blog financeiro amador;
- portal poluído;
- dashboard frio demais;
- app excessivamente informal;
- site institucional sem personalidade.

---

## 4. Cores principais

A paleta consolidada usa tokens CSS como base. Os componentes devem usar `var(--token)` em vez de valores hexadecimais diretos.

| Token | Uso | Valor base |
|---|---|---|
| `--green` | ação principal e destaque | `#00C853` |
| `--green-dim` | hover de ações verdes | `#00A844` |
| `--green-soft` | fundos verdes suaves | `rgba(0,200,83,0.10)` |
| `--green-glow` | brilho/foco verde | `rgba(0,200,83,0.12)` |
| `--green-border` | bordas verdes | `rgba(0,200,83,0.22)` |
| `--gold` | premium, badges e destaque secundário | `#C9A84C` |
| `--red` | erro ou alerta | `#E05555` |
| `--blue` | informação ou apoio | `#4488CC` |
| `--bg` | fundo principal | `#080B0A` |
| `--bg-2` | fundo alternativo | `#0E1412` |
| `--bg-card` | cards e painéis | `#111815` |
| `--bg-hover` | hover de cards | `#141C18` ou `#151F1A` |
| `--white` | texto principal no tema escuro | `#F0F4F2` |
| `--muted-1` | texto secundário | `rgba(240,244,242,0.65)` |
| `--muted-2` | texto terciário | `rgba(240,244,242,0.40)` |
| `--muted-3` | bordas sutis | `rgba(240,244,242,0.12)` |
| `--muted-4` | fundos muito suaves | `rgba(240,244,242,0.05)` |

---

## 5. Tema claro e tema escuro

O tema escuro é o padrão visual do Gelocci.

O tema claro existe e deve ser preservado. Ele deve sobrescrever variáveis por meio de `html.light-mode` ou `html[data-theme="light"]`.

Regras:

- toda nova página deve respeitar os tokens de tema;
- não usar cores fixas quando houver token disponível;
- gráficos devem trocar cores corretamente entre temas;
- textos devem manter contraste;
- cards devem continuar distintos do fundo;
- tooltips e grids de gráficos devem ser legíveis nos dois temas.

---

## 6. Tipografia

A identidade usa duas famílias principais:

| Token | Fonte | Uso |
|---|---|---|
| `--font-display` | Playfair Display | títulos, hero, seções e destaque editorial |
| `--font-serif` | Playfair Display | alias para títulos e textos editoriais |
| `--font-body` | Outfit | corpo, navegação, labels, formulários e UI |

Diretrizes:

- Playfair Display dá personalidade e sofisticação.
- Outfit dá legibilidade e modernidade.
- Títulos devem ter hierarquia clara.
- Textos devem manter leitura confortável.
- Números em ferramentas devem ser legíveis e bem destacados.

---

## 7. Bordas, sombras e raios

Tokens consolidados:

| Token | Uso |
|---|---|
| `--radius-sm` | botões, inputs pequenos |
| `--radius-md` | ícones e pequenos cards |
| `--radius-lg` | painéis e navegação |
| `--radius-xl` | cards principais |
| `--radius-2xl` | seções e blocos amplos |
| `--radius-full` | badges e elementos arredondados |
| `--shadow-soft` | sombra leve |
| `--shadow-card` | sombra de cards |
| `--shadow-green` | destaque de ações verdes |

Diretriz:

- sombras devem ser sutis;
- bordas devem ser discretas;
- cards devem parecer sofisticados, não pesados;
- o verde deve destacar, não dominar a tela.

---

## 8. Componentes base

Componentes recorrentes:

- header fixo com blur;
- logo com ponto verde;
- hero editorial;
- cards com hover;
- botões primários verdes;
- botões secundários com borda verde;
- badges;
- inputs com foco verde;
- FAQs;
- painéis explicativos;
- seções educativas;
- gráficos;
- blocos de resultado.

---

## 9. Header e navegação

Padrão atual:

- `nav` fixo no topo;
- fundo escuro semi-transparente;
- `backdrop-filter: blur(20px)`;
- borda inferior sutil;
- logo em Playfair Display;
- ponto verde animado;
- links discretos;
- menu mobile com hamburger.

Este padrão deve ser preservado e consolidado para evitar variações entre páginas.

---

## 10. Cards

Cards devem usar:

- fundo `--bg-card`;
- borda `--muted-3`;
- hover com `--bg-hover`;
- destaque verde sutil;
- raio entre `--radius-lg` e `--radius-xl`;
- texto secundário com `--muted-1` ou `--muted-2`.

Cards podem ser usados para:

- ferramentas;
- artigos;
- benefícios;
- resultados;
- estatísticas;
- CTAs.

---

## 11. Inputs e formulários

Inputs devem seguir o padrão:

- fundo escuro/card;
- borda sutil;
- label claro;
- foco com borda/glow verde;
- mensagens de erro próximas ao campo;
- unidades explícitas quando houver valores financeiros.

---

## 12. FAQs

O padrão de FAQ atual usa:

- container com largura máxima;
- card escuro;
- perguntas separadas por bordas;
- títulos em Playfair Display;
- respostas em Outfit;
- links verdes.

Esse padrão deve ser mantido em ferramentas e páginas educativas.

---

## 13. Produtos e variações

### 13.1 www

Deve preservar estética pública, editorial, leve e performática.

### 13.2 Hub de Ferramentas

Deve preservar a identidade visual, mas priorizar formulário, resultado, gráfico e explicação.

### 13.3 Asset Allocation

Pode evoluir para aparência mais SaaS, mas ainda usando a mesma base visual: escuro, verde, cards, gráficos e tipografia consistente.

### 13.4 Studio

Pode ter visual mais operacional, mas deve respeitar tokens, clareza e organização.

---

## 14. Dívidas e pontos de atenção

A análise dos CSS indica alguns pontos a cuidar:

- há duplicação de tokens entre `base.css`, `theme.css`, `calculadoras.css` e alguns CSS de página;
- alguns CSS específicos ainda repetem reset, body, header e variáveis;
- `!important` aparece em alguns arquivos compartilhados, especialmente FAQ e guias;
- o padrão de tema claro precisa ser sempre validado em gráficos e páginas de calculadora;
- o header precisa permanecer consistente entre páginas.

Esses pontos devem entrar como backlog futuro, não como bloqueio imediato.

---

## 15. Decisão visual inicial

A identidade do Gelocci deve ser resumida assim:

```text
Finanças claras, tecnologia leve e visual sofisticado.
```

Essa frase deve guiar os próximos layouts do ecossistema.
