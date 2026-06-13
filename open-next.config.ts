import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import kvIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache";
import { withRegionalCache } from "@opennextjs/cloudflare/overrides/incremental-cache/regional-cache";

// Persist Next.js Data Cache in KV so `next: { revalidate }` in lib/tourApi.ts
// actually caches TourAPI responses across requests. withRegionalCache adds an
// in-colo Cache API tier in front of KV to cut round-trips.
export default defineCloudflareConfig({
  incrementalCache: withRegionalCache(kvIncrementalCache, { mode: "long-lived" }),
});
