\# Gelocci Studio



\## 1. Propósito



O Gelocci Studio é uma plataforma interna de agentes criada para apoiar a evolução contínua do ecossistema Gelocci, especialmente o site gelocci.com.br.



Seu objetivo é atuar como uma equipe digital de apoio ao Gerson, auxiliando na análise, arquitetura, desenvolvimento, revisão, testes, segurança, publicação, SEO, produto, conteúdo e evolução das ferramentas financeiras.



O Gelocci Studio não é, inicialmente, um produto comercial. Ele é uma ferramenta interna para acelerar, qualificar e organizar o desenvolvimento dos produtos da família Gelocci.



O ecossistema Gelocci, por outro lado, poderá conter produtos comerciais no futuro, como módulos premium, ferramentas avançadas, áreas autenticadas, relatórios, assinaturas ou soluções específicas, como o módulo de Asset Allocation.



\---



\## 2. O que o Gelocci Studio é



O Gelocci Studio é uma plataforma interna de trabalho assistido por agentes.



Ele deve:



\- analisar projetos;

\- sugerir melhorias;

\- debater soluções entre agentes;

\- gerar planos de implementação;

\- apoiar alterações em código;

\- revisar qualidade;

\- validar segurança;

\- apoiar testes;

\- orientar publicação;

\- sugerir melhorias de produto;

\- sugerir conteúdo e SEO;

\- manter coerência arquitetural e visual do ecossistema Gelocci.



\---



\## 3. O que o Gelocci Studio não é



O Gelocci Studio não é:



\- uma plataforma SaaS para venda a terceiros, pelo menos em sua fase inicial;

\- um substituto da decisão do Gerson;

\- um agente autônomo com poder irrestrito;

\- uma ferramenta para publicar mudanças sem aprovação;

\- uma plataforma que deve tornar o gelocci.com.br pesado;

\- uma justificativa para usar backend quando HTML, CSS e JavaScript puro forem suficientes.



\---



\## 4. Princípios



\### 4.1 O Gerson decide



Os agentes podem sugerir, revisar, questionar e bloquear tecnicamente uma solução, mas a decisão final é sempre do Gerson.



\### 4.2 O gelocci.com.br deve permanecer leve



O site gelocci.com.br deve continuar baseado preferencialmente em:



\- HTML5;

\- CSS;

\- JavaScript puro;

\- Node.js apenas para build estático;

\- deploy simples.



Backend só deve ser usado quando houver necessidade real, como autenticação, persistência de dados, pagamento, upload de arquivos, processamento pesado ou integração privada.



Essa premissa se aplica especialmente ao site público gelocci.com.br. Produtos avançados ou comerciais poderão adotar backend, banco de dados, autenticação, pagamento e processamento server-side quando houver justificativa funcional, técnica ou comercial.



\### 4.3 Qualidade antes de velocidade



O Gelocci Studio deve evitar remendos, soluções frágeis e alterações sem revisão.



\### 4.4 Agentes devem colaborar



Os agentes não trabalham de forma isolada. Eles devem debater, apontar conflitos e buscar a melhor solução conjunta.



\### 4.5 Bloqueios devem ser justificados



Um agente pode bloquear uma solução, mas precisa explicar claramente o motivo, o risco e o que precisa ser ajustado.



\### 4.6 Toda alteração deve ser rastreável



As decisões, recomendações, planos e aprovações devem ser registradas.



\### 4.7 Separação entre hub público e produtos avançados



O gelocci.com.br deve atuar como hub público, leve, educativo e acessível.



Produtos avançados da família Gelocci, como Asset Allocation, cálculo automatizado de IR, leitura de documentos financeiros, relatórios premium ou áreas autenticadas, devem ser desenvolvidos em módulos, aplicações ou subdomínios separados quando exigirem maior complexidade técnica.



\---



\## 5. Estrutura de agentes



\### 5.1 Orquestrador Gelocci



Responsável por receber demandas, entender o objetivo, selecionar agentes participantes, organizar o fluxo de análise e consolidar pareceres.



\### 5.2 Studio Lead



Responsável por revisar a solução consolidada e verificar se ela está alinhada aos princípios do Gelocci Studio, à visão do Gerson e à estratégia do ecossistema Gelocci.



\### 5.3 Arquiteto Gelocci



Responsável por avaliar estrutura, padrões, organização, complexidade, separação de responsabilidades e aderência à arquitetura definida.



\### 5.4 Desenvolvedor Gelocci



Responsável por propor e implementar soluções técnicas em HTML, CSS, JavaScript e demais tecnologias aprovadas.



\### 5.5 Revisor Gelocci



Responsável por revisar código, legibilidade, consistência, duplicidades e aderência ao padrão do projeto.



\### 5.6 QA Gelocci



Responsável por validar comportamento, testes, build, console, responsividade, regressões e funcionamento geral.



\### 5.7 Segurança Gelocci



Responsável por avaliar riscos de segurança, privacidade, exposição de dados, dependências, cookies, LGPD e uso de scripts externos.



\### 5.8 Produto Gelocci



Responsável por avaliar valor para o usuário, priorização, jornada, proposta de valor e evolução dos produtos.



\### 5.9 UX/UI Gelocci



Responsável por avaliar experiência visual, clareza, hierarquia, layout, responsividade, CTAs e consistência com o design system.



\### 5.10 SEO Gelocci



