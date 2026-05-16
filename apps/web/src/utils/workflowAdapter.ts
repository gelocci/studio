import { MarkerType } from "@xyflow/react";
import type { Edge } from "@xyflow/react";
import type { AgentNodeType, WorkflowRun } from "../types/workflow";

type EdgeKind = "forward" | "rework" | "block" | "approval";

interface RawWorkflowEdge {
  id?: string;
  source: string;
  target: string;
  animated?: boolean;
  blocked?: boolean;
  kind?: EdgeKind;
  label?: string;
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
  const kind = edge.kind ?? (edge.blocked ? "block" : "forward");
  const color = getEdgeColor(kind);
  const dashed = kind === "rework" || kind === "block";

  return {
    id: edge.id ?? `${edge.source}-${edge.target}`,
    source: edge.source,
    target: edge.target,
    animated: edge.animated ?? kind === "block",
    label: edge.label,
    data: {
      kind,
    },
    style: {
      stroke: color,
      strokeWidth: kind === "forward" ? 1.8 : 2.3,
      strokeDasharray: dashed ? "8 6" : undefined,
      opacity: kind === "rework" ? 0.72 : 1,
    },
    labelStyle: {
      fill: "rgba(240,244,242,0.62)",
      fontSize: 11,
    },
    labelBgStyle: {
      fill: "rgba(8,11,10,0.85)",
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color,
    },
  };
}

function getEdgeColor(kind: EdgeKind): string {
  if (kind === "block") return "#E05555";
  if (kind === "rework") return "#F59E0B";
  if (kind === "approval") return "#8B5CF6";
  return "rgba(240,244,242,0.42)";
}
