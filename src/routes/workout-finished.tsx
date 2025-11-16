import { createFileRoute } from "@tanstack/react-router";
import { WorkoutFinishedPage } from "@/components/workout-finished-page";

export const Route = createFileRoute("/workout-finished")({
  component: WorkoutFinishedPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      sessionId: (search.sessionId as string) || "",
      celebrate: (search.celebrate as string) || "",
    };
  },
});
