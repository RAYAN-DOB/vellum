"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowRight, Loader2 } from "lucide-react";

import { signUpAction } from "@/lib/actions/auth";
import { AuthInput } from "@/components/auth/AuthInput";

const initialState = {} as { error?: string; success?: string };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="group inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-ink px-4 text-[14px] font-medium text-paper transition hover:bg-iron-hover disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          Création du compte…
        </>
      ) : (
        <>
          Créer mon compte client
          <ArrowRight
            className="size-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </>
      )}
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
          className="rounded-[3px] border border-crimson/30 bg-crimson/5 px-3 py-2 text-[13px] text-crimson"
        >
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p
          role="status"
          className="rounded-[3px] border border-moss/30 bg-moss/5 px-3 py-2 text-[13px] text-moss"
        >
          {state.success}
        </p>
      ) : null}

      <SubmitButton />

      <p className="text-center text-[13px] text-mute">
        Déjà inscrit ?{" "}
        <a
          className="draft-link cursor-pointer font-medium text-ink"
          href="/login"
        >
          Se connecter
        </a>
      </p>

      <p className="text-center text-[11px] leading-5 text-soft">
        En créant un compte, vous acceptez les conditions de confidentialité
        Vellum et la journalisation des accès projet.
      </p>
    </form>
  );
}
