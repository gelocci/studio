import { useEffect, useState } from "react";
import { mockWorkflow } from "../data/mockWorkflow";
import { apiGet } from "../lib/api";
import type { WorkflowRun } from "../types/workflow";
import { adaptWorkflow } from "../utils/workflowAdapter";

interface ApiWorkflowRun {
  id: string;
  project: string;
  title: string;
  status: string;
  summary?: string;
  payload: unknown;
  createdAt: string;
}

interface UseWorkflowRunResult {
  workflow: WorkflowRun;
  source: "api" | "json" | "mock";
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

export function useWorkflowRun(demandId?: string): UseWorkflowRunResult {
  const [workflow, setWorkflow] = useState<WorkflowRun>(mockWorkflow);
  const [source, setSource] = useState<"api" | "json" | "mock">("mock");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadWorkflow() {
    setLoading(true);

    try {
      if (demandId) {
        const apiWorkflowRun = await apiGet<ApiWorkflowRun>(`/workflow-runs/latest?demandId=${demandId}`);
        setWorkflow(adaptWorkflow(apiWorkflowRun.payload as Parameters<typeof adaptWorkflow>[0]));
        setSource("api");
        setError(null);
        return;
      }

      throw new Error("Nenhuma demanda selecionada.");
    } catch (apiError) {
      try {
        const response = await fetch("/workflows/latest.json", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Nenhum workflow JSON publicado em public/workflows/latest.json.");
        }

        const raw = await response.json();

        setWorkflow(adaptWorkflow(raw));
        setSource("json");
        setError(null);
      } catch {
        setWorkflow(mockWorkflow);
        setSource("mock");
        setError(apiError instanceof Error ? apiError.message : "Falha ao carregar workflow.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadWorkflow();
  }, [demandId]);

  return {
    workflow,
    source,
    loading,
    error,
    reload: loadWorkflow,
  };
}
