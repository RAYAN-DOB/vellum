import type { ReactNode } from "react";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: AuthShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070706] text-[#f7f3ea]">
      {/* Subtle architectural grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(248,244,234,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(248,244,234,0.18) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="pointer-events-none absolute left-1/2 top-32 h-px w-[110vw] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#f8f4ea]/40 to-transparent shadow-[0_0_90px_rgba(248,244,234,0.25)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black via-black/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black via-black/70 to-transparent" />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <a href="/" className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-[3px] border border-[#f7f3ea]/18 bg-[#24221d] text-sm font-semibold">
            PW
          </span>
          <span>
            <span className="block text-sm font-semibold">PlanWork</span>
            <span className="hidden text-xs text-[#8f8777] sm:block">
              B2B project cockpit
            </span>
          </span>
        </a>
        <a
          className="text-xs uppercase tracking-[0.22em] text-[#8f8777] transition hover:text-[#f7f3ea]"
          href="/"
        >
          Accueil
        </a>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-16 pt-4 lg:flex-row lg:items-start lg:gap-16 lg:pt-10">
        <section className="lg:w-[42%]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d7c6a4]">
            {eyebrow}
          </p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-[#cfc6b5] sm:text-base">
            {subtitle}
          </p>

          <ul className="mt-10 space-y-4 text-sm text-[#cfc6b5]">
            <li className="flex gap-3">
              <span className="mt-1 size-1.5 shrink-0 rounded-full bg-[#d7c6a4]" />
              Comptes nominatifs par rôle (client, architecte, chef de projet, admin).
            </li>
            <li className="flex gap-3">
              <span className="mt-1 size-1.5 shrink-0 rounded-full bg-[#d7c6a4]" />
              Cloisonnement strict par projet et par organisation.
            </li>
            <li className="flex gap-3">
              <span className="mt-1 size-1.5 shrink-0 rounded-full bg-[#d7c6a4]" />
              Audit complet des actions sensibles et journal des accès.
            </li>
          </ul>
        </section>

        <section className="lg:w-[58%]">
          <div className="rounded-[8px] border border-[#34312b] bg-[#0f0e0c]/85 p-6 shadow-[0_28px_80px_rgba(0,0,0,0.55)] backdrop-blur sm:p-8">
            {children}
            {footer ? (
              <div className="mt-8 border-t border-[#34312b] pt-6 text-xs leading-5 text-[#8f8777]">
                {footer}
              </div>
            ) : null}
          </div>
        </section>
      </main>
    </div>
  );
}
