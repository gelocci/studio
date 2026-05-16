# Layout Guidelines — Hub de Ferramentas

## 1. Objetivo

Este documento define as diretrizes visuais e de experiência das ferramentas financeiras do Gelocci, com base nos CSS atuais de calculadoras, guias, espaçamento e FAQ.

O Hub de Ferramentas deve ser simples para usar, claro para entender, confiável para calcular e útil para aprender.

---

## 2. Base visual das ferramentas

As ferramentas devem usar:

- `base.css`;
- `theme.css`;
- CSS comum de calculadoras;
- `calculator-guide.css`;
- `calculator-spacing.css`;
- `faq.css`;
- CSS específico da ferramenta quando necessário.

A criação de CSS específico deve complementar o padrão, não recriar tudo do zero.

---

## 3. Estrutura padrão

Toda ferramenta deve seguir:

```text
Header
  ↓
Hero ou introdução da ferramenta
  ↓
Guia explicativo inicial
  ↓
Área da calculadora/simulador
  ↓
Resultado principal
  ↓
Resultados complementares
  ↓
Gráfico ou tabela, se aplicável
  ↓
Explicação do cálculo
  ↓
FAQ
  ↓
Links relacionados ou CTA
  ↓
Footer
```

---

## 4. Guia explicativo inicial

O padrão de guia usa:

- `calculator-guide`;
- `seo-panel`;
- `guide-kicker`;
- `seo-highlight`;
- `seo-mini`;
- `formula-box`.

Diretrizes:

- explicar o que a ferramenta faz;
- mostrar quando usar;
- indicar fórmula ou premissa;
- conectar com conteúdo educativo;
- não alongar demais antes do simulador.

---

## 5. Espaçamento

Usar os tokens e regras de `calculator-spacing.css`:

- `--calc-guide-to-tool-gap`;
- `--calc-tool-to-faq-gap`;
- `--calc-page-bottom-gap`.

Objetivo:

- manter ritmo visual igual entre calculadoras;
- evitar variações manuais;
- centralizar distância entre guia, ferramenta e FAQ.

---

## 6. Formulários

Formulários devem ser claros.

Diretrizes:

- labels visíveis;
- campos agrupados;
- unidades explícitas;
- validação amigável;
- botão principal evidente;
- mobile em uma coluna;
- campos numéricos com limites claros.

Exemplo de campos:

```text
Valor inicial (R$)
Aporte mensal (R$)
Taxa (% ao mês)
Período (anos)
Período (meses)
```

---

## 7. Resultados

O resultado principal deve ser destacado.

Deve conter:

- valor principal;
- interpretação curta;
- premissas relevantes;
- unidades;
- observação quando for estimativa.

Resultados complementares devem usar cards.

Exemplos:

- total investido;
- juros acumulados;
- valor líquido;
- imposto estimado;
- taxa equivalente;
- diferença entre cenários.

---

## 8. Gráficos

Gráficos devem respeitar tokens de tema:

- `--chart-text`;
- `--chart-grid`;
- `--chart-border`;
- `--chart-tooltip-bg`;
- `--chart-tooltip-border`;
- `--chart-tooltip-title`;
- `--chart-tooltip-body`.

Regras:

- validar tema claro e escuro;
- não depender apenas de cor;
- manter legenda clara;
- funcionar em mobile;
- explicar o gráfico em texto;
- evitar excesso de séries.

---

## 9. Tabelas

Tabelas devem ser usadas quando agregarem clareza.

Regras:

- poucas colunas;
- cabeçalho claro;
- valores alinhados;
- adaptação mobile;
- destaque para colunas importantes.

---

## 10. FAQ

Usar padrão `faq.css`.

FAQ deve ajudar em:

- SEO;
- dúvidas sobre fórmula;
- diferença entre conceitos;
- limitações do cálculo;
- interpretação do resultado.

Toda ferramenta financeira relevante deve ter FAQ.

---

## 11. Explicação do cálculo

Toda ferramenta deve explicar:

- fórmula usada;
- premissas;
- o que entra no cálculo;
- o que não entra;
- limitações;
- exemplo prático.

A explicação deve ser acessível, mas tecnicamente correta.

---

## 12. Mensagens de erro

Mensagens devem ser específicas.

Exemplo ruim:

```text
Valor inválido.
```

Exemplo bom:

```text
Informe um número de meses entre 0 e 12.
```

---

## 13. Tema claro e escuro

Toda ferramenta deve ser testada nos dois temas.

Itens críticos:

- campos;
- labels;
- cards;
- gráficos;
- tooltips;
- tabelas;
- FAQ;
- mensagens de erro;
- resultado principal.

---

## 14. Responsividade

Em mobile:

- formulário em uma coluna;
- cards empilhados;
- resultado logo após ação;
- gráficos adaptados;
- tabelas simplificadas;
- botões grandes;
- espaçamento confortável.

---

## 15. Relação com SEO

Ferramentas devem ter conteúdo indexável.

Cada ferramenta deve conter:

- H1 claro;
- descrição;
- guia explicativo;
- fórmula ou premissa;
- FAQ;
- links internos;
- exemplos;
- meta description adequada.

---

## 16. Relação com agentes

### Financeiro

Valida fórmula, premissas, exemplos e linguagem.

### QA

Valida cenários, limites, console, responsividade e regressões.

### SEO

Valida conteúdo indexável, headings, FAQ e links internos.

### UX/UI

Valida clareza, layout, formulário, resultado e mobile.

### Segurança

Avalia dados, armazenamento, scripts e privacidade.

---

## 17. Riscos atuais

Pontos observados nos CSS:

- calculadoras têm alguns estilos compartilhados e outros específicos;
- ainda existe duplicação de tokens em CSS comuns e específicos;
- algumas páginas têm tema claro tratado individualmente;
- gráficos precisam de atenção especial no toggle de tema;
- FAQ foi padronizado com `!important`, o que resolve consistência, mas deve ser usado com cautela.

---

## 18. Regra de qualidade

Antes de publicar uma ferramenta, validar:

```text
Fórmula correta
Entradas claras
Erros compreensíveis
Resultado interpretável
FAQ útil
Tema claro e escuro
Mobile
Console sem erro
Links internos
SEO básico
```

---

## 19. Decisão inicial

O padrão visual do Hub de Ferramentas deve ser:

```text
calculadora clara,
resultado destacado,
explicação didática,
FAQ útil,
gráfico legível,
experiência mobile boa.
```
