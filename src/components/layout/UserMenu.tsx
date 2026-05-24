import { roleLabels } from "@/lib/auth";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { getCurrentUser } from "@/lib/auth";

export async function UserMenu() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <a
        href="/login"
        className="inline-flex h-9 items-center gap-1.5 rounded-[3px] border border-[#f7f3ea]/18 bg-[#f7f3ea]/5 px-3 text-xs font-medium text-[#d9d0bf] hover:bg-[#f7f3ea]/10 hover:text-[#f7f3ea]"
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
    <div className="flex items-center gap-2">
      <div className="hidden text-right sm:block">
        <p className="text-xs font-medium text-[#f7f3ea]">
          {user.profile.full_name ?? user.email}
        </p>
        <p className="text-[10px] uppercase tracking-[0.18em] text-[#8f8777]">
          {roleLabels[user.profile.role]}
        </p>
      </div>
      <span className="flex size-9 items-center justify-center rounded-full border border-[#f7f3ea]/18 bg-[#24221d] text-xs font-semibold text-[#f7f3ea]">
        {initials || "?"}
      </span>
      <SignOutButton
        variant="ghost-light"
        className="hidden sm:inline-flex"
        label="Quitter"
      />
    </div>
  );
}
