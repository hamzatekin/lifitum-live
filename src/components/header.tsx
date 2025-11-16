import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useGlobalStore } from "@/store/global.store";
import { useIsPro } from "@/hooks/useIsPro";
import * as Sentry from "@sentry/tanstackstart-react";

interface HeaderProps {
  className?: string;
}

export function Header({ className = "" }: HeaderProps) {
  const navigate = useNavigate();
  const isPro = useIsPro();
  const userId = useGlobalStore((s) => s.userId);

  return (
    <header className={`pt-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Liftium Live</h1>
            <p className="text-sm text-muted-foreground mt-0.5">AI-Powered Workout Tracking</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="flex items-center gap-2">
              <div
                className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  isPro
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {isPro ? (
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>✨ Pro Member
                  </span>
                ) : (
                  "Free Plan"
                )}
              </div>
            </div>
            {!isPro && (
              <Button
                onClick={() => {
                  Sentry.captureMessage("Pricing page viewed", {
                    level: "info",
                    tags: { feature: "pricing", action: "navigate", source: "header" },
                    extra: { userId },
                  });
                  navigate({ to: "/pricing" });
                }}
                variant="outline"
                size="sm"
                className="mt-2 h-8 text-xs font-medium"
              >
                Upgrade to Pro
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="h-px bg-linear-to-r from-transparent via-border to-transparent"></div>
    </header>
  );
}
