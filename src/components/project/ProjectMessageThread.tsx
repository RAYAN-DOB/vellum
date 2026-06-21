"use client";

import { Loader2, MessageSquare, Send } from "lucide-react";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { sendProjectMessageAction } from "@/lib/actions/projects";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { QUICK_REPLIES } from "@/lib/designer-presets";
import { roleLabels } from "@/lib/project-display";
import { cn } from "@/lib/utils";
import type { ProjectMessageWithSender } from "@/components/project/project-detail-types";

const initialState = {} as { error?: string; success?: string };

function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function ProjectMessageThread({
  projectId,
  messages,
  currentUserId,
  currentUserRole,
}: {
  projectId: string;
  messages: ProjectMessageWithSender[];
  currentUserId: string;
  currentUserRole: string;
}) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const reduce = useReducedMotion();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [items, setItems] = useState(messages);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const channel = supabase
      .channel(`project-messages:${projectId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "project_messages",
          filter: `project_id=eq.${projectId}`,
        },
        async (payload) => {
          const next = payload.new as ProjectMessageWithSender;
          if (!next.id) return;

          const { data } = await supabase
            .from("project_messages")
            .select(
              "*, sender:profiles!project_messages_sender_id_fkey(id, full_name, role)",
            )
            .eq("id", next.id)
            .maybeSingle();

          const hydrated = (data ?? next) as ProjectMessageWithSender;
          setItems((current) => {
            if (current.some((item) => item.id === hydrated.id)) return current;
            return [
              ...current.filter(
                (item) =>
                  !item.id.startsWith("temp-") ||
                  item.body !== hydrated.body ||
                  item.sender_id !== hydrated.sender_id,
              ),
              hydrated,
            ].sort(
              (a, b) =>
                new Date(a.created_at).getTime() -
                new Date(b.created_at).getTime(),
            );
          });
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [projectId, supabase]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = textareaRef.current?.value.trim() ?? "";
    if (!body) return;

    const optimistic: ProjectMessageWithSender = {
      id: `temp-${Date.now()}`,
      project_id: projectId,
      sender_id: currentUserId,
      body,
      message_type: "message",
      metadata: {},
      created_at: new Date().toISOString(),
      sender: {
        id: currentUserId,
        full_name: "Vous",
        role: currentUserRole,
      },
    };

    setItems((current) => [...current, optimistic]);
    if (textareaRef.current) textareaRef.current.value = "";

    startTransition(async () => {
      const formData = new FormData();
      formData.set("project_id", projectId);
      formData.set("body", body);
      const result = await sendProjectMessageAction(initialState, formData);
      if (result.error) {
        toast.error(result.error);
        setItems((current) =>
          current.filter((message) => message.id !== optimistic.id),
        );
      }
    });
  }

  return (
    <section id="messages" className="rounded-[4px] border border-line bg-paper p-5 sm:p-6">
      <header className="flex items-center justify-between border-b border-line pb-4">
        <div>
          <p className="caption">Conversation</p>
          <h3 className="mt-1 font-display text-2xl text-ink">
            Fil projet live
          </h3>
        </div>
        <MessageSquare className="size-5 text-mute" aria-hidden="true" />
      </header>

      {items.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="Le fil est prêt"
          description="Posez une question, ajoutez une précision ou confirmez une décision. Le message reste dans le fil du projet."
          className="mt-4"
        />
      ) : (
        <ol className="mt-5 space-y-3">
          {items.map((message) => {
            const isSelf = message.sender_id === currentUserId;
            const isTemp = message.id.startsWith("temp-");
            return (
              <motion.li
                key={message.id}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: isTemp ? 0.7 : 1, y: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "rounded-[3px] border p-3 text-sm",
                  isSelf
                    ? "ml-8 border-ink bg-ink text-paper sm:ml-16"
                    : "mr-8 border-line bg-vellum/35 text-ink sm:mr-16",
                )}
              >
                <div
                  className={cn(
                    "mb-1 flex flex-wrap items-center justify-between gap-2 text-xs",
                    isSelf ? "text-paper/65" : "text-mute",
                  )}
                >
                  <span className="font-medium">
                    {message.sender?.full_name ?? "Système"}
                    {message.sender?.role
                      ? ` · ${roleLabels[message.sender.role] ?? message.sender.role}`
                      : null}
                  </span>
                  <span>{formatDateTime(message.created_at)}</span>
                </div>
                <p className="whitespace-pre-line leading-6">{message.body}</p>
              </motion.li>
            );
          })}
        </ol>
      )}

      <form className="mt-5" onSubmit={handleSubmit}>
        {currentUserRole !== "client" ? (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {QUICK_REPLIES.map((reply) => (
              <button
                key={reply}
                type="button"
                onClick={() => {
                  if (textareaRef.current) {
                    textareaRef.current.value = reply;
                    textareaRef.current.focus();
                  }
                }}
                className="cursor-pointer rounded-full border border-line bg-vellum/40 px-2.5 py-1 text-[11px] text-graphite transition hover:border-pine hover:text-ink"
              >
                {reply}
              </button>
            ))}
          </div>
        ) : null}
        <label htmlFor="message-body" className="sr-only">
          Votre message
        </label>
        <textarea
          id="message-body"
          ref={textareaRef}
          rows={3}
          required
          placeholder="Écrire un message au dessinateur..."
          className="block w-full rounded-[3px] border border-line-strong bg-paper px-3 py-2 text-sm text-ink outline-none transition placeholder:text-soft focus:border-ink focus:ring-2 focus:ring-ink/15"
        />
        <div className="mt-3 flex justify-end">
          <Button
            type="submit"
            disabled={pending}
            icon={
              pending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )
            }
            iconPosition="right"
          >
            {pending ? "Envoi..." : "Envoyer"}
          </Button>
        </div>
      </form>
    </section>
  );
}
