import { PricingTable } from "autumn-js/react";
import { useRouter, useSearch } from "@tanstack/react-router";
import { Button } from "./ui/button";
import { ArrowLeftIcon, AlertCircle } from "lucide-react";

export function PricingPage() {
  const router = useRouter();
  const search = useSearch({ from: "/pricing" });
  const isLimitReached = search?.reason === "limit_reached";

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-4">
      <header className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Choose your plan</h1>
      </header>

      {isLimitReached && (
        <div className="rounded-lg border border-orange-500 bg-orange-50 dark:bg-orange-950/20 p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-1">Room Creation Limit Reached</h3>
            <p className="text-sm text-orange-800 dark:text-orange-200">
              You've reached your limit of 100 workout sessions on the free plan. Upgrade to Pro for unlimited sessions
              and access to advanced features.
            </p>
          </div>
        </div>
      )}

      <section className="rounded-xl border bg-card p-4 shadow-sm">
        <PricingTable />
      </section>

      <Button onClick={() => router.history.back()} className="">
        <ArrowLeftIcon className="w-4 h-4" />
        <span className="text-sm font-medium">Go Back</span>
      </Button>
    </div>
  );
}
