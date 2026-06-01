import type { ReactNode } from "react";

import { Footer } from "@/components/layout/Footer";
import { PublicHeader } from "@/components/layout/PublicHeader";

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <PublicHeader />
      <main className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 grid-paper opacity-40"
        />
        <div className="relative mx-auto max-w-3xl px-6 pb-24 pt-32 lg:px-10 lg:pt-40">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
