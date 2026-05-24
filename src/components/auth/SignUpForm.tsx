"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

import { signUpAction } from "@/lib/actions/auth";
import { AuthInput } from "@/components/auth/AuthInput";

const initialState = {} as { error?: string; success?: string };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-[3px] bg-[#f7f3ea] px-4 text-sm font-semibold text-[#171613] shadow-[0_18px_40px_rgba(248,243,234,0.18)] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? <Loader2 className="size-4 animate-spin" /> : null}
      {pending ? "Création du compte…" : "Créer mon compte client"}
    </button>
  );
}

export function SignUpForm() {
  const [state, formAction] = useActionState(signUpAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="role" value="client" />
      <div className="grid gap-5 sm:grid-cols-2">
        <AuthInput
          label="Nom complet"
          name="full_name"
          autoComplete="name"
          required
          placeholder="Prénom Nom"
        />
        <AuthInput
          label="Entreprise"
          name="company"
          autoComplete="organization"
          placeholder="Atelier ou société"
        />
      </div>
      <AuthInput
        label="Email professionnel"
        name="email"
        type="email"
        autoComplete="email"
        required
        placeholder="vous@entreprise.com"
      />
      <AuthInput
        label="Mot de passe"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        placeholder="8 caractères minimum"
        hint="Au moins 8 caractères. Évitez les mots de passe déjà utilisés."
      />

      {state.error ? (
        <p
          role="alert"
          className="rounded-[3px] border border-red-900/60 bg-red-950/40 px-3 py-2 text-sm text-red-200"
        >
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p
          role="status"
          className="rounded-[3px] border border-emerald-900/60 bg-emerald-950/40 px-3 py-2 text-sm text-emerald-200"
        >
          {state.success}
        </p>
      ) : null}

      <SubmitButton />

      <p className="text-center text-xs text-[#8f8777]">
        Déjà inscrit ?{" "}
        <a className="text-[#f7f3ea] underline-offset-4 hover:underline" href="/login">
          Se connecter
        </a>
      </p>

      <p className="text-center text-[11px] leading-5 text-[#5e594d]">
        En créant un compte, vous acceptez les conditions de confidentialité
        PlanWork et la journalisation des accès projet.
      </p>
    </form>
  );
}
