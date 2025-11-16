import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogSetWithValidation } from "@/hooks/useLogSetWithValidation";
import { Id } from "convex/_generated/dataModel";
import { useState } from "react";

export function ActiveSessionExerciseForm({
  userId,
  sessionId,
}: {
  userId: Id<"users"> | null;
  sessionId: Id<"sessions"> | null;
}) {
  const [exercise, setExercise] = useState("Bench Press");
  const [load, setLoad] = useState<number>(60);
  const [reps, setReps] = useState<number>(8);
  const [rir, setRir] = useState<number>(2);

  const { onLogSet: handleLogSet, logging, lastFeedback, setLastFeedback } = useLogSetWithValidation(userId, sessionId);

  const onLogSet = async () => {
    await handleLogSet({ exercise, load, reps, rir });
  };

  return (
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
                    <div key={index} className="text-xs p-3 rounded bg-background/50 border border-border space-y-2">
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

          <button onClick={() => setLastFeedback(null)} className="text-xs mt-3 underline opacity-75 hover:opacity-100">
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
