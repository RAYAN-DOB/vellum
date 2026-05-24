"use client";

import { ErrorState } from "@/components/ui/ErrorState";

export default function Error(props: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <ErrorState
      {...props}
      title="Le cockpit client n'a pas pu charger."
      description="La session ou les données projet ont rencontré un problème temporaire."
    />
  );
}
