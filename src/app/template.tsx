import type { ReactNode } from "react";

/**
 * Route template — Next re-mounts this on every navigation, so its child
 * replays the `page-enter` animation (see globals.css). A calm fade+rise that
 * makes moving between pages feel fluid across the whole app. Pure CSS, so it
 * stays a Server Component and is neutralised under prefers-reduced-motion by
 * the globals reduce block.
 */
export default function Template({ children }: { children: ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
