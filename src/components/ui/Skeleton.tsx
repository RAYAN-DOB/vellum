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
    <main className="min-h-screen bg-paper text-ink">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[240px_1fr]">
        <aside className="hidden space-y-2 lg:block">
          <SkeletonBlock className="h-4 w-24" />
          {Array.from({ length: 8 }).map((_, index) => (
            <SkeletonBlock className="h-10" key={index} />
          ))}
        </aside>
        <section className="space-y-8">
          <div className="border-b border-line pb-8">
            <SkeletonBlock className="h-3 w-32" />
            <SkeletonBlock className="mt-5 h-14 w-full max-w-2xl" />
            <SkeletonBlock className="mt-4 h-5 w-full max-w-xl" />
          </div>
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
    </main>
  );
}
