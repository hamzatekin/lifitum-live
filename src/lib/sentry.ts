import * as Sentry from "@sentry/tanstackstart-react";

export function initSentry() {
  // Only initialize if DSN is provided
  const dsn = import.meta.env.VITE_SENTRY_DSN;

  if (!dsn) {
    console.log("Sentry DSN not found, skipping initialization");
    return;
  }

  Sentry.init({
    dsn,
    integrations: [
      Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    // Performance Monitoring
    tracesSampleRate: 0.1, // Capture 10% of transactions
    // Session Replay
    replaysSessionSampleRate: 0.1, // Sample 10% of sessions
    replaysOnErrorSampleRate: 1.0, // Sample 100% of sessions with errors
    environment: import.meta.env.MODE,
  });
}
