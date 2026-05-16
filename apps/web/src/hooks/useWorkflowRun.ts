import { useEffect, useState } from "react";
import { mockWorkflow } from "../data/mockWorkflow";
import type { WorkflowRun } from "../types/workflow";
import { adaptWorkflow } from "../utils/workflowAdapter";

interface UseWorkflowRunResult {
  workflow: WorkflowRun;
  source: "json" | "mock";
  loading: boolean;
  error: string | null;
}

export function useWorkflowRun(): UseWorkflowRunResult {
  const [workflow, setWorkflow] = useState<WorkflowRun>(mockWorkflow);
  const [source, setSource] = useState<"json" | "mock">("mock");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadWorkflow() {
      try {
        const response = await fetch("/workflows/latest.json", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Nenhum workflow JSON publicado em public/workflows/latest.json.");
        }

        const raw = await response.json();

        if (!active) {
          return;
        }

        setWorkflow(adaptWorkflow(raw));
        setSource("json");
        setError(null);
      } catch (cause) {
        if (!active) {
          return;
        }

        setWorkflow(mockWorkflow);
        setSource("mock");
        setError(cause instanceof Error ? cause.message : "Falha ao carregar workflow.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadWorkflow();

    return () => {
      active = false;
    };
  }, []);

  return {
    workflow,
    source,
    loading,
    error,
  };
}
