export type StudioEventType =
  | "CONNECTED"
  | "HEARTBEAT"
  | "DEMAND_CREATED"
  | "DEMAND_UPDATED"
  | "BACKLOG_ITEM_CREATED"
  | "WORKFLOW_RUN_CREATED";

export interface StudioEvent<TPayload = unknown> {
  id: string;
  type: StudioEventType;
  timestamp: string;
  payload: TPayload;
}

type StudioEventListener = (event: StudioEvent) => void;

const listeners = new Set<StudioEventListener>();

export function subscribeStudioEvents(listener: StudioEventListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function publishStudioEvent<TPayload>(type: StudioEventType, payload: TPayload): StudioEvent<TPayload> {
  const event: StudioEvent<TPayload> = {
    id: crypto.randomUUID(),
    type,
    timestamp: new Date().toISOString(),
    payload,
  };

  for (const listener of listeners) {
    listener(event);
  }

  return event;
}

export function createConnectedEvent(): StudioEvent {
  return {
    id: crypto.randomUUID(),
    type: "CONNECTED",
    timestamp: new Date().toISOString(),
    payload: { message: "Cliente conectado ao stream de eventos do Gelocci Studio." },
  };
}

export function createHeartbeatEvent(): StudioEvent {
  return {
    id: crypto.randomUUID(),
    type: "HEARTBEAT",
    timestamp: new Date().toISOString(),
    payload: { status: "alive" },
  };
}
