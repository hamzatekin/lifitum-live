import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useEndWorkoutSession } from "@/hooks/useEndWorkoutSession";
import { useEnsureAnonymousUser } from "@/hooks/useEnsureAnonymousUser";
import { useRestoreActiveSession } from "@/hooks/useRestoreActiveSession";
import { useGlobalStore } from "@/store/global.store";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import { api } from "convex/_generated/api";
import { ActiveSessionExerciseForm } from "@/components/active-session-exercise-form";
import { ActiveSessionSet } from "@/components/active-session-set";

export function ActiveSession() {
  const deviceId = useGlobalStore((s) => s.deviceId);
  const userId = useGlobalStore((s) => s.userId);
  const sessionId = useGlobalStore((s) => s.sessionId);
  const setUserId = useGlobalStore((s) => s.setUserId);
  const setSessionId = useGlobalStore((s) => s.setSessionId);

  const sets = useQuery(api.sets.getSets, sessionId ? { sessionId: sessionId as any } : "skip");

  useEnsureAnonymousUser(deviceId, userId, setUserId);
  useRestoreActiveSession(userId, sessionId, setSessionId);

  const { onEndSession, ending } = useEndWorkoutSession(userId);

  const handleEndSession = async () => {
    if (!sessionId) return;
    await onEndSession(sessionId);
    setSessionId(null as any);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Active Session</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-xs text-green-600 font-medium">● Live</span>
            <Button onClick={handleEndSession} disabled={ending} variant="destructive" size="sm">
              <span className="flex items-center gap-2 text-white">
                {ending ? "Finishing..." : "Finish Session"}
                {ending && <Loader2 className="w-4 h-4 animate-spin" />}
              </span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ActiveSessionExerciseForm userId={userId} sessionId={sessionId} />
        {sets && sets.length > 0 && <ActiveSessionSet sets={sets} sessionId={sessionId} />}
      </CardContent>
    </Card>
  );
}
