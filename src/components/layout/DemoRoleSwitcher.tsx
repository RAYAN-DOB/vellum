import { ArrowRightLeft } from "lucide-react";

import { routes } from "@/lib/routes";

const roles = [
  { label: "Client", href: routes.roles.client },
  { label: "Manager", href: routes.roles.projectManager },
  { label: "Architecte", href: routes.roles.drafter },
  { label: "Admin", href: routes.roles.admin },
] as const;

export function DemoRoleSwitcher({ activeHref }: { activeHref: string }) {
  return (
    <div className="rounded-[24px] border border-[#d8d0bf] bg-[#fbfaf6]/82 p-3 shadow-sm backdrop-blur">
      <div className="flex items-center gap-2 px-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7a5f]">
        <ArrowRightLeft className="size-4" aria-hidden="true" />
        Demo roles
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {roles.map((role) => (
          <a
            className={
              activeHref === role.href
                ? "rounded-full bg-[#171613] px-3 py-2 text-center text-xs font-semibold text-[#f7f3ea]"
                : "rounded-full border border-[#d8d0bf] px-3 py-2 text-center text-xs font-semibold text-[#5e594d] transition hover:bg-white hover:text-[#171613]"
            }
            href={role.href}
            key={role.href}
          >
            {role.label}
          </a>
        ))}
      </div>
    </div>
  );
}
