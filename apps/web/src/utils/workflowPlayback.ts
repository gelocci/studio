import type { Edge } from "@xyflow/react";
import type { AgentNodeType, AgentStatus } from "../types/workflow";

export interface PlaybackStep {
  nodeId: string;
  finalStatus: AgentStatus;
  activeEdgeIds: string[];
  message: string;
  debatingWith?: string;
  mode: "forward" | "return" | "block" | "resolve";
}

export function buildPlaybackSteps(nodes: AgentNodeType[], edges: Edge[]): PlaybackStep[] {
  const ids = new Set(nodes.map((node) => node.id));
  const has = (id: string) => ids.has(id);

  const steps: PlaybackStep[] = [];

  pushIfExists(steps, nodes, edges, {
    nodeId: "entrada",
    message: "Entrada recebida. Encaminhando para o Orquestrador.",
    mode: "forward",
  });

  pushIfExists(steps, nodes, edges, {
    nodeId: "orquestrador",
    message: "Vou classificar a demanda e chamar Produto, UX/UI, SEO, Financeiro, Segurança e Arquitetura.",
    mode: "forward",
  });

  for (const nodeId of ["produto", "ux-ui", "seo", "financeiro", "seguranca", "arquiteto"]) {
    if (has(nodeId)) {
      const mode = nodeId === "financeiro" ? "block" : nodeId === "ux-ui" ? "return" : "forward";

      pushIfExists(steps, nodes, edges, {
        nodeId,
        message: messageFor(nodeId),
        mode,
        debatingWith: nodeId === "ux-ui" ? "arquiteto" : nodeId === "financeiro" ? "lead-triagem" : undefined,
      });
    }
  }

  pushIfExists(steps, nodes, edges, {
    nodeId: "lead-triagem",
    message: "Vou consolidar a triagem. Se houver risco alto, não libero implementação automática.",
    mode: "block",
    debatingWith: "financeiro",
  });

  pushIfExists(steps, nodes, edges, {
    nodeId: "desenvolvedor",
    message: "Só implemento depois de autorização. Mudança vai ser em branch, nunca direto na main.",
    mode: "return",
    debatingWith: "lead-triagem",
  });

  for (const nodeId of ["revisor", "qa", "seguranca-validacao", "financeiro-validacao"]) {
    if (has(nodeId)) {
      const mode = nodeId === "financeiro-validacao" ? "block" : nodeId === "qa" ? "return" : "forward";

      pushIfExists(steps, nodes, edges, {
        nodeId,
        message: messageFor(nodeId),
        mode,
        debatingWith: nodeId === "qa" || nodeId === "financeiro-validacao" ? "desenvolvedor" : undefined,
      });
    }
  }

  pushIfExists(steps, nodes, edges, {
    nodeId: "lead-final",
    message: "Vou consolidar revisão, QA, segurança e financeiro antes do PR.",
    mode: "block",
    debatingWith: "desenvolvedor",
  });

  pushIfExists(steps, nodes, edges, {
    nodeId: "pr",
    message: "PR só nasce se a cadeia de aprovação permitir.",
    mode: "forward",
  });

  pushIfExists(steps, nodes, edges, {
    nodeId: "gerson",
    message: "Fico aguardando aprovação. Não sou executor; sou decisão final quando o risco exige.",
    mode: "resolve",
    debatingWith: "lead-final",
  });

  if (steps.length > 0) {
    return steps;
  }

  return orderNodesByFlow(nodes, edges).map((nodeId) => {
    const node = nodes.find((item) => item.id === nodeId);

    return {
      nodeId,
      finalStatus: node?.data.status ?? "WAITING",
      activeEdgeIds: edges.filter((edge) => edge.target === nodeId || edge.source === nodeId).map((edge) => edge.id),
      message: "Executando etapa do fluxo.",
      mode: "forward",
    };
  });
}

export function resetNodesToWaiting(nodes: AgentNodeType[]): AgentNodeType[] {
  return nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      status: "WAITING",
      currentMessage: undefined,
      debatingWith: undefined,
    },
  }));
}

export function applyPlaybackStep(nodes: AgentNodeType[], steps: PlaybackStep[], stepIndex: number): AgentNodeType[] {
  return nodes.map((node) => {
    const nodeStepIndex = findLastStepIndexForNode(steps, node.id, stepIndex);
    const currentStep = steps[stepIndex];

    if (currentStep?.nodeId === node.id) {
      return {
        ...node,
        data: {
          ...node.data,
          status: "RUNNING",
          currentMessage: currentStep.message,
          debatingWith: currentStep.debatingWith,
        },
      };
    }

    if (nodeStepIndex >= 0 && nodeStepIndex < stepIndex) {
      const lastStep = steps[nodeStepIndex];

      return {
        ...node,
        data: {
          ...node.data,
          status: lastStep.finalStatus,
          currentMessage: lastStep.message,
          debatingWith: lastStep.debatingWith,
        },
      };
    }

    return {
      ...node,
      data: {
        ...node.data,
        status: "WAITING",
        currentMessage: undefined,
        debatingWith: undefined,
      },
    };
  });
}

