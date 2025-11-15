import { PricingTable } from "autumn-js/react";

export function PricingPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-4">
      <header className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Choose your plan</h1>
        <p className="text-sm text-muted-foreground">
          These plans are powered by Autumn. Selecting a plan will open the secure Autumn checkout.
        </p>
      </header>

      <section className="rounded-xl border bg-card p-4 shadow-sm">
        <PricingTable />
      </section>
    </div>
  );
}
