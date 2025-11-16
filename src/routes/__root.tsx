import { useEffect } from "react";
import { HeadContent, Scripts, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { AutumnProvider } from "autumn-js/react";
import { useGlobalStore } from "@/store/global.store";
import * as Sentry from "@sentry/tanstackstart-react";
import { initSentry } from "@/lib/sentry";

import appCss from "../styles.css?url";
import { QueryClient } from "@tanstack/react-query";

initSentry();

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Liftium Live",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <Sentry.ErrorBoundary fallback={<ErrorFallback />}>
          <AutumnWrapper>{children}</AutumnWrapper>
        </Sentry.ErrorBoundary>
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}

function ErrorFallback() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Oops! Something went wrong</h1>
      <p>We've been notified and are working on it.</p>
      <button onClick={() => window.location.reload()}>Reload page</button>
    </div>
  );
}

function AutumnWrapper({ children }: { children: React.ReactNode }) {
  const userId = useGlobalStore((state) => state.userId);

  useEffect(() => {
    const originalFetch = window.fetch;

    window.fetch = function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
      const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;

      // Only intercept Autumn API calls
      if (url.includes("/api/autumn")) {
        const headers = new Headers(init?.headers);
        if (userId) {
          headers.set("x-user-id", userId);
        }

        return originalFetch(input, {
          ...init,
          headers,
        });
      }

      // Pass through all other fetch calls unchanged
      return originalFetch(input, init);
    };

    // Cleanup: restore original fetch when component unmounts
    return () => {
      window.fetch = originalFetch;
    };
  }, [userId]);

  return <AutumnProvider>{children}</AutumnProvider>;
}
