import { MarkerType } from "@xyflow/react";
import type { Edge } from "@xyflow/react";
import type { AgentNodeType, WorkflowRun } from "../types/workflow";

interface RawWorkflowEdge {
  id?: string;
  source: string;
  target: string;
  animated?: boolean;
  blocked?: boolean;
}

interface RawWorkflowRun {
  id: string;
  title: string;
  project: string;
  status: string;
  summary: string;
  generatedAt?: string;
  nodes: AgentNodeType[];
  edges: RawWorkflowEdge[];
}

export function adaptWorkflow(raw: RawWorkflowRun): WorkflowRun {
  return {
    id: raw.id,
    title: raw.title,
    project: raw.project,
    status: raw.status,
    summary: raw.summary,
    generatedAt: raw.generatedAt,
    nodes: raw.nodes,
    edges: raw.edges.map(adaptEdge),
  };
}

function adaptEdge(edge: RawWorkflowEdge): Edge {
  const blocked = edge.blocked === true;

  return {
    id: edge.id ?? `${edge.source}-${edge.target}`,
    source: edge.source,
    target: edge.target,
    animated: edge.animated ?? blocked,
    style: {
      stroke: blocked ? "#E05555" : "rgba(240,244,242,0.35)",
      strokeWidth: blocked ? 2.5 : 1.6,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: blocked ? "#E05555" : "rgba(240,244,242,0.55)",
    },
  };
}
