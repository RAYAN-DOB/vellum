"use client";

import { Loader2 } from "lucide-react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/Button";
import { StatusPill } from "@/components/ui/StatusPill";
import {
  inviteUserAction,
  toggleUserActiveAction,
  updateUserRoleAction,
} from "@/lib/actions/admin";
import type { AppRole, ProfileRow } from "@/types/database";

type Props = {
  users: ProfileRow[];
  currentUserId: string;
};

const initialState = {} as { error?: string; success?: string };

const roleOptions: AppRole[] = ["client", "architect", "manager", "admin"];

function RoleForm({
  user,
  currentUserId,
}: {
  user: ProfileRow;
  currentUserId: string;
}) {
  const [state, formAction] = useActionState(updateUserRoleAction, initialState);
  return (
    <form action={formAction} className="flex items-center gap-2">
      <input type="hidden" name="user_id" value={user.id} />
      <select
        name="role"
        defaultValue={user.role}
        disabled={user.id === currentUserId}
        className="h-8 rounded-[3px] border border-[#d8d0bf] bg-white px-2 text-xs"
      >
        {roleOptions.map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </select>
      <SubmitMini label="OK" />
      {state.error ? (
        <span className="text-xs text-red-700">{state.error}</span>
      ) : null}
    </form>
  );
}

function ActiveToggle({
  user,
  currentUserId,
}: {
  user: ProfileRow;
  currentUserId: string;
}) {
  const [state, formAction] = useActionState(
    toggleUserActiveAction,
    initialState,
  );
  return (
    <form action={formAction} className="flex items-center gap-2">
      <input type="hidden" name="user_id" value={user.id} />
      <input type="hidden" name="is_active" value={(!user.is_active).toString()} />
      <SubmitMini
        label={user.is_active ? "Désactiver" : "Activer"}
        variant={user.is_active ? "danger" : "primary"}
        disabled={user.id === currentUserId}
      />
      {state.error ? (
        <span className="text-xs text-red-700">{state.error}</span>
      ) : null}
    </form>
  );
}

function SubmitMini({
  label,
  variant = "ghost",
  disabled,
}: {
  label: string;
  variant?: "ghost" | "primary" | "danger";
  disabled?: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className={
        variant === "primary"
          ? "inline-flex h-8 items-center gap-1 rounded-[3px] bg-[#171613] px-2 text-xs font-medium text-[#f7f3ea] hover:bg-[#2b2923] disabled:opacity-50"
          : variant === "danger"
            ? "inline-flex h-8 items-center gap-1 rounded-[3px] border border-red-300 bg-red-50 px-2 text-xs font-medium text-red-800 hover:bg-red-100 disabled:opacity-50"
            : "inline-flex h-8 items-center gap-1 rounded-[3px] border border-[#d8d0bf] bg-white px-2 text-xs font-medium hover:bg-[#f0eadf] disabled:opacity-50"
      }
    >
      {pending ? <Loader2 className="size-3 animate-spin" /> : null}
      {label}
    </button>
  );
}

function InviteForm() {
  const [state, formAction] = useActionState(inviteUserAction, initialState);
  return (
    <form
      action={formAction}
      className="rounded-[6px] border border-[#d8d0bf] bg-[#f8f5ed] p-4"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7a5f]">
        Inviter un utilisateur (architecte, manager, admin)
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_140px_auto] sm:items-end">
        <label className="block">
          <span className="mb-1 block text-[10px] uppercase tracking-[0.18em] text-[#8a7a5f]">
            Email
          </span>
          <input
            name="email"
            type="email"
            required
            className="h-9 w-full rounded-[3px] border border-[#d8d0bf] bg-white px-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-[10px] uppercase tracking-[0.18em] text-[#8a7a5f]">
            Nom complet
          </span>
          <input
            name="full_name"
            required
            className="h-9 w-full rounded-[3px] border border-[#d8d0bf] bg-white px-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-[10px] uppercase tracking-[0.18em] text-[#8a7a5f]">
            Rôle
          </span>
          <select
            name="role"
            defaultValue="architect"
            className="h-9 w-full rounded-[3px] border border-[#d8d0bf] bg-white px-2 text-sm"
          >
            {roleOptions.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </label>
        <Button type="submit" size="sm">
          Créer le compte
        </Button>
      </div>

      {state.error ? (
        <p className="mt-2 text-xs text-red-700">{state.error}</p>
      ) : null}
      {state.success ? (
        <p className="mt-2 break-all rounded-[3px] border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs text-emerald-900">
          {state.success}
        </p>
      ) : null}
    </form>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function UserTable({ users, currentUserId }: Props) {
  return (
    <div className="space-y-6">
      <InviteForm />

      <div className="overflow-hidden rounded-[6px] border border-[#d8d0bf] bg-white/95">
        <table className="min-w-full divide-y divide-[#e8e0d0] text-sm">
          <thead className="bg-[#f8f5ed] text-left text-xs uppercase tracking-[0.18em] text-[#8a7a5f]">
            <tr>
              <th className="px-4 py-3 font-medium">Nom</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Rôle</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3 font-medium">Créé</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eee8dc]">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-[#fdfaf3]">
                <td className="px-4 py-3 align-top">
                  <p className="font-medium text-[#171613]">
                    {user.full_name ?? "—"}
                  </p>
                  {user.company ? (
                    <p className="text-xs text-[#6b665a]">{user.company}</p>
                  ) : null}
                </td>
                <td className="px-4 py-3 align-top text-[#6b665a]">{user.email}</td>
                <td className="px-4 py-3 align-top">
                  <RoleForm user={user} currentUserId={currentUserId} />
                </td>
                <td className="px-4 py-3 align-top">
                  <StatusPill tone={user.is_active ? "green" : "neutral"}>
                    {user.is_active ? "Actif" : "Désactivé"}
                  </StatusPill>
                </td>
                <td className="px-4 py-3 align-top text-xs text-[#6b665a]">
                  {formatDate(user.created_at)}
                </td>
                <td className="px-4 py-3 align-top">
                  <ActiveToggle user={user} currentUserId={currentUserId} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
