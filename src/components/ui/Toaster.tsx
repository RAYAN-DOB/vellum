"use client";

import { Toaster as SonnerToaster } from "sonner";

/**
 * App-wide toast surface — one feedback grammar for every server-action result
 * and optimistic rollback. Themed to the Vellum tokens (warm paper, ink, a
 * sienna icon accent, hairline border, restrained elevation) so notifications
 * read like the rest of the drafting system rather than a generic library.
 */
export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      gap={10}
      offset={16}
      toastOptions={{
        classNames: {
          toast:
            "rounded-[4px] border border-line-strong bg-paper text-ink shadow-[0_18px_40px_-24px_var(--ink)]",
          title: "font-sans text-[13px] font-medium text-ink",
          description: "font-sans text-[12px] leading-5 text-mute",
          actionButton: "rounded-[2px] bg-ink text-paper",
          cancelButton: "rounded-[2px] bg-vellum text-mute",
          icon: "text-sienna",
        },
      }}
    />
  );
}
