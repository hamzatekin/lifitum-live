import { Button } from "@/components/ui/button";
import { Id } from "convex/_generated/dataModel";

export function ActiveSessionSet({
  sets,
}: {
  sets: {
    _id: Id<"sets">;
    _creationTime: number;

    feedback?: string | undefined;
    feedbackType?: string | undefined;
    attribution?: any;
    stimulusToFatigueRatio?: number | undefined;
    userId: Id<"users">;
    exercise: string;
    createdAt: number;
    load: number;
    reps: number;
    rir: number;
  }[];
  sessionId: Id<"sessions"> | null;
}) {
  return (
    <div className="pt-4 border-t">
      <p className="text-sm font-medium mb-2">{sets.length} sets logged</p>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {sets.map((s) => (
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
  );
}
