import { useMutation, useQuery } from "convex/react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useGlobalStore } from "@/store/global.store";
import { api } from "convex/_generated/api";
import { useState } from "react";
import { SubscriptionStatus } from "@/components/subscription-status";
import {
  useEnsureAnonymousUser,
  useRestoreActiveSession,
  useStartWorkoutSession,
  useEndWorkoutSession,
  useLogSetWithValidation,
} from "@/hooks";

export function HomePage() {
  const [exercise, setExercise] = useState("Bench Press");
  const [load, setLoad] = useState<number>(60);
  const [reps, setReps] = useState<number>(8);
  const [rir, setRir] = useState<number>(2);

  const deviceId = useGlobalStore((s) => s.deviceId);
  const userId = useGlobalStore((s) => s.userId);
  const sessionId = useGlobalStore((s) => s.sessionId);
  const setUserId = useGlobalStore((s) => s.setUserId);
  const setSessionId = useGlobalStore((s) => s.setSessionId);

  const sets = useQuery(api.sets.getSets, sessionId ? { sessionId: sessionId as any } : "skip");
  const session = useQuery(api.sessions.getSession, sessionId ? { sessionId: sessionId as any } : "skip");
  const subscriptionStatus = useQuery(api.autumn.getSubscriptionStatus, userId ? { userId: userId as any } : "skip");
  const upgradeSubscription = useMutation(api.autumn.upgradeSubscription);

  useEnsureAnonymousUser(deviceId, userId, setUserId);
  useRestoreActiveSession(userId, sessionId, setSessionId);
  const { onStartSession, starting } = useStartWorkoutSession(userId, setSessionId);
  const { onEndSession, ending } = useEndWorkoutSession(userId);
  const { onLogSet: handleLogSet, logging, lastFeedback, setLastFeedback } = useLogSetWithValidation(userId, sessionId);

  const handleUpgrade = async (tier: string) => {
    const mockCustomerId = `cust_${Date.now()}`;
    await upgradeSubscription({ userId: userId as any, newTier: tier, autumnCustomerId: mockCustomerId });
    alert(`Upgraded to ${tier}! This would normally open Autumn's payment flow.`);
  };

  const onLogSet = async () => {
    await handleLogSet({ exercise, load, reps, rir });
  };

  const handleEndSession = async () => {
    if (!sessionId) return;
    await onEndSession(sessionId);
    setSessionId(null as any);
  };

  return (
    <div className="mx-auto w-full max-w-2xl p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">User & Workout Session</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            {userId ? (
              <span className="break-all">
                <span className="font-medium text-foreground">User ID:</span> <code>{userId}</code>
              </span>
            ) : (
              "Creating anonymous user…"
            )}
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <Button onClick={onStartSession} disabled={!userId || !!sessionId || starting} className="mt-6">
              {sessionId ? "Session Active 🟢" : starting ? "Starting…" : "Start Session"}
            </Button>
            {sessionId && (
              <Button onClick={handleEndSession} disabled={!sessionId || ending} variant="secondary">
                {ending ? "Ending…" : "End Session"}
              </Button>
            )}
          </div>

          {sessionId && (
            <div className="text-xs text-muted-foreground break-all">
              <span className="font-medium text-foreground">Session ID:</span> <code>{sessionId}</code>
              {session?.endedAt ? (
                <p className="text-red-500 mt-1">Session ended at {new Date(session.endedAt).toLocaleTimeString()}</p>
              ) : (
                <p className="text-green-500 mt-1">
                  Session started at {new Date(session?.startedAt || 0).toLocaleTimeString()}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Log Set</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="mb-1 block">Exercise</Label>
            <Input value={exercise} onChange={(e) => setExercise(e.target.value)} />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="mb-1 block">Load (kg)</Label>
              <Input type="number" value={String(load)} onChange={(e) => setLoad(Number(e.target.value))} />
            </div>
            <div>
              <Label className="mb-1 block">Reps</Label>
              <Input type="number" value={String(reps)} onChange={(e) => setReps(Number(e.target.value))} />
            </div>
            <div>
              <Label className="mb-1 block">RIR</Label>
              <Input type="number" value={String(rir)} onChange={(e) => setRir(Number(e.target.value))} />
            </div>
          </div>

          <Button onClick={onLogSet} disabled={!sessionId || !userId || logging}>
            {logging ? "Logging…" : "Log Set"}
          </Button>

          {!sessionId && <p className="text-xs text-destructive">Start a session first.</p>}

          {lastFeedback && (
            <div
              className={`rounded-lg border px-3 py-2 text-sm transition-all ${
                lastFeedback.feedbackType === "excellent"
                  ? "border-green-500 bg-green-50 text-green-900"
                  : lastFeedback.feedbackType === "good"
                    ? "border-blue-500 bg-blue-50 text-blue-900"
                    : lastFeedback.feedbackType === "moderate"
                      ? "border-yellow-500 bg-yellow-50 text-yellow-900"
                      : "border-orange-500 bg-orange-50 text-orange-900"
              }`}
            >
              <p className="font-medium">{lastFeedback.feedback}</p>
              <button
                onClick={() => setLastFeedback(null)}
                className="text-xs mt-1 underline opacity-75 hover:opacity-100"
              >
                Dismiss
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {subscriptionStatus && (
        <div className="flex justify-center">
          <SubscriptionStatus subscriptionStatus={subscriptionStatus} onUpgrade={handleUpgrade} />
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sets in Session</CardTitle>
        </CardHeader>
        <CardContent>
          {!sessionId ? (
            <p className="text-sm text-muted-foreground">No active session.</p>
          ) : sets === undefined ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : !sets || sets.length === 0 ? (
            <p className="text-sm text-muted-foreground">No sets logged.</p>
          ) : (
            <ul className="space-y-2">
              {sets.map((s: any) => (
                <li key={s._id} className="rounded-lg border bg-card px-3 py-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{s.exercise}</span>
                    <span className="text-xs text-muted-foreground">{new Date(s.createdAt).toLocaleTimeString()}</span>
                  </div>
                  <div className="text-foreground/90">
                    {s.load}kg × {s.reps} @RIR {s.rir}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Separator />
    </div>
  );
}
