import { SignOutButton } from "@/components/auth/SignOutButton";
import { getCurrentUser, roleLabels } from "@/lib/auth";

export async function UserMenu() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <a
        href="/login"
        className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-paper/15 px-3.5 text-[12px] font-medium text-paper/80 transition hover:border-paper/40 hover:text-paper"
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
    <div className="flex items-center gap-2.5">
      <div className="hidden text-right sm:block">
        <p className="text-[12px] font-medium text-paper">
          {user.profile.full_name ?? user.email}
        </p>
        <p className="caption text-paper/55">
          {roleLabels[user.profile.role]}
        </p>
      </div>
      <span
        aria-hidden="true"
        className="flex size-9 shrink-0 items-center justify-center rounded-full border border-paper/15 bg-paper/10 text-[11px] font-medium text-paper"
      >
        {initials || "?"}
      </span>
      <SignOutButton
        variant="outline"
        className="hidden border-paper/15 text-paper/70 hover:border-paper/40 hover:bg-transparent hover:text-paper sm:inline-flex"
        label="Quitter"
      />
    </div>
  );
}
