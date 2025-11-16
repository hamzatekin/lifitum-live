import { useQuery } from "convex/react";
import { useNavigate } from "@tanstack/react-router";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useGlobalStore } from "@/store/global.store";
import { api } from "convex/_generated/api";
import { useState } from "react";
import { useEndWorkoutSession } from "@/hooks/useEndWorkoutSession";
import { useEnsureAnonymousUser } from "@/hooks/useEnsureAnonymousUser";
import { useLogSetWithValidation } from "@/hooks/useLogSetWithValidation";
import { useRestoreActiveSession } from "@/hooks/useRestoreActiveSession";
import { useStartWorkoutSession } from "@/hooks/useStartWorkoutSession";
import { useIsPro } from "@/hooks/useIsPro";

export function HomePage() {
  const navigate = useNavigate();
  const isPro = useIsPro();

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

  useEnsureAnonymousUser(deviceId, userId, setUserId);
  useRestoreActiveSession(userId, sessionId, setSessionId);

  const { onStartSession, starting } = useStartWorkoutSession(userId, setSessionId);
  const { onEndSession, ending } = useEndWorkoutSession(userId);
  const { onLogSet: handleLogSet, logging, lastFeedback, setLastFeedback } = useLogSetWithValidation(userId, sessionId);

  const onLogSet = async () => {
    await handleLogSet({ exercise, load, reps, rir });
  };

  const handleEndSession = async () => {
    if (!sessionId) return;
    await onEndSession(sessionId);
    setSessionId(null as any);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-2xl p-4 space-y-6 pb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Membership Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Plan</p>
                <p className="text-2xl font-bold">
                  {isPro ? <span className="text-green-600">Pro 🌟</span> : <span className="text-gray-600">Free</span>}
                </p>
              </div>
              {!isPro && (
                <Button onClick={() => navigate({ to: "/pricing" })} size="lg">
                  Upgrade to Pro
                </Button>
              )}
            </div>
            {isPro && <p className="text-sm text-muted-foreground">You have unlimited access to all features! 🎉</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Workout Session</CardTitle>
          </CardHeader>
          <CardContent>
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
              <Label aria-disabled={!sessionId} className="mb-1 block">
                Exercise
              </Label>
              <Input value={exercise} disabled={!sessionId} onChange={(e) => setExercise(e.target.value)} />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="mb-1 block">Load (kg)</Label>
                <Input
                  type="number"
                  value={String(load)}
                  disabled={!sessionId}
                  onChange={(e) => setLoad(Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="mb-1 block">Reps</Label>
                <Input
                  type="number"
                  value={String(reps)}
                  disabled={!sessionId}
                  onChange={(e) => setReps(Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="mb-1 block">RIR</Label>
                <Input
                  type="number"
                  value={String(rir)}
                  disabled={!sessionId}
                  onChange={(e) => setRir(Number(e.target.value))}
                />
              </div>
            </div>

            <Button
              onClick={onLogSet}
              disabled={!sessionId || !userId || logging || !exercise || !load || !reps || !rir}
            >
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

                {lastFeedback.attribution && (
                  <div className="mt-3 pt-3 border-t border-current/20">
                    <p className="text-xs text-muted-foreground mb-2">📚 {lastFeedback.attribution.text}</p>
                    {lastFeedback.attribution.studies && lastFeedback.attribution.studies.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-foreground">Supporting Research:</p>
                        {lastFeedback.attribution.studies.slice(0, 3).map((study, index) => (
                          <div
                            key={index}
                            className="text-xs p-3 rounded bg-background/50 border border-border space-y-2"
                          >
                            <p className="font-medium text-primary">{study.metadata?.title || "Research Study"}</p>
                            <div className="flex items-center justify-between">
                              <a
                                href={study.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline break-all flex-1 mr-2"
                              >
                                {study.url}
                              </a>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.open(study.url, "_blank", "noopener,noreferrer")}
                                className="text-xs px-2 py-1 h-auto"
                              >
                                🔗 Read Study
                              </Button>
                            </div>
                          </div>
                        ))}
                        {lastFeedback.attribution.studies.length > 3 && (
                          <p className="text-xs text-muted-foreground">
                            ...and {lastFeedback.attribution.studies.length - 3} more studies
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={() => setLastFeedback(null)}
                  className="text-xs mt-3 underline opacity-75 hover:opacity-100"
                >
                  Dismiss
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        {sessionId && (
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
                <div className="max-h-96 overflow-y-auto space-y-2">
                  <ul className="space-y-2">
                    {sets.map((s: any) => (
                      <li key={s._id} className="rounded-lg border bg-card px-3 py-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{s.exercise}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(s.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="text-foreground/90">
                          {s.load}kg × {s.reps} @RIR {s.rir}
                        </div>
                        {s.feedback && (
                          <div
                            className={`mt-2 rounded px-2 py-1 text-xs font-medium ${
                              s.feedbackType === "excellent"
                                ? "border border-green-500 bg-green-50 text-green-900"
                                : s.feedbackType === "good"
                                  ? "border border-blue-500 bg-blue-50 text-blue-900"
                                  : s.feedbackType === "moderate"
                                    ? "border border-yellow-500 bg-yellow-50 text-yellow-900"
                                    : "border border-orange-500 bg-orange-50 text-orange-900"
                            }`}
                          >
                            {s.feedback}
                            {s.attribution && (
                              <div className="mt-1 pt-1 border-t border-current/20 space-y-1">
                                <p className="text-xs text-muted-foreground">📚 {s.attribution.text}</p>
                                {s.attribution.urls && s.attribution.urls.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {s.attribution.urls.slice(0, 2).map((url: string, urlIndex: number) => (
                                      <Button
                                        key={urlIndex}
                                        size="sm"
                                        variant="outline"
                                        onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
                                        className="text-xs px-2 py-0 h-auto"
                                      >
                                        🔗 Study {urlIndex + 1}
                                      </Button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Separator />
      </div>
    </div>
  );
}
