// src/stores/app.ts
import { create } from "zustand";

type GlobalStore = {
  deviceId: string;
  userId: string | null; // use Convex Id<"users"> type if you have codegen
  roomId: string | null; // use Convex Id<"rooms"> type if you have codegen
  setUserId: (id: string) => void;
  setRoomId: (id: string) => void;
};

function getOrCreateDeviceId() {
  const k = "liftium_device_id";
  if (typeof window === "undefined") return "ssr-" + Math.random().toString(36).slice(2);
  const existing = localStorage.getItem(k);
  if (existing) return existing;
  const id = crypto.randomUUID();
  localStorage.setItem(k, id);
  return id;
}

export const useGlobalStore = create<GlobalStore>((set) => ({
  deviceId: getOrCreateDeviceId(),
  userId: null,
  roomId: null,
  setUserId: (id) => set({ userId: id }),
  setRoomId: (id) => set({ roomId: id }),
}));
