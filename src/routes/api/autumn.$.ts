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
  secretKey: process.env.AUTUMN_SECRET_KEY,
  identify: async ({ request }) => {
    // get the user from your auth provider (example: better-auth)
    const userId = getUserIdFromRequest(request);

    return {
      customerId: userId,
      customerData: {
        name: "john doe",
        email: "john.doe@example.com",
      },
    };
  },
});

export const Route = createFileRoute("/api/autumn/$")({ server: { handlers: autumnHandlerConfig } });
