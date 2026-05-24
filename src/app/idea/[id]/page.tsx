import IdeaDetailClient from "./IdeaDetailClient";

// Static export requires at least one entry from generateStaticParams.
// We return a single placeholder so Next.js includes the page JS bundle.
// All real idea IDs (stored in localStorage) are resolved client-side at
// runtime — navigating via a Link works perfectly; only hard-refreshing a
// direct /idea/<id> URL hits GitHub Pages' 404 (expected static-hosting limit).
export function generateStaticParams() {
  return [{ id: "_" }];
}

export default function IdeaDetailPage() {
  return <IdeaDetailClient />;
}
