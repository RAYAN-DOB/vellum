"use client";

import { ErrorState } from "@/components/ui/ErrorState";

export default function Error(props: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <ErrorState
      {...props}
      title="La console admin n'a pas pu charger."
      description="Les rôles, utilisateurs et politiques restent protégés côté serveur."
    />
  );
}
