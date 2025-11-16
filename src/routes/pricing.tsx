import { createFileRoute } from "@tanstack/react-router";
import { PricingPage } from "@/components/pricing-page";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      reason: search?.reason as string | undefined,
    };
  },
});

