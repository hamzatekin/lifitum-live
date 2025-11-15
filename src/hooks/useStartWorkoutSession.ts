import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

/**
 * Hook that handles starting a new workout session
 * Returns the handler function and loading state
 */
export function useStartWorkoutSession(
  userId: Id<"users"> | null,
  setSessionId: (id: Id<"sessions">) => void
) {
  const [starting, setStarting] = useState(false);
  const createSession = useMutation(api.sessions.createSession);
  const trackUsage = useMutation(api.autumn.trackUsage);

  const onStartSession = async () => {
    if (!userId) return;

    setStarting(true);
    try {
      const sessionId = await createSession({ userId: userId as any });
      setSessionId(sessionId as any);
      // Track usage
      await trackUsage({ userId, action: "session_started", amount: 1 });
    } catch (error) {
      console.error("Failed to start session:", error);
    } finally {
      setStarting(false);
    }
  };

  return { onStartSession, starting };
}

