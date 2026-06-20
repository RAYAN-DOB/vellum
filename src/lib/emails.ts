/**
 * Transactional emails — MOCK templates, Resend-ready. No email is sent here.
 *
 * Each function returns { subject, html } in the Atelier style (bone paper,
 * ink, pine accent, cartouche header). They are pure so they can be unit-tested
 * and previewed.
 *
 * TO WIRE (later):
 *   1. npm install resend (+ optionally @react-email/components to author these
 *      as React components instead of strings).
 *   2. Set RESEND_API_KEY.
 *   3. From a server action / route handler, call
 *      resend.emails.send({ from, to, subject, html }) with the template output
 *      at the right business moment (project received, quote sent, payment
 *      confirmed, delivery ready, quote reminder).
 */

export type Email = { subject: string; html: string };

const PAPER = "#f1efe9";
const SHEET = "#faf9f5";
const INK = "#16191a";
const MUTE = "#5e665f";
const LINE = "#d8d6cc";
const PINE = "#1f6b47";

function button(label: string, href: string): string {
  return `<a href="${href}" style="display:inline-block;background:${PINE};color:#faf9f5;text-decoration:none;font-size:14px;font-weight:600;padding:12px 22px;border-radius:999px;">${label}</a>`;
}

function shell(args: {
  eyebrow: string;
  heading: string;
  body: string;
  cta?: { label: string; href: string };
}): string {
  return `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width"/></head>
<body style="margin:0;padding:24px;background:${PAPER};font-family:Georgia,'Times New Roman',serif;color:${INK};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;">
    <tr><td style="padding:4px 4px 16px;font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:${MUTE};">Vellum · ${args.eyebrow}</td></tr>
    <tr><td style="background:${SHEET};border:1px solid ${LINE};border-radius:6px;padding:28px;">
      <h1 style="margin:0 0 14px;font-size:24px;line-height:1.2;font-weight:400;color:${INK};">${args.heading}</h1>
      <p style="margin:0 0 22px;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#3a4038;">${args.body}</p>
      ${args.cta ? button(args.cta.label, args.cta.href) : ""}
    </td></tr>
    <tr><td style="padding:16px 4px;font-family:Helvetica,Arial,sans-serif;font-size:11px;line-height:1.5;color:${MUTE};">Vellum — dépôt et suivi de plans techniques. Fichiers et échanges centralisés dans votre espace.</td></tr>
  </table>
</body></html>`;
}

export function projectReceivedEmail(p: {
  clientName: string;
  projectTitle: string;
  url: string;
}): Email {
  return {
    subject: `Votre projet « ${p.projectTitle} » est bien reçu`,
    html: shell({
      eyebrow: "Projet reçu",
      heading: `Bonjour ${p.clientName}, c'est bien reçu.`,
      body: `Nous analysons votre demande pour <strong>${p.projectTitle}</strong> et un dessinateur revient vers vous très vite, avec d'éventuelles questions puis un devis clair.`,
      cta: { label: "Suivre mon projet", href: p.url },
    }),
  };
}

export function quoteSentEmail(p: {
  clientName: string;
  projectTitle: string;
  amount: string;
  url: string;
}): Email {
  return {
    subject: `Votre devis pour « ${p.projectTitle} » est disponible`,
    html: shell({
      eyebrow: "Devis disponible",
      heading: "Votre devis est prêt.",
      body: `Le dessinateur a préparé un devis pour <strong>${p.projectTitle}</strong> (${p.amount}). Vous pouvez l'examiner, ajouter des options, puis l'accepter et régler en toute sécurité. Vous ne payez qu'une fois le devis validé.`,
      cta: { label: "Voir mon devis", href: p.url },
    }),
  };
}

export function paymentConfirmedEmail(p: {
  clientName: string;
  projectTitle: string;
  url: string;
}): Email {
  return {
    subject: `Paiement confirmé — production lancée`,
    html: shell({
      eyebrow: "Paiement confirmé",
      heading: "Votre projet est lancé.",
      body: `Merci ${p.clientName}. Le dessinateur démarre la production de <strong>${p.projectTitle}</strong>. Vous serez prévenu à chaque étape : aperçu, corrections, livraison.`,
      cta: { label: "Suivre l'avancement", href: p.url },
    }),
  };
}

export function deliveryReadyEmail(p: {
  clientName: string;
  projectTitle: string;
  url: string;
}): Email {
  return {
    subject: `Votre livraison pour « ${p.projectTitle} » est prête`,
    html: shell({
      eyebrow: "Livraison prête",
      heading: "Vos fichiers sont prêts.",
      body: `La livraison de <strong>${p.projectTitle}</strong> vous attend. Vérifiez les fichiers, validez-les, ou demandez une correction si besoin — tout se passe dans votre espace.`,
      cta: { label: "Voir ma livraison", href: p.url },
    }),
  };
}

export function quoteReminderEmail(p: {
  clientName: string;
  projectTitle: string;
  daysLeft: number;
  url: string;
}): Email {
  return {
    subject: `Votre devis expire dans ${p.daysLeft} jour${p.daysLeft > 1 ? "s" : ""}`,
    html: shell({
      eyebrow: "Rappel devis",
      heading: "Votre devis vous attend.",
      body: `Le devis pour <strong>${p.projectTitle}</strong> reste valable encore ${p.daysLeft} jour${p.daysLeft > 1 ? "s" : ""}. Acceptez-le pour lancer la production — sans engagement au-delà.`,
      cta: { label: "Revoir mon devis", href: p.url },
    }),
  };
}
