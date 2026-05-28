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
      className="group relative inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-gold via-gold to-gold-deep px-4 text-sm font-semibold text-void transition-all hover:shadow-[0_0_30px_rgba(245,166,35,0.3)] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          Création du compte…
        </>
      ) : (
        <>
          <span className="relative z-10">Créer mon compte client</span>
          <ArrowRight
            className="relative z-10 size-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
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
          className="rounded-lg border border-crimson/30 bg-crimson/10 px-4 py-3 text-sm text-crimson"
        >
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p
          role="status"
          className="rounded-lg border border-emerald/30 bg-emerald/10 px-4 py-3 text-sm text-emerald"
        >
          {state.success}
        </p>
      ) : null}

      <SubmitButton />

      <p className="text-center text-sm text-silver">
        Déjà inscrit ?{" "}
        <a
          className="font-medium text-gold transition-colors hover:text-gold-soft link-underline"
          href="/login"
        >
          Se connecter
        </a>
      </p>

      <p className="text-center text-xs leading-5 text-dim">
        En créant un compte, vous acceptez les conditions de confidentialité
        Vellum et la journalisation des accès projet.
      </p>
    </form>
  );
}
