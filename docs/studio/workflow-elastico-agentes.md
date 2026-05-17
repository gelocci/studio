# Workflow elástico de agentes

## Conceito

O Studio não deve gerar sempre o mesmo fluxo grande de agentes.

Cada demanda deve passar por um agente especializado de classificação antes da orquestração. A partir da classificação, o Orquestrador monta um fluxo elástico com apenas os agentes necessários.

## Cadeia base

```text
Entrada
  ↓
Classificador de Demandas
  ↓
Orquestrador
  ↓
Agentes executores necessários
  ↓
Revisores correspondentes
  ↓
Studio Lead
  ↓
Gerson, se necessário
```

## Responsabilidade única

### Classificador de Demandas

Responsável por:

- classificar tipo da demanda;
- classificar complexidade;
- classificar risco;
- sugerir agentes executores;
- sugerir revisores;
- indicar necessidade de QA;
- indicar necessidade de PR;
- indicar necessidade de aprovação do Gerson;
- indicar se caiu em Outros / 99+.

### Orquestrador

Responsável por:

- montar o fluxo;
- ordenar os agentes;
- definir conexões;
- definir retornos possíveis;
- não assumir papel de classificador;
- não assumir papel de especialista.

### Executores

Responsáveis por analisar ou executar uma atividade específica.

Exemplos:

- Produto;
- UX/UI;
- Conteúdo/SEO;
- Financeiro;
- Arquiteto;
- Desenvolvedor;
- Segurança;
- QA;
- Publicação;
- Curador de Notícias;
- Inbox/Fale Conosco;
- Outros / 99+.

### Revisores

Todo executor relevante deve ter um revisor correspondente.

Exemplos:

- Revisor de Produto;
- Revisor UX/UI;
- Revisor Conteúdo/SEO;
- Revisor Financeiro;
- Revisor Técnico;
- Revisor de Código;
- Revisor Segurança;
- Revisor QA;
- Revisor de Publicação;
- Revisor de Notícias;
- Revisor de Atendimento;
- Revisor Outros / 99+.

### Studio Lead

Responsável pela governança da execução.

Decide:

- se a análise é suficiente;
- se pode seguir dentro da autonomia;
- se precisa voltar para algum agente;
- se precisa escalar para Gerson.

### Gerson / Owner

Responsável por aprovar o que excede a autonomia configurada.

## Outros / 99+

O agente Outros / 99+ existe para receber demandas que não se encaixam claramente nas categorias principais.

Ele não deve resolver tudo.

Ele deve:

- explicar por que a demanda não se encaixa;
- sugerir nova categoria, se necessário;
- pedir triagem humana quando o caso for ambíguo;
- evitar que o Orquestrador vire um agente genérico.
