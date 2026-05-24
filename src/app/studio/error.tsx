"use client";

import { ErrorState } from "@/components/ui/ErrorState";

export default function Error(props: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <ErrorState
      {...props}
      title="L'atelier n'a pas pu charger."
      description="Les projets assignés et les livrables peuvent être rechargés en sécurité."
    />
  );
}
