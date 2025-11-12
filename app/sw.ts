import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { NetworkOnly, Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    // Change this attribute's name to your `injectionPoint`.
    // `injectionPoint` is an InjectManifest option.
    // See https://serwist.pages.dev/docs/build/configuring
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

// Add a rule to exclude Cloudflare scripts before other matchers
const runtimeCaching = [
  // Explicitly skip Cloudflare and other analytics scripts - do not cache
  {
    matcher: ({ url }: { url: URL }) =>
      url.hostname.includes("cloudflareinsights.com") ||
      url.hostname.includes("cloudflare.com") ||
      url.hostname.includes("googletagmanager.com") ||
      url.hostname.includes("google-analytics.com"),
    handler: new NetworkOnly(),
  },
  // Then apply all default cache rules
  ...defaultCache,
];

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching,
  fallbacks: {
    entries: [
      {
        url: "/~offline",
        matcher({ request }) {
          return request.destination === "document";
        },
      },
    ],
  },
});

serwist.addEventListeners();
