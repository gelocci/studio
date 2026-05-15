# Fluxo — Implementação Assistida

## 1. Objetivo

Este fluxo serve para transformar uma recomendação aprovada em plano de alteração, arquivos completos, comandos de validação e preparação para commit.

---

## 2. Quando usar

Use este fluxo quando o Gerson aprovar uma melhoria e quiser implementá-la com apoio do Gelocci Studio.

Exemplos:

```text
Implementar melhoria da home
Ajustar calculadora IR
Criar landing do Asset Allocation
Padronizar página de ferramenta
Corrigir layout mobile
```

---

## 3. Agentes participantes

Agentes obrigatórios:

- Orquestrador Gelocci;
- Arquiteto Gelocci;
- Desenvolvedor Gelocci;
- Revisor Gelocci;
- QA Gelocci;
- Studio Lead.

Agentes condicionais:

- Financeiro Gelocci, se houver fórmula ou conceito financeiro;
- UX/UI Gelocci, se houver alteração visual;
- SEO Gelocci, se houver página pública;
- Segurança Gelocci, se houver dados, scripts, cookies ou dependências;
- DevOps Gelocci, se houver build, commit ou publicação.

---

## 4. Entradas necessárias

O fluxo deve receber:

- recomendação aprovada;
- objetivo da implementação;
- arquivos atuais;
- arquivos afetados;
- system design aplicável;
- critérios de aceite;
- restrições;
- pareceres anteriores.

---

## 5. Sequência do fluxo

```text
Recomendação aprovada
  ↓
Orquestrador confirma escopo
  ↓
Arquiteto valida abordagem
  ↓
Desenvolvedor propõe implementação
  ↓
Agentes condicionais validam pontos específicos
  ↓
Studio Lead aprova plano
  ↓
Desenvolvedor gera arquivos completos
  ↓
Revisor revisa
  ↓
QA define testes
  ↓
Gerson aplica arquivos
  ↓
Gerson executa validações
  ↓
DevOps orienta commit, se aplicável
```

---

## 6. Saída esperada

O fluxo deve gerar:

```text
Recomendação:
Objetivo:
Escopo:
Arquivos afetados:
Plano de alteração:
Arquivos completos:
Comandos de validação:
Checklist QA:
Riscos:
Critérios de aceite:
Comando de commit sugerido:
```

---

## 7. Regras de implementação

- Sempre gerar arquivos completos quando solicitado.
- Evitar patches pequenos se o Gerson preferir substituição completa.
- Não alterar escopo sem avisar.
- Não criar dependência nova sem aprovação.
- Não introduzir backend sem aprovação arquitetural.
- Não publicar automaticamente.
- Gerar comandos completos e copiáveis.

---

## 8. Critérios de aceite

A implementação deve:

- resolver a demanda aprovada;
- respeitar o system design;
- passar em build/testes;
- preservar responsividade;
- evitar regressões;
- ter comandos claros;
- estar pronta para revisão do Gerson.

---

## 9. Resultado ideal

Ao final, o Gerson deve conseguir substituir arquivos, testar e commitar com segurança.
