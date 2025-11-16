import { useGlobalStore } from "@/store/global.store";

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