export function finishPlayback(nodes: AgentNodeType[], originalNodes: AgentNodeType[]): AgentNodeType[] {
  return nodes.map((node) => {
    const original = originalNodes.find((item) => item.id === node.id);

    if (!original) {
      return node;
    }

    return {
      ...node,
      data: {
        ...original.data,
        currentMessage: node.data.currentMessage,
        debatingWith: node.data.debatingWith,
      },
    };
  });
}

export function applyEdgePlayback(edges: Edge[], activeEdgeIds: string[], mode: PlaybackStep["mode"]): Edge[] {
  return edges.map((edge) => {
    const active = activeEdgeIds.includes(edge.id);
    const color = mode === "block" ? "#E05555" : mode === "return" ? "#F59E0B" : "#00C853";

    return {
      ...edge,
      animated: active || edge.animated === true,
      style: {
        ...(edge.style ?? {}),
        stroke: active ? color : edge.style?.stroke,
        strokeWidth: active ? 4 : edge.style?.strokeWidth,
        filter: active ? `drop-shadow(0 0 10px ${hexToGlow(color)})` : undefined,
        strokeDasharray: active && mode === "return" ? "8 6" : edge.style?.strokeDasharray,
      },
      markerEnd:
        typeof edge.markerEnd === "object" && edge.markerEnd !== null
          ? {
              ...edge.markerEnd,
              color: active ? color : edge.markerEnd.color,
            }
          : edge.markerEnd,
    };
  });
}

function pushIfExists(
  steps: PlaybackStep[],
  nodes: AgentNodeType[],
  edges: Edge[],
  input: Omit<PlaybackStep, "finalStatus" | "activeEdgeIds">,
): void {
  const node = nodes.find((item) => item.id === input.nodeId);

  if (!node) {
    return;
  }

  steps.push({
    ...input,
    finalStatus: node.data.status,
    activeEdgeIds: getConversationEdges(edges, input.nodeId, input.debatingWith),
  });
}

function getConversationEdges(edges: Edge[], nodeId: string, debatingWith?: string): string[] {
  if (debatingWith) {
    const direct = edges.filter(
      (edge) =>
        (edge.source === nodeId && edge.target === debatingWith) ||
        (edge.source === debatingWith && edge.target === nodeId),
    );

    if (direct.length > 0) {
      return direct.map((edge) => edge.id);
    }
  }

  return edges.filter((edge) => edge.source === nodeId || edge.target === nodeId).map((edge) => edge.id);
}

function findLastStepIndexForNode(steps: PlaybackStep[], nodeId: string, currentIndex: number): number {
  for (let index = currentIndex - 1; index >= 0; index -= 1) {
    if (steps[index].nodeId === nodeId) {
      return index;
    }
  }

  return -1;
}

function orderNodesByFlow(nodes: AgentNodeType[], edges: Edge[]): string[] {
  const nodeIds = nodes.map((node) => node.id);
  const incomingCount = new Map<string, number>();
  const outgoing = new Map<string, string[]>();

  for (const nodeId of nodeIds) {
    incomingCount.set(nodeId, 0);
    outgoing.set(nodeId, []);
  }

  for (const edge of edges) {
    incomingCount.set(edge.target, (incomingCount.get(edge.target) ?? 0) + 1);

    if (!outgoing.has(edge.source)) {
      outgoing.set(edge.source, []);
    }

    outgoing.get(edge.source)?.push(edge.target);
  }

  const queue = nodeIds.filter((nodeId) => (incomingCount.get(nodeId) ?? 0) === 0);
  const ordered: string[] = [];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const current = queue.shift();

    if (!current || visited.has(current)) {
      continue;
    }

    visited.add(current);
    ordered.push(current);

    const targets = outgoing.get(current) ?? [];

    for (const target of targets) {
      incomingCount.set(target, Math.max(0, (incomingCount.get(target) ?? 0) - 1));

      if ((incomingCount.get(target) ?? 0) === 0) {
        queue.push(target);
      }
    }
  }

  for (const nodeId of nodeIds) {
    if (!visited.has(nodeId)) {
      ordered.push(nodeId);
    }
  }

  return ordered;
}

function messageFor(nodeId: string): string {
  const messages: Record<string, string> = {
    produto: "Vejo valor para o usuário, mas preciso preservar simplicidade.",
    "ux-ui": "Não aprovo do jeito que está. Preciso devolver para ajustar experiência.",
    seo: "A página precisa continuar clara, indexável e com FAQ útil.",
    financeiro: "Bloqueio se houver risco de fórmula ou premissa financeira.",
    seguranca: "Não quero scripts externos, dados sensíveis ou risco de privacidade.",
    arquiteto: "A solução precisa respeitar o design system e evitar remendo.",
    revisor: "Vou revisar consistência, escopo e clareza da mudança.",
    qa: "Se quebrar console, tema, mobile ou regressão, devolvo para o Dev.",
    "seguranca-validacao": "Vou validar se a implementação preservou segurança.",
    "financeiro-validacao": "Se mexeu em cálculo, volta. Precisa aprovação.",
  };

  return messages[nodeId] ?? "Executando análise.";
}

function hexToGlow(hex: string): string {
  if (hex === "#E05555") return "rgba(224,85,85,0.75)";
  if (hex === "#F59E0B") return "rgba(245,158,11,0.75)";
  return "rgba(0,200,83,0.75)";
}
