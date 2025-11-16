import { useNavigate } from "@tanstack/react-router";

export const FinishedWorkouts = ({ finishedSessions }: { finishedSessions: any[] }) => {
  const navigate = useNavigate();

  return (
    <div className="pt-4">
      <h2 className="text-xl font-semibold mb-4">Previous Workouts</h2>
      {!finishedSessions ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : finishedSessions.length === 0 ? (
        <p className="text-sm text-muted-foreground">No finished workouts yet. Start your first session!</p>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {finishedSessions.map((workout: any) => {
            const duration =
              workout.endedAt && workout.startedAt ? Math.round((workout.endedAt - workout.startedAt) / 1000 / 60) : 0;

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
                  <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
