import IdeaDetailClient from "./IdeaDetailClient";

// Required for Next.js static export.
// Ideas are created at runtime (localStorage), so no IDs are known at build
// time. Returning [] builds the page shell once; client-side routing handles
// the actual data lookup.
export function generateStaticParams() {
  return [];
}

export default function IdeaDetailPage() {
  return <IdeaDetailClient />;
}
