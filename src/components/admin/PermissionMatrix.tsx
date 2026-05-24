"use client";

import { useTransition } from "react";
import { Loader2 } from "lucide-react";

import { togglePermissionForRoleAction } from "@/lib/actions/admin";
import type { PermissionRow, RoleRow } from "@/types/database";

type Props = {
  roles: RoleRow[];
  permissions: PermissionRow[];
  matrix: Record<string, Record<string, boolean>>; // [roleId][permissionId]
};

export function PermissionMatrix({ roles, permissions, matrix }: Props) {
  const [pending, startTransition] = useTransition();

  function toggle(roleId: string, permissionId: string, grant: boolean) {
    const fd = new FormData();
    fd.set("role_id", roleId);
    fd.set("permission_id", permissionId);
    fd.set("grant", grant ? "true" : "false");
    startTransition(() => {
      void togglePermissionForRoleAction({}, fd);
    });
  }

  const byCategory = permissions.reduce<Record<string, PermissionRow[]>>(
    (acc, perm) => {
      const key = perm.category ?? "Autre";
      (acc[key] ||= []).push(perm);
      return acc;
    },
    {},
  );

  return (
    <div className="space-y-8">
      {Object.entries(byCategory).map(([category, perms]) => (
        <section key={category}>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#8a7a5f]">
            {category}
          </h3>
          <div className="overflow-hidden rounded-[6px] border border-[#d8d0bf] bg-white/95">
            <table className="min-w-full divide-y divide-[#e8e0d0] text-sm">
              <thead className="bg-[#f8f5ed] text-left text-xs uppercase tracking-[0.18em] text-[#8a7a5f]">
                <tr>
                  <th className="px-4 py-3 font-medium">Permission</th>
                  {roles.map((role) => (
                    <th
                      key={role.id}
                      className="px-4 py-3 text-center font-medium"
                    >
                      {role.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eee8dc]">
                {perms.map((permission) => (
                  <tr key={permission.id}>
                    <td className="px-4 py-3 align-top">
                      <p className="font-medium text-[#171613]">
                        {permission.label}
                      </p>
                      <p className="mt-0.5 font-mono text-[10px] text-[#6b665a]">
                        {permission.key}
                      </p>
                      {permission.description ? (
                        <p className="mt-1 text-xs text-[#6b665a]">
                          {permission.description}
                        </p>
                      ) : null}
                    </td>
                    {roles.map((role) => {
                      const granted = matrix[role.id]?.[permission.id] ?? false;
                      const locked = role.name === "admin"; // admin always has everything
                      return (
                        <td
                          key={role.id}
                          className="px-4 py-3 text-center align-top"
                        >
                          <button
                            type="button"
                            disabled={pending || locked}
                            onClick={() =>
                              toggle(role.id, permission.id, !granted)
                            }
                            className={
                              granted
                                ? "inline-flex size-7 items-center justify-center rounded-[3px] bg-emerald-100 text-emerald-800 hover:bg-emerald-200 disabled:opacity-50"
                                : "inline-flex size-7 items-center justify-center rounded-[3px] border border-[#d8d0bf] text-[#6b665a] hover:bg-[#f0eadf] disabled:opacity-50"
                            }
                          >
                            {pending ? (
                              <Loader2 className="size-3 animate-spin" />
                            ) : granted ? (
                              "✓"
                            ) : (
                              "—"
                            )}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}
