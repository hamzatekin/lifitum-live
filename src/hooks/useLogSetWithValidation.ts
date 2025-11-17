import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import * as Sentry from "@sentry/tanstackstart-react";

interface LogSetInput {
  exercise: string;
  load: number;
  reps: number;
  rir: number;
}

interface SetFeedback {
  feedback: string;
  feedbackType: string;
  attribution?: {
    text: string;
    urls: string[];
    studies?: Array<{ text: string; url: string; metadata?: any }>;
  };
}

export function useLogSetWithValidation(userId: Id<"users"> | null, sessionId: Id<"sessions"> | null) {
  const [logging, setLogging] = useState(false);
  const [lastFeedback, setLastFeedback] = useState<SetFeedback | null>(null);
  const logSet = useMutation(api.sets.logSet);

  const onLogSet = async (setData: LogSetInput) => {
    if (!sessionId || !userId) return;

    setLogging(true);
    try {
      const result = await logSet({
        sessionId: sessionId as any,
        userId: userId as any,
        exercise: setData.exercise,
        load: Number(setData.load),
        reps: Number(setData.reps),
        rir: Number(setData.rir),
      });

      if (result && typeof result === "object" && "feedback" in result && "feedbackType" in result) {
        setLastFeedback({
          feedback: (result as any).feedback,
          feedbackType: (result as any).feedbackType,
          attribution: (result as any).attribution,
        });
      }

      // Track feature usage
      Sentry.captureMessage("Set logged", {
        level: "info",
        tags: { feature: "log-set", action: "success", exercise: setData.exercise },
        extra: { exercise: setData.exercise, load: setData.load, reps: setData.reps, rir: setData.rir, sessionId },
      });
    } catch (error) {
      console.error("Error logging set:", error);
      Sentry.captureException(error, {
        tags: { feature: "log-set" },
        extra: { setData, sessionId, userId },
      });
    } finally {
      setLogging(false);
    }
  };

  return { onLogSet, logging, lastFeedback, setLastFeedback };
}
