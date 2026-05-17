import { useEffect, useState } from "react";
import { mockDemands } from "../data/mockDemands";
import { apiGet, STUDIO_API_URL } from "../lib/api";
import type { Demand, DemandOrigin, DemandPriority, DemandStatus } from "../types/demand";

interface ApiDemand {
  id: string;
  title: string;
  description: string;
  project: string;
  origin: "MANUAL" | "CONTACT" | "AUDIT" | "RADAR" | "NEWS" | "GITHUB" | "SITE_FEEDBACK";
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "NEW" | "TRIAGE" | "RUNNING" | "WAITING_APPROVAL" | "BLOCKED" | "DONE" | "REJECTED" | "ARCHIVED";
  createdAt: string;
}

interface StudioEvent {
  id: string;
  type: string;
  timestamp: string;
  payload: unknown;
}

interface UseDemandsResult {
  demands: Demand[];
  loading: boolean;
  source: "api" | "mock";
  sseStatus: "connecting" | "connected" | "error";
  lastEvent: StudioEvent | null;
  error: string | null;
  reload: () => Promise<void>;
}

export function useDemands(): UseDemandsResult {
  const [demands, setDemands] = useState<Demand[]>(mockDemands);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<"api" | "mock">("mock");
  const [sseStatus, setSseStatus] = useState<"connecting" | "connected" | "error">("connecting");
  const [lastEvent, setLastEvent] = useState<StudioEvent | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadDemands(): Promise<void> {
    try {
      const apiDemands = await apiGet<ApiDemand[]>("/demands");
      setDemands(apiDemands.map(mapApiDemand));
      setSource("api");
      setError(null);
    } catch (cause) {
      setDemands(mockDemands);
      setSource("mock");
      setError(cause instanceof Error ? cause.message : "Falha ao carregar demandas.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void loadDemands(); }, []);

  useEffect(() => {
    const eventSource = new EventSource(`${STUDIO_API_URL}/events/stream`);
    eventSource.onopen = () => setSseStatus("connected");
    eventSource.onerror = () => setSseStatus("error");
    eventSource.onmessage = (message) => {
      try {
        const event = JSON.parse(message.data) as StudioEvent;
        setLastEvent(event);
        if (["DEMAND_CREATED", "DEMAND_UPDATED", "BACKLOG_ITEM_CREATED", "WORKFLOW_RUN_CREATED"].includes(event.type)) {
          void loadDemands();
        }
      } catch {
        // Ignora eventos inválidos para não derrubar o cockpit.
      }
    };
    return () => eventSource.close();
  }, []);

  return { demands, loading, source, sseStatus, lastEvent, error, reload: loadDemands };
}

function mapApiDemand(apiDemand: ApiDemand): Demand {
  return {
    id: apiDemand.id,
    title: apiDemand.title,
    description: apiDemand.description,
    project: apiDemand.project,
    origin: mapOrigin(apiDemand.origin),
    priority: mapPriority(apiDemand.priority),
    status: mapStatus(apiDemand.status),
    createdAt: apiDemand.createdAt,
    workflowId: "latest",
  };
}

function mapOrigin(origin: ApiDemand["origin"]): DemandOrigin {
  const map: Record<ApiDemand["origin"], DemandOrigin> = {
    MANUAL: "manual",
    CONTACT: "contact",
    AUDIT: "audit",
    RADAR: "radar",
    NEWS: "news",
    GITHUB: "github",
    SITE_FEEDBACK: "site-feedback",
  };
  return map[origin];
}

function mapPriority(priority: ApiDemand["priority"]): DemandPriority {
  if (priority === "HIGH") return "Alta";
  if (priority === "LOW") return "Baixa";
  return "Média";
}

function mapStatus(status: ApiDemand["status"]): DemandStatus {
  const map: Record<ApiDemand["status"], DemandStatus> = {
    NEW: "BACKLOG",
    TRIAGE: "TRIAGE",
    RUNNING: "RUNNING",
    WAITING_APPROVAL: "WAITING_APPROVAL",
    BLOCKED: "BLOCKED",
    DONE: "DONE",
    REJECTED: "BLOCKED",
    ARCHIVED: "DONE",
  };
  return map[status];
}
