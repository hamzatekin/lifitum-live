import { useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

/**
 * Hook that restores an active session if the user has one
 * Automatically continues from a non-ended session
 */
export function useRestoreActiveSession(
  userId: Id<"users"> | null,
  sessionId: Id<"sessions"> | null,
  setSessionId: (id: Id<"sessions"> | null) => void
) {
  const activeSession = useQuery(api.sessions.getActiveSession, userId ? { userId } : "skip");

  useEffect(() => {
    // Only restore if we don't already have a session loaded
    if (sessionId || !activeSession) return;

    // If we found an active session, restore it
    if (activeSession?._id) {
      setSessionId(activeSession._id as any);
    }
  }, [activeSession, sessionId, setSessionId]);
}

