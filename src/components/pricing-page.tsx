import { PricingTable } from "autumn-js/react";
import { useRouter } from "@tanstack/react-router";
import { Button } from "./ui/button";
import { ArrowLeftIcon } from "lucide-react";

export function PricingPage() {
  const router = useRouter();

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-4">
      <Button variant="ghost" onClick={() => router.history.back()} className="self-start">
        <ArrowLeftIcon className="w-4 h-4" />
        <span className="text-sm font-medium">Go Back</span>
      </Button>

      <header className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Choose your plan</h1>
      </header>

      <section className="rounded-xl border bg-card p-4 shadow-sm">
        <PricingTable />
      </section>
    </div>
  );
}
