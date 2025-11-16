import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import * as Sentry from "@sentry/tanstackstart-react";
import { useCustomer } from "autumn-js/react";

export function useStartWorkoutSession(userId: Id<"users"> | null, setSessionId: (id: Id<"sessions">) => void) {
  const [starting, setStarting] = useState(false);
  const [remainingRooms, setRemainingRooms] = useState<number | null>(null);

  const createSession = useMutation(api.sessions.createSession);
  const { check, track } = useCustomer();

  const onStartSession = async () => {
    if (!userId) return;

    setStarting(true);

    try {
      const { data } = await check({
        featureId: "room_creation",
        requiredBalance: 1,
      });

      if (!data.allowed) {
        setRemainingRooms(data.balance ?? 0);

        Sentry.captureMessage("Room creation limit reached", {
          level: "info",
          tags: { feature: "start-session", action: "limit-reached" },
          extra: {
            userId,
            usage: data.usage,
            balance: data.balance,
          },
        });

        return;
      }

      const sessionId = await createSession({ userId: userId as any });
      setSessionId(sessionId as any);

      await track({
        featureId: "room_creation",
        value: 1,
      });

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

  return {
    onStartSession,
    starting,
    remainingRooms,
  };
}
