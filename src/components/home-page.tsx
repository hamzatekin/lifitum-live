import { useQuery } from "convex/react";

import { Button } from "@/components/ui/button";
import { useGlobalStore } from "@/store/global.store";
import { api } from "convex/_generated/api";
import { useRestoreActiveSession } from "@/hooks/useRestoreActiveSession";
import { useStartWorkoutSession } from "@/hooks/useStartWorkoutSession";
import { WelcomeScreen } from "@/components/welcome-screen";
import { FinishedWorkouts } from "@/components/finished-workouts";
import { ActiveSession } from "@/components/active-session";

export function HomePage() {
  const userId = useGlobalStore((s) => s.userId);
  const sessionId = useGlobalStore((s) => s.sessionId);
  const setSessionId = useGlobalStore((s) => s.setSessionId);

  const finishedSessions = useQuery(api.sessions.getFinishedSessions, userId ? { userId: userId as any } : "skip");

  useRestoreActiveSession(userId, sessionId, setSessionId);

  const { onStartSession, starting } = useStartWorkoutSession(userId, setSessionId);

  return (
    <>
      {/* Welcome Screen for new users */}
      {!sessionId && finishedSessions !== undefined && finishedSessions.length === 0 && <WelcomeScreen />}

      {!sessionId && (
        <Button onClick={onStartSession} disabled={!userId || starting} size="lg" className="w-full">
          {starting ? "Starting Session..." : "Start Workout Session"}
        </Button>
      )}

      {/* Finished Workouts  */}
      {!sessionId && !!finishedSessions?.length && <FinishedWorkouts finishedSessions={finishedSessions} />}

      {/* Active Session */}
      {sessionId && <ActiveSession />}
    </>
  );
}
