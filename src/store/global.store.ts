import { Id } from "convex/_generated/dataModel";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { isBrowser } from "@/utils/ssr";

type GlobalStore = {
  deviceId: string | null;
  userId: Id<"users"> | null;
  sessionId: Id<"sessions"> | null;
  isHydrated: boolean;
  setUserId: (id: Id<"users">) => void;
  setSessionId: (id: Id<"sessions"> | null) => void;
  setDeviceId: (id: string) => void;
};

function createDeviceId(): string {
  const key = "liftium_device_id";

  try {
    const existing = localStorage.getItem(key);
    if (existing) return existing;

    const id =
      typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);

    localStorage.setItem(key, id);
    return id;
  } catch (error) {
    console.warn("Failed to access localStorage:", error);
    const fallbackId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? `fallback-${crypto.randomUUID()}`
        : `fallback-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    return fallbackId;
  }
}

const storage = createJSONStorage(() => {
  if (!isBrowser) {
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    };
  }

  return localStorage;
});

export const useGlobalStore = create<GlobalStore>()(
  persist(
    (set) => ({
      deviceId: null,
      userId: null,
      sessionId: null,
      isHydrated: false,
      setUserId: (id: Id<"users">) => set({ userId: id }),
      setSessionId: (id: Id<"sessions"> | null) => set({ sessionId: id }),
      setDeviceId: (id: string) => set({ deviceId: id }),
    }),
    {
      name: "liftium-storage",
      storage,
      partialize: (state) => ({
        deviceId: state.deviceId,
        sessionId: state.sessionId,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        if (!state.deviceId && isBrowser) {
          state.deviceId = createDeviceId();
        }
        state.isHydrated = true;
      },
    }
  )
);
