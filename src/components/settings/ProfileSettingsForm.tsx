"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

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

  useEffect(() => {
    if (state.error) toast.error(state.error);
    if (state.success) toast.success(state.success);
  }, [state]);

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-mute">
            Nom complet
          </span>
          <input
            name="full_name"
            defaultValue={profile.full_name ?? ""}
            required
            className="block h-11 w-full rounded-[3px] border border-line-strong bg-paper px-3 text-sm outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/15"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-mute">
            Entreprise
          </span>
          <input
            name="company"
            defaultValue={profile.company ?? ""}
            className="block h-11 w-full rounded-[3px] border border-line-strong bg-paper px-3 text-sm outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/15"
          />
        </label>
      </div>
      <label className="block">
        <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-mute">
          Téléphone
        </span>
        <input
          name="phone"
          defaultValue={profile.phone ?? ""}
          className="block h-11 w-full rounded-[3px] border border-line-strong bg-paper px-3 text-sm outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/15"
        />
      </label>

      <div className="rounded-[4px] border border-line-strong bg-vellum/60 p-4 text-xs leading-5 text-mute">
        Email :{" "}
        <strong className="font-medium text-ink">{profile.email}</strong>
      </div>

      <SubmitButton />
    </form>
  );
}
