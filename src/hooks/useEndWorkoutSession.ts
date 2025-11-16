import { useState } from "react";
import { useMutation } from "convex/react";
import { useNavigate } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

/**
 * Hook that handles ending a workout session
 * Returns the handler function and loading state
 */
export function useEndWorkoutSession(userId: Id<"users"> | null) {
  const [ending, setEnding] = useState(false);
  const navigate = useNavigate();
  const endSession = useMutation(api.sessions.endSession);

  const onEndSession = async (sessionId: Id<"sessions">) => {
    if (!userId || !sessionId) return;

    setEnding(true);
    try {
      await endSession({ sessionId: sessionId as any });

      // Navigate to workout finished page with celebration flag
      navigate({
        to: "/workout-finished",
        search: { sessionId: sessionId as string, celebrate: "true" },
      });
    } catch (error) {
      console.error("Failed to end session:", error);
    } finally {
      setEnding(false);
    }
  };

  return { onEndSession, ending };
}
