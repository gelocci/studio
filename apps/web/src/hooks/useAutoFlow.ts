import { useEffect, useState } from "react";
import { apiGet, apiPut } from "../lib/api";

export type AutoFlowMode = "OFF" | "ASSISTED" | "CONTROLLED" | "FULL";

interface AutoFlowSettings {
  autoFlowMode: AutoFlowMode;
}

interface UseAutoFlowResult {
  autoFlowMode: AutoFlowMode;
  loading: boolean;
  saving: boolean;
  error: string | null;
  setAutoFlowMode: (mode: AutoFlowMode) => Promise<void>;
  reload: () => Promise<void>;
}

export function useAutoFlow(): UseAutoFlowResult {
  const [autoFlowMode, setMode] = useState<AutoFlowMode>("OFF");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function reload(): Promise<void> {
    try {
      const settings = await apiGet<AutoFlowSettings>("/settings/autoflow");
      setMode(settings.autoFlowMode);
      setError(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Falha ao carregar AutoFlow.");
    } finally {
      setLoading(false);
    }
  }

  async function setAutoFlowMode(mode: AutoFlowMode): Promise<void> {
    setSaving(true);

    try {
      const settings = await apiPut<AutoFlowSettings, AutoFlowSettings>("/settings/autoflow", {
        autoFlowMode: mode,
      });

      setMode(settings.autoFlowMode);
      setError(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Falha ao alterar AutoFlow.");
      throw cause;
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    void reload();
  }, []);

  return {
    autoFlowMode,
    loading,
    saving,
    error,
    setAutoFlowMode,
    reload,
  };
}
