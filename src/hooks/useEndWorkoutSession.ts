import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

/**
 * Hook that handles ending a workout session
 * Returns the handler function and loading state
 */
export function useEndWorkoutSession(userId: Id<"users"> | null) {
  const [ending, setEnding] = useState(false);
  const endSession = useMutation(api.sessions.endSession);
  const trackUsage = useMutation(api.autumn.trackUsage);

  const onEndSession = async (sessionId: Id<"sessions">) => {
    if (!userId || !sessionId) return;

    setEnding(true);
    try {
      await endSession({ sessionId: sessionId as any });
      // Track usage
      await trackUsage({ userId, action: "session_ended", amount: 1 });
    } catch (error) {
      console.error("Failed to end session:", error);
    } finally {
      setEnding(false);
    }
  };

  return { onEndSession, ending };
}

