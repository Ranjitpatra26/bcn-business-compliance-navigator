import { createClient } from "@/lib/supabase/client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
}

export async function apiClient<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { requireAuth = true, headers, ...restOptions } = options;
  const requestHeaders = new Headers(headers as HeadersInit);

  // Let browser handle Content-Type if body is FormData (so it can set multipart boundary)
  if (!(restOptions.body instanceof FormData)) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (requireAuth) {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      requestHeaders.set("Authorization", `Bearer ${session.access_token}`);
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...restOptions,
    headers: requestHeaders,
  });

  // Handle No Content
  if (response.status === 204) {
    return {} as T;
  }

  if (response.status === 401) {
    // Optionally trigger a custom event to force logout from UI
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("bcn:unauthorized"));
    }
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw {
      status: response.status,
      code: data?.error?.code || data?.detail?.[0]?.type || "UNKNOWN_ERROR",
      message: data?.error?.message || data?.detail?.[0]?.msg || "An unexpected error occurred",
    };
  }

  return data as T;
}
