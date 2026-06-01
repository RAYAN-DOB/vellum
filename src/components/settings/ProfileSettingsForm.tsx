"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { updateOwnProfileAction } from "@/lib/actions/profile";
import type { ProfileRow } from "@/types/database";

type Props = { profile: ProfileRow };

const initialState = {} as { error?: string; success?: string };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      icon={pending ? <Loader2 className="size-4 animate-spin" /> : undefined}
    >
      {pending ? "Enregistrement…" : "Enregistrer"}
    </Button>
  );
}

export function ProfileSettingsForm({ profile }: Props) {
  const [state, formAction] = useActionState(
    updateOwnProfileAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-[#8a7a5f]">
            Nom complet
          </span>
          <input
            name="full_name"
            defaultValue={profile.full_name ?? ""}
            required
            className="block h-11 w-full rounded-[3px] border border-[#d8d0bf] bg-white px-3 text-sm outline-none transition focus:border-[#171613] focus:ring-2 focus:ring-[#171613]/15"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-[#8a7a5f]">
            Entreprise
          </span>
          <input
            name="company"
            defaultValue={profile.company ?? ""}
            className="block h-11 w-full rounded-[3px] border border-[#d8d0bf] bg-white px-3 text-sm outline-none transition focus:border-[#171613] focus:ring-2 focus:ring-[#171613]/15"
          />
        </label>
      </div>
      <label className="block">
        <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-[#8a7a5f]">
          Téléphone
        </span>
        <input
          name="phone"
          defaultValue={profile.phone ?? ""}
          className="block h-11 w-full rounded-[3px] border border-[#d8d0bf] bg-white px-3 text-sm outline-none transition focus:border-[#171613] focus:ring-2 focus:ring-[#171613]/15"
        />
      </label>

      <div className="rounded-[4px] border border-[#d8d0bf] bg-[#f8f5ed] p-4 text-xs leading-5 text-[#6b665a]">
        Email :{" "}
        <strong className="font-medium text-[#171613]">{profile.email}</strong>
      </div>

      {state.error ? (
        <p
          role="alert"
          className="rounded-[3px] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
        >
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p
          role="status"
          className="rounded-[3px] border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800"
        >
          {state.success}
        </p>
      ) : null}

      <SubmitButton />
    </form>
  );
}
