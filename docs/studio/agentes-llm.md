# Gelocci Studio — Agentes com LLM

Este bloco incorpora ao Studio a parte aproveitável do experimento Hiverun: agentes com prompts próprios e execução via LLM, sem acoplar worker dentro da API e sem duplicar Prisma.

## Decisão arquitetural

O Studio mantém:

```text
apps/api
apps/worker
packages/database
packages/workflow
packages/agents
```

E adiciona:

```text
packages/llm
```

## Provider

Configurado via `.env`:

```env
LLM_PROVIDER="rule"       # rule | groq | openai | anthropic
GROQ_API_KEY=""
GROQ_MODEL="llama-3.3-70b-versatile"
OPENAI_API_KEY=""
OPENAI_MODEL="gpt-4o-mini"
ANTHROPIC_API_KEY=""
ANTHROPIC_MODEL="claude-3-5-sonnet-latest"
LLM_TEMPERATURE="0.2"
```

## Modos

### rule

Executa fallback determinístico local. Útil para desenvolvimento, teste e validação do runtime.

### groq/openai/anthropic

Executa agentes com prompts e resposta JSON estruturada.

## Contrato

Todo agente continua implementando:

```ts
StudioAgent
```

E retorna:

```ts
AgentOutput
```

A LLM não altera o contrato do motor.

## Segurança do desenho

- A API não executa agentes.
- O worker continua sendo o executor.
- O Prisma continua centralizado em `packages/database`.
- A LLM é uma implementação dos agentes, não o motor.
- Se a LLM falhar ou retornar JSON inválido, o agente cai para fallback rule-based e registra o erro no metadata.
