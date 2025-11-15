import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

interface LogSetInput {
  exercise: string;
  load: number;
  reps: number;
  rir: number;
}

interface SetFeedback {
  feedback: string;
  feedbackType: string;
}

/**
 * Hook that handles logging a set with feature access validation
 * Checks limits before allowing the user to log a set
 * Returns the handler function, loading state, and feedback from last logged set
 */
export function useLogSetWithValidation(userId: Id<"users"> | null, sessionId: Id<"sessions"> | null) {
  const [logging, setLogging] = useState(false);
  const [lastFeedback, setLastFeedback] = useState<SetFeedback | null>(null);
  const checkFeatureAccess = useMutation(api.autumn.checkFeatureAccess);
  const logSet = useMutation(api.sets.logSet);
  const trackUsage = useMutation(api.autumn.trackUsage);

  const onLogSet = async (setData: LogSetInput) => {
    if (!sessionId || !userId) return;

    // Check if user can log more sets
    const accessCheck = await checkFeatureAccess({ userId, feature: "basic_tracking" });
    const maxSets = accessCheck?.limits?.maxSets ?? 50;
    if (accessCheck?.usage?.setsLogged && accessCheck?.usage?.setsLogged >= maxSets) {
      alert(`You've reached your limit of ${maxSets} sets this month. Upgrade to log more!`);
      return;
    }

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

      // Extract feedback from the result
      if (result && "feedback" in result && "feedbackType" in result) {
        setLastFeedback({
          feedback: (result as any).feedback,
          feedbackType: (result as any).feedbackType,
        });
      }

      // Track usage
      await trackUsage({ userId, action: "set_logged", amount: 1 });
    } finally {
      setLogging(false);
    }
  };

  return { onLogSet, logging, lastFeedback, setLastFeedback };
}

