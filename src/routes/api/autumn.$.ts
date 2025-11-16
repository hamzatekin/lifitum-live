import { createFileRoute } from "@tanstack/react-router";
import { autumnHandler } from "autumn-js/tanstack";

function getUserIdFromRequest(request: Request): string {
  const userId = request.headers.get("x-user-id");
  if (!userId) {
    return "anonymous-user";
  }
  return userId;
}

export const autumnHandlerConfig = autumnHandler({
  secretKey: process.env.AUTUMN_SECRET_KEY || "mock-secret-key-for-hackathon",
  identify: async ({ request }) => {
    const userId = getUserIdFromRequest(request);

    return {
      customerId: userId,
      customerData: {
        name: "Liftium User",
        email: "user@liftium.app",
      },
    };
  },
});

export const Route = createFileRoute("/api/autumn/$")({ server: { handlers: autumnHandlerConfig } });
