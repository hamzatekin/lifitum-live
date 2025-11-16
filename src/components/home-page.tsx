import { useQuery } from "convex/react";
import { useNavigate } from "@tanstack/react-router";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGlobalStore } from "@/store/global.store";
import { api } from "convex/_generated/api";
import { useState } from "react";
import { useEndWorkoutSession } from "@/hooks/useEndWorkoutSession";
import { useEnsureAnonymousUser } from "@/hooks/useEnsureAnonymousUser";
import { useLogSetWithValidation } from "@/hooks/useLogSetWithValidation";
import { useRestoreActiveSession } from "@/hooks/useRestoreActiveSession";
import { useStartWorkoutSession } from "@/hooks/useStartWorkoutSession";
import { useIsPro } from "@/hooks/useIsPro";
import { WelcomeScreen } from "@/components/welcome-screen";
import * as Sentry from "@sentry/tanstackstart-react";

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
  const finishedSessions = useQuery(api.sessions.getFinishedSessions, userId ? { userId: userId as any } : "skip");

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
        {/* Header */}
        <div className="pt-6 pb-2">
          <h1 className="text-3xl font-bold">liftium-live</h1>
          <div className="mt-3 flex items-center gap-3 text-sm">
            <span className="text-muted-foreground">
              {isPro ? (
                <span className="text-green-600 font-medium">✨ Pro Member</span>
              ) : (
                <span className="text-muted-foreground">Free Plan</span>
              )}
            </span>
            {!isPro && (
              <>
                <span className="text-muted-foreground">·</span>
                <Button
                  onClick={() => {
                    Sentry.captureMessage("Pricing page viewed", {
                      level: "info",
                      tags: { feature: "pricing", action: "navigate", source: "header" },
                      extra: { userId },
                    });
                    navigate({ to: "/pricing" });
                  }}
                  variant="link"
                  className="h-auto p-0 text-sm font-medium"
                >
                  Upgrade to Pro
                </Button>
              </>
            )}
          </div>

          {/* Test Sentry Button */}
          <div className="mt-4">
            <Button
              onClick={() => {
                try {
                  throw new Error("Test Sentry Error - This is a test error to verify Sentry integration");
                } catch (error) {
                  Sentry.captureException(error, {
                    tags: { test: true, feature: "sentry-test" },
                    extra: { userAction: "Test Sentry Button Clicked" },
                  });
                  console.error("Test error sent to Sentry:", error);
                  alert("Test error sent to Sentry! Check your Sentry dashboard.");
                }
              }}
              variant="outline"
              size="sm"
            >
              🧪 Test Sentry
            </Button>
          </div>
        </div>

        {/* Welcome Screen for new users */}
        {!sessionId && finishedSessions !== undefined && finishedSessions.length === 0 && <WelcomeScreen />}

        {/* Start Session Button */}
        {!sessionId && (
          <Button onClick={onStartSession} disabled={!userId || starting} size="lg" className="w-full">
            {starting ? "Starting Session..." : "Start Workout Session"}
          </Button>
        )}

        {/* Finished Workouts - Only show when no active session */}
        {!sessionId && !!finishedSessions?.length && (
          <div className="pt-4">
            <h2 className="text-xl font-semibold mb-4">Previous Workouts</h2>
            {!finishedSessions ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : finishedSessions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No finished workouts yet. Start your first session!</p>
            ) : (
              <div className="space-y-2">
                {finishedSessions.map((workout: any) => {
                  const duration =
                    workout.endedAt && workout.startedAt
                      ? Math.round((workout.endedAt - workout.startedAt) / 1000 / 60)
                      : 0;

                  return (
                    <button
                      key={workout._id}
                      onClick={() =>
                        navigate({
                          to: "/workout-finished",
                          search: { sessionId: workout._id, celebrate: "" },
                        })
                      }
                      className="w-full rounded-lg border bg-card hover:bg-accent transition-colors px-4 py-3 text-left"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            {new Date(workout.startedAt).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(workout.startedAt).toLocaleTimeString(undefined, {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                            {duration > 0 && ` · ${duration} min`}
                          </p>
                        </div>
                        <svg
                          className="w-5 h-5 text-muted-foreground"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Active Session */}
        {sessionId && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Active Session</CardTitle>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-green-600 font-medium">● Live</span>
                  <Button onClick={handleEndSession} disabled={ending} variant="destructive" size="sm">
                    {ending ? "Finishing..." : "Finish Session"}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Log Set Form */}
              <div className="space-y-3">
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
                    <Input
                      type="number"
                      value={String(reps)}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setReps(Math.max(0, Math.min(50, val)));
                      }}
                      min="0"
                      max="50"
                    />
                  </div>
                  <div>
                    <Label className="mb-1 block">RIR</Label>
                    <Input
                      type="number"
                      value={String(rir)}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setRir(Math.max(0, Math.min(6, val)));
                      }}
                      min="0"
                      max="6"
                    />
                  </div>
                </div>

                <Button onClick={onLogSet} disabled={logging || !exercise || !load || !reps} className="w-full">
                  {logging ? "Logging..." : "Log Set"}
                </Button>

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
              </div>

              {/* Sets in Current Session */}
              {sets && sets.length > 0 && (
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-2">{sets.length} sets logged</p>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {sets.map((s: any) => (
                      <div key={s._id} className="rounded border bg-card/50 px-3 py-2 text-sm space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{s.exercise}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(s.createdAt).toLocaleTimeString(undefined, {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <div className="text-muted-foreground">
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
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
