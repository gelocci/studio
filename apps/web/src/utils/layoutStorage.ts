import type { AgentNodeType, WorkflowRun } from "../types/workflow";

interface SavedNodePosition {
  id: string;
  x: number;
  y: number;
}

interface SavedWorkflowLayout {
  workflowKey: string;
  positions: SavedNodePosition[];
  savedAt: string;
}

export function getWorkflowLayoutKey(workflow: WorkflowRun): string {
  return `gelocci-studio-layout:${workflow.project}:${workflow.title}`;
}

export function applySavedLayout(workflow: WorkflowRun): AgentNodeType[] {
  const layout = readSavedLayout(workflow);

  if (!layout) {
    return workflow.nodes;
  }

  const positionMap = new Map(layout.positions.map((item) => [item.id, item]));

  return workflow.nodes.map((node) => {
    const saved = positionMap.get(node.id);

    if (!saved) {
      return node;
    }

    return {
      ...node,
      position: {
        x: saved.x,
        y: saved.y,
      },
    };
  });
}

export function saveWorkflowLayout(workflow: WorkflowRun, nodes: AgentNodeType[]): void {
  const workflowKey = getWorkflowLayoutKey(workflow);

  const layout: SavedWorkflowLayout = {
    workflowKey,
    savedAt: new Date().toISOString(),
    positions: nodes.map((node) => ({
      id: node.id,
      x: node.position.x,
      y: node.position.y,
    })),
  };

  localStorage.setItem(workflowKey, JSON.stringify(layout));
}

export function clearWorkflowLayout(workflow: WorkflowRun): void {
  localStorage.removeItem(getWorkflowLayoutKey(workflow));
}

function readSavedLayout(workflow: WorkflowRun): SavedWorkflowLayout | null {
  const workflowKey = getWorkflowLayoutKey(workflow);
  const raw = localStorage.getItem(workflowKey);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as SavedWorkflowLayout;

    if (parsed.workflowKey !== workflowKey || !Array.isArray(parsed.positions)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}
