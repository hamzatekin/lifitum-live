import { useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { useCustomer } from "autumn-js/react";
import { useGlobalStore } from "@/store/global.store";

/**
 * Hook that ensures an anonymous user exists for the given device ID
 * Creates a user if one doesn't already exist
 * Also ensures the user is identified in Autumn with the free product
 */
export function useEnsureAnonymousUser() {
  const deviceId = useGlobalStore((s) => s.deviceId);
  const userId = useGlobalStore((s) => s.userId);
  const setUserId = useGlobalStore((s) => s.setUserId);
  const ensureUser = useMutation(api.users.ensureUser);
  const { refetch } = useCustomer();

  useEffect(() => {
    if (!deviceId || userId) return;

    ensureUser({ deviceId }).then((id: any) => {
      setUserId(id);
      // Trigger customer refetch to identify user in Autumn
      // This ensures the free product is assigned immediately
      setTimeout(() => refetch(), 100);
    });
  }, [deviceId, userId, ensureUser, setUserId, refetch]);
}
