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
        content: "width=device-width, initial-scale=1, maximum-scale=5",
      },
      {
        title: "Liftium Live - AI-Powered Workout Tracking",
      },
      {
        name: "description",
        content:
          "Track your workouts with AI-powered insights. Get personalized recommendations and achieve your fitness goals faster.",
      },
      {
        name: "theme-color",
        content: "#000000",
      },
      // Open Graph / Facebook
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:title",
        content: "Liftium Live - AI-Powered Workout Tracking",
      },
      {
        property: "og:description",
        content:
          "Track your workouts with AI-powered insights. Get personalized recommendations and achieve your fitness goals faster.",
      },
      {
        property: "og:image",
        content: "/logo512.png",
      },
      // Twitter
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "twitter:title",
        content: "Liftium Live - AI-Powered Workout Tracking",
      },
      {
        name: "twitter:description",
        content:
          "Track your workouts with AI-powered insights. Get personalized recommendations and achieve your fitness goals faster.",
      },
      {
        name: "twitter:image",
        content: "/logo512.png",
      },
      // Mobile
      {
        name: "apple-mobile-web-app-capable",
        content: "yes",
      },
      {
        name: "apple-mobile-web-app-status-bar-style",
        content: "black-translucent",
      },
      {
        name: "apple-mobile-web-app-title",
        content: "Liftium",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "icon",
        type: "image/x-icon",
        href: "/favicon.ico",
      },
      {
        rel: "apple-touch-icon",
        href: "/logo192.png",
      },
      {
        rel: "manifest",
        href: "/manifest.json",
      },
    ],
  }),

  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  const isDevelopment = import.meta.env.DEV;

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <Sentry.ErrorBoundary fallback={<ErrorFallback />} showDialog>
          <AutumnWrapper>{children}</AutumnWrapper>
        </Sentry.ErrorBoundary>
        {isDevelopment && (
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
        )}
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
