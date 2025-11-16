import { createFileRoute } from "@tanstack/react-router";
import { autumnHandler } from "autumn-js/tanstack";
import { env } from "cloudflare:workers";

function getUserIdFromRequest(request: Request): string {
  const userId = request.headers.get("x-user-id");
  if (!userId) {
    return "anonymous-user";
  }
  return userId;
}

if (!env.AUTUMN_SECRET_KEY) {
  throw new Error("AUTUMN_SECRET_KEY is not set in cloudflare:workers");
}

export const autumnHandlerConfig = autumnHandler({
  secretKey: env.AUTUMN_SECRET_KEY,
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
