// Server component — exports generateStaticParams for static export.
// All actual rendering is delegated to the client component below,
// which reads idea data from localStorage at runtime.
export function generateStaticParams() {
  // Ideas are created at runtime (stored in localStorage), so we cannot
  // enumerate IDs at build time. Returning [] tells Next.js to build the
  // page shell once; client-side routing then fills in the data.
  return [];
}

import IdeaDetailClient from "./IdeaDetailClient";

export default function IdeaDetailPage() {
  return <IdeaDetailClient />;
}
