import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import * as Sentry from "@sentry/tanstackstart-react";

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

  const onStartSession = async () => {
    if (!userId) return;

    setStarting(true);
    try {
      const sessionId = await createSession({ userId: userId as any });
      setSessionId(sessionId as any);

      // Track feature usage
      Sentry.captureMessage("Workout session started", {
        level: "info",
        tags: { feature: "start-session", action: "success" },
        extra: { userId, sessionId },
      });
    } catch (error) {
      console.error("Failed to start session:", error);
      Sentry.captureException(error, {
        tags: { feature: "start-session" },
        extra: { userId },
      });
    } finally {
      setStarting(false);
    }
  };

  return { onStartSession, starting };
}
