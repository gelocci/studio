export const STUDIO_API_URL =
  import.meta.env.VITE_STUDIO_API_URL?.replace(/\/$/, "") ?? "http://localhost:3333";

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${STUDIO_API_URL}${path}`, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Erro ao chamar API: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export async function apiPost<TResponse, TBody>(path: string, body: TBody): Promise<TResponse> {
  const response = await fetch(`${STUDIO_API_URL}${path}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(`Erro ao chamar API: ${response.status} ${response.statusText}${message ? ` - ${message}` : ""}`);
  }

  return response.json() as Promise<TResponse>;
}
