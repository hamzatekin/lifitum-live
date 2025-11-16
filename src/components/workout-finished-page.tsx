import { useQuery } from "convex/react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

export function WorkoutFinishedPage() {
  const navigate = useNavigate();
  const { sessionId, celebrate } = useSearch({ from: "/workout-finished" });

  const sets = useQuery(
    api.sets.getSets,
    sessionId ? { sessionId: sessionId as Id<"sessions"> } : "skip"
  );
  const session = useQuery(
    api.sessions.getSession,
    sessionId ? { sessionId: sessionId as Id<"sessions"> } : "skip"
  );

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No workout session found.</p>
            <Button onClick={() => navigate({ to: "/" })} className="w-full mt-4">
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!sets || !session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // Group sets by exercise
  const exerciseGroups = sets.reduce((acc: any, set: any) => {
    if (!acc[set.exercise]) {
      acc[set.exercise] = [];
    }
    acc[set.exercise].push(set);
    return acc;
  }, {});

  const duration = session.endedAt && session.startedAt
    ? Math.round((session.endedAt - session.startedAt) / 1000 / 60)
    : 0;

  const shouldCelebrate = celebrate === "true";

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-2xl p-4 space-y-6 pb-8">
        {/* Header */}
        {shouldCelebrate ? (
          <div className="text-center space-y-2 pt-8 pb-4">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold">Workout Complete!</h1>
            <p className="text-muted-foreground">Great work on your session</p>
          </div>
        ) : (
          <div className="pt-6 pb-2">
            <h1 className="text-2xl font-bold">Workout Details</h1>
          </div>
        )}

        {/* Session Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Session Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">{sets.length}</p>
                <p className="text-sm text-muted-foreground">Total Sets</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{Object.keys(exerciseGroups).length}</p>
                <p className="text-sm text-muted-foreground">Exercises</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{duration}</p>
                <p className="text-sm text-muted-foreground">Minutes</p>
              </div>
            </div>
            <Separator />
            <div className="text-xs text-muted-foreground text-center">
              {new Date(session.startedAt).toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              })}{" "}
              -{" "}
              {session.endedAt &&
                new Date(session.endedAt).toLocaleString("en-US", {
                  timeStyle: "short",
                })}
            </div>
          </CardContent>
        </Card>

        {/* Exercise Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Exercise Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(exerciseGroups).map(([exercise, exerciseSets]: [string, any]) => (
              <div key={exercise} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-base">{exercise}</h3>
                  <span className="text-sm text-muted-foreground">
                    {exerciseSets.length} {exerciseSets.length === 1 ? "set" : "sets"}
                  </span>
                </div>

                <div className="space-y-2">
                  {exerciseSets.map((set: any, idx: number) => (
                    <div
                      key={set._id}
                      className="rounded-lg border bg-card/50 px-4 py-3 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Set {idx + 1}</span>
                        <span className="font-mono text-sm">
                          {set.load}kg × {set.reps} @RIR {set.rir}
                        </span>
                      </div>

                      {set.feedback && (
                        <div
                          className={`rounded px-3 py-2 text-xs ${
                            set.feedbackType === "excellent"
                              ? "bg-green-50 text-green-900 border border-green-200"
                              : set.feedbackType === "good"
                                ? "bg-blue-50 text-blue-900 border border-blue-200"
                                : set.feedbackType === "moderate"
                                  ? "bg-yellow-50 text-yellow-900 border border-yellow-200"
                                  : "bg-orange-50 text-orange-900 border border-orange-200"
                          }`}
                        >
                          <p className="font-medium">{set.feedback}</p>

                          {set.attribution && (
                            <div className="mt-2 pt-2 border-t border-current/20">
                              <p className="text-xs text-muted-foreground mb-2">📚 {set.attribution.text}</p>
                              {set.attribution.studies && set.attribution.studies.length > 0 && (
                                <div className="space-y-2">
                                  <p className="text-xs font-medium">Supporting Research:</p>
                                  {set.attribution.studies.slice(0, 2).map((study: any, studyIndex: number) => (
                                    <div
                                      key={studyIndex}
                                      className="text-xs p-2 rounded bg-background/50 border border-border space-y-1"
                                    >
                                      <p className="font-medium text-primary">{study.metadata?.title || "Research Study"}</p>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => window.open(study.url, "_blank", "noopener,noreferrer")}
                                        className="text-xs px-2 py-1 h-auto w-full mt-1"
                                      >
                                        🔗 Read Study
                                      </Button>
                                    </div>
                                  ))}
                                  {set.attribution.studies.length > 2 && (
                                    <p className="text-xs text-muted-foreground">
                                      ...and {set.attribution.studies.length - 2} more studies
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <Separator className="mt-4" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <Button onClick={() => navigate({ to: "/" })} className="w-full" size="lg">
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
}
