import { useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

/**
 * Hook that ensures an anonymous user exists for the given device ID
 * Creates a user if one doesn't already exist
 */
export function useEnsureAnonymousUser(
  deviceId: string | null,
  userId: Id<"users"> | null,
  setUserId: (id: Id<"users">) => void
) {
  const ensureUser = useMutation(api.users.ensureUser);

  useEffect(() => {
    if (!deviceId || userId) return;
    ensureUser({ deviceId }).then((id: any) => setUserId(id));
  }, [deviceId, userId, ensureUser, setUserId]);
}