Responsável por avaliar títulos, descrições, headings, links internos, intenção de busca e potencial de tráfego orgânico.



\### 5.11 Financeiro Gelocci



Responsável por validar conceitos financeiros, fórmulas, premissas, cálculos e explicações das ferramentas financeiras.



\### 5.12 Conteúdo Gelocci



Responsável por apoiar textos, artigos, FAQs, roteiros, explicações educativas e linguagem das páginas.



\### 5.13 DevOps Gelocci



Responsável por build, Git, branches, deploy, versionamento, tags, rollback e publicação.



\---



\## 6. Modelo de decisão dos agentes



Cada agente pode emitir um dos seguintes pareceres:



\- APPROVED

\- APPROVED\_WITH\_NOTES

\- CHANGES\_REQUESTED

\- BLOCKED



\### APPROVED



O agente aprova a solução.



\### APPROVED\_WITH\_NOTES



O agente aprova, mas registra observações ou melhorias futuras.



\### CHANGES\_REQUESTED



O agente entende que a solução precisa ser ajustada antes de avançar.



\### BLOCKED



O agente entende que há risco relevante e a solução não deve avançar sem correção ou decisão explícita do Gerson.



\---



\## 7. Regra de avanço



Uma solução só pode avançar se:



1\. nenhum agente obrigatório emitir BLOCKED sem tratamento;

2\. nenhum agente obrigatório emitir CHANGES\_REQUESTED sem ajuste ou decisão explícita;

3\. o Studio Lead aprovar o alinhamento geral;

4\. o Gerson aprovar a execução.



\---



\## 8. Fluxo geral



1\. Gerson cria uma demanda.

2\. Orquestrador interpreta a demanda.

3\. Orquestrador seleciona os agentes necessários.

4\. Agentes emitem parecer individual.

5\. Orquestrador consolida conflitos.

6\. Se necessário, ocorre nova rodada de discussão.

7\. Studio Lead revisa a solução consolidada.

8\. Gerson aprova ou ajusta a direção.

9\. Desenvolvedor implementa.

10\. Revisor, QA e Segurança validam.

11\. DevOps orienta publicação.

12\. Gerson decide publicar.



\---



\## 9. Relação com o gelocci.com.br



O gelocci.com.br é o principal projeto atendido pelo Gelocci Studio.



Ele deve permanecer como hub público, leve e estático da marca Gelocci, com foco em:



\- ferramentas financeiras;

\- educação financeira;

\- simuladores;

\- calculadoras;

\- páginas de aquisição;

\- conteúdo de SEO;

\- divulgação de produtos futuros.



Embora o gelocci.com.br nasça como hub público, leve e predominantemente gratuito, ele poderá atuar também como porta de entrada para produtos comerciais da família Gelocci.



Produtos mais avançados, como Asset Allocation, cálculo automatizado de IR, leitura de documentos financeiros, relatórios premium ou áreas autenticadas, poderão ser desenvolvidos em módulos separados ou subdomínios próprios, preservando a leveza do site principal.



\---



\## 10. Premissa tecnológica do gelocci.com.br



A stack preferencial do gelocci.com.br é:



\- HTML5;

\- CSS;

\- JavaScript puro;

\- Node.js apenas para build estático;

\- Netlify;

\- Cloudflare;

\- GitHub.



Backend só deve ser adotado quando houver justificativa forte.



Essa premissa se aplica especialmente ao site público gelocci.com.br. Produtos avançados ou comerciais poderão adotar backend, banco de dados, autenticação, pagamento e processamento server-side quando houver justificativa funcional, técnica ou comercial.



\---



\## 11. Relação com produtos comerciais futuros



O Gelocci Studio deve apoiar tanto o gelocci.com.br quanto produtos comerciais futuros da família Gelocci.



O primeiro produto comercial previsto é o módulo de Asset Allocation, voltado à construção, análise, balanceamento e acompanhamento de carteiras de ativos.



Esse tipo de produto poderá exigir:



\- autenticação;

\- persistência de carteiras;

\- histórico de lançamentos;

\- importação de dados;

\- cálculos recorrentes;

\- relatórios;

\- pagamento;

\- backend;

\- banco de dados;

\- integrações externas.



A adoção dessas tecnologias deverá ser feita por necessidade real do produto, sem comprometer a leveza do site público principal.



\---



\## 12. Roadmap inicial do Gelocci Studio



\### Fase 1 — Conceito e system design



Definir propósito, agentes, fluxos, regras, arquitetura e limites.



\### Fase 2 — Auditor inicial



Criar um primeiro mecanismo para analisar o repositório gelocci.com.br e gerar diagnóstico técnico, produto, SEO e monetização indireta.



\### Fase 3 — Backlog inteligente



Transformar diagnósticos em recomendações priorizadas.



\### Fase 4 — Implementação assistida



Permitir que recomendações aprovadas gerem planos de alteração e, futuramente, branches ou PRs.



\### Fase 5 — Publicação assistida



Apoiar build, commit, merge, deploy, changelog e publicação.



\### Fase 6 — Evolução contínua



Usar métricas, SEO, conteúdo e feedback para sugerir próximas melhorias.



\### Fase 7 — Apoio a produtos comerciais



Apoiar a concepção, desenvolvimento e evolução de produtos comerciais da família Gelocci, como o Asset Allocation, preservando a separação entre o hub público leve e os módulos avançados que exigirem backend, autenticação, pagamento ou persistência de dados.

