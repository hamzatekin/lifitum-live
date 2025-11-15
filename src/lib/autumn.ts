import { useGlobalStore } from "@/store/global.store";

/**
 * Helper to get the current userId for Autumn API calls
 * This ensures the server can identify the anonymous user
 */
export function getAutumnHeaders(): HeadersInit {
  const userId = useGlobalStore.getState().userId;

  if (!userId) {
    console.warn("No userId found in store for Autumn API call");
  }

  return {
    "Content-Type": "application/json",
    ...(userId && { "x-user-id": userId }),
  };
}

/**
 * Custom fetch wrapper for direct Autumn API calls (use hooks instead when possible)
 * Automatically includes the userId header
 *
 * Example:
 * ```tsx
 * const response = await autumnFetch('/check', {
 *   method: 'POST',
 *   body: JSON.stringify({ featureId: 'premium' })
 * })
 * ```
 */
export async function autumnFetch(path: string, options?: RequestInit) {
  const headers = getAutumnHeaders();

  return fetch(`/api/autumn${path}`, {
    ...options,
    headers: {
      ...headers,
      ...options?.headers,
    },
  });
}
