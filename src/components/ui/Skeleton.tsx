import { cn } from "@/lib/utils";

export function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-[3px] border border-line bg-vellum/70",
        className,
      )}
    />
  );
}

export function WorkspaceSkeleton() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* Top bar — matches the loaded chrome so there is no layout shift */}
      <header className="border-b border-line-strong/40 bg-ink">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="size-5 rounded-[2px] bg-paper/15" />
            <div className="h-3.5 w-16 rounded-[2px] bg-paper/15" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-9 w-16 rounded-full bg-paper/10" />
            <div className="size-9 rounded-full bg-paper/10" />
            <div className="size-9 rounded-full bg-paper/10" />
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[240px_1fr]">
        <aside className="hidden space-y-2 lg:block">
          <SkeletonBlock className="h-3 w-24 border-0 bg-vellum/60" />
          {Array.from({ length: 8 }).map((_, index) => (
            <SkeletonBlock className="h-9" key={index} />
          ))}
        </aside>
        <section className="space-y-8">
          {/* Cartouche header skeleton */}
          <header>
            <div className="flex items-center justify-between border-t border-line-strong pt-2.5">
              <SkeletonBlock className="h-2.5 w-28 border-0 bg-vellum/60" />
              <SkeletonBlock className="hidden h-2.5 w-36 border-0 bg-vellum/50 sm:block" />
            </div>
            <div className="relative mt-7 max-w-2xl pl-4">
              <span
                aria-hidden="true"
                className="absolute left-0 top-1.5 h-[calc(100%-0.5rem)] w-px bg-sienna/40"
              />
              <SkeletonBlock className="h-12 w-full" />
              <SkeletonBlock className="mt-4 h-4 w-full max-w-md border-0 bg-vellum/50" />
            </div>
            <div className="mt-8 border-b border-line" />
          </header>

          <div className="grid gap-px overflow-hidden rounded-[4px] border border-line bg-line sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <SkeletonBlock className="h-32 rounded-none border-0" key={index} />
            ))}
          </div>
          <div className="grid gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonBlock className="h-24" key={index} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
