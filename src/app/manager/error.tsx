"use client";

import { ErrorState } from "@/components/ui/ErrorState";

export default function Error(props: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <ErrorState
      {...props}
      title="Le cockpit manager n'a pas pu charger."
      description="La qualification, les devis ou l'assignation peuvent être relancés sans perdre vos droits."
    />
  );
}
