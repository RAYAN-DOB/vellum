import { cn } from "@/lib/utils";

/**
 * BlueprintGrid — a faint technical grid for section/card backgrounds. Pure CSS,
 * emerald-tinted hairlines. Place inside a `relative` parent.
 */
export function BlueprintGrid({
  className,
  size = 32,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(color-mix(in srgb, var(--pine) 9%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--pine) 9%, transparent) 1px, transparent 1px)",
          backgroundSize: `${size}px ${size}px`,
          maskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 85%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 85%)",
        }}
      />
    </div>
  );
}
