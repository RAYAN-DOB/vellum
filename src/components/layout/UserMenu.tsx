import { SignOutButton } from "@/components/auth/SignOutButton";
import { getCurrentUser, roleLabels } from "@/lib/auth";

export async function UserMenu() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <a
        href="/login"
        className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-graphite bg-slate/50 px-4 text-sm font-medium text-silver transition-colors hover:border-silver/30 hover:bg-slate hover:text-paper"
      >
        Se connecter
      </a>
    );
  }

  const initials = (user.profile.full_name ?? user.email)
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2);

  return (
    <div className="flex items-center gap-3">
      <div className="hidden text-right sm:block">
        <p className="text-sm font-medium text-paper">
          {user.profile.full_name ?? user.email}
        </p>
        <p className="text-xs text-dim">
          {roleLabels[user.profile.role]}
        </p>
      </div>
      <span
        aria-hidden="true"
        className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-gold/20 bg-gold/10 text-sm font-semibold text-gold"
      >
        {initials || "?"}
      </span>
      <SignOutButton
        variant="outline"
        className="hidden border-graphite text-silver hover:border-silver/30 hover:bg-slate/50 hover:text-paper sm:inline-flex"
        label="Quitter"
      />
    </div>
  );
}
