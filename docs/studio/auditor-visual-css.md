# Auditor Visual/CSS — Gelocci Studio

## 1. Objetivo

O auditor visual/CSS é a segunda funcionalidade operacional do Gelocci Studio.

Ele analisa os arquivos CSS de um projeto local e gera um relatório sobre tokens, temas, fontes, cores, media queries, uso de `!important` e padrões visuais.

---

## 2. Comando

```powershell
npm run studio -- design-audit C:\Users\geloc\projetos\www
```

---

## 3. Saída

O relatório será criado em:

```text
reports/<nome-do-projeto>/design-audit-<timestamp>.md
```

Exemplo:

```text
reports/www/design-audit-2026-05-16T02-30-00-000Z.md
```

---

## 4. O que o auditor faz

A primeira versão:

- localiza arquivos CSS;
- ignora `.git`, `node_modules`, `dist`, `build`, `.next`, `out` e temporários;
- identifica blocos `:root`;
- identifica blocos de tema claro;
- identifica tokens CSS;
- identifica usos de `var(--token)`;
- identifica tokens duplicados;
- identifica tokens usados mas não definidos;
- identifica tokens definidos mas não usados;
- conta usos de `!important`;
- lista cores hexadecimais;
- lista fontes declaradas;
- lista media queries;
- detecta padrões de FAQ, calculadoras e gráficos.

---

## 5. O que o auditor ainda não faz

Esta versão ainda não:

- usa LLM;
- avalia qualidade visual subjetiva;
- entende especificidade CSS em profundidade;
- corrige arquivos;
- gera recomendações por agente;
- compara CSS contra layout guidelines.

Esses recursos virão em fases futuras.

---

## 6. Próximas evoluções

Próximas melhorias planejadas:

1. comparar CSS real com `docs/ecosystem/identidade-visual.md`;
2. comparar CSS real com `layout-guidelines.md`;
3. gerar recomendações do agente UX/UI;
4. gerar recomendações do agente Arquiteto;
5. gerar recomendações do agente QA;
6. apontar possíveis consolidações de tokens;
7. sugerir refatorações seguras.
