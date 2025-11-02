export const isBrowser = typeof window !== "undefined";
export const isServer = !isBrowser;

export const browserOnly = <T>(fn: () => T): T | undefined => (isBrowser ? fn() : undefined);
