# Fluxo — Publicação Assistida

## 1. Objetivo

Este fluxo serve para orientar commit, merge, build, deploy, tag, changelog e rollback dos projetos Gelocci.

---

## 2. Quando usar

Use este fluxo quando o Gerson quiser:

- commitar alterações;
- levar feature para develop;
- promover develop para main;
- publicar no Netlify ou outro ambiente;
- criar tag;
- registrar changelog;
- preparar rollback.

---

## 3. Agentes participantes

Agentes obrigatórios:

- Orquestrador Gelocci;
- DevOps Gelocci;
- QA Gelocci;
- Revisor Gelocci;
- Studio Lead.

Agentes condicionais:

- Segurança Gelocci, se houver dados, scripts externos, cookies, dependências ou backend;
- Financeiro Gelocci, se alteração afetar cálculo;
- SEO Gelocci, se alteração afetar página pública estratégica.

---

## 4. Entradas necessárias

O fluxo deve receber:

- branch atual;
- saída de `git status`;
- objetivo da publicação;
- alterações feitas;
- resultado de build;
- testes executados;
- ambiente de destino;
- necessidade de tag ou changelog.

---

## 5. Sequência do fluxo

```text
Gerson solicita publicação
  ↓
Orquestrador classifica operação
  ↓
DevOps avalia Git, branch e build
  ↓
QA valida testes
  ↓
Revisor valida escopo
  ↓
Segurança/Financeiro/SEO validam se aplicável
  ↓
Studio Lead aprova fluxo
  ↓
DevOps gera comandos completos
  ↓
Gerson executa
  ↓
Gerson informa resultado
  ↓
DevOps orienta próximo passo
```

---

## 6. Saída esperada

O fluxo deve gerar:

```text
Objetivo:
Branch atual:
Estado do Git:
Validações necessárias:
Riscos:
Comandos:
Rollback:
Changelog sugerido:
Decisão:
```

---

## 7. Regras de segurança operacional

- Não sugerir merge se o working tree estiver sujo sem entendimento.
- Não sugerir publicação se o build falhou.
- Não sugerir comando destrutivo sem explicar impacto.
- Não misturar develop/main sem confirmar intenção.
- Não publicar produção sem aprovação explícita do Gerson.
- Comandos devem ser completos e claros.

---

## 8. Critérios de aceite

Uma publicação só deve avançar se:

- branch estiver correta;
- alterações estiverem entendidas;
- build estiver validado;
- QA estiver satisfeito;
- riscos estiverem claros;
- rollback estiver possível;
- Gerson aprovar.

---

## 9. Resultado ideal

Ao final, o Gerson deve conseguir publicar com segurança, sabendo exatamente o que foi feito e como voltar se necessário.
