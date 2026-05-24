"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Marketplace was removed. Redirect any visitors to the home page.
export default function MarketplacePage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/");
  }, [router]);
  return null;
}
