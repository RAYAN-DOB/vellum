"use client";

import { Bell, Check, ExternalLink, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { NotificationRow } from "@/types/database";

type NotificationItem = Pick<
  NotificationRow,
  "id" | "title" | "body" | "link" | "read_at" | "created_at"
>;

function formatTime(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function NotificationBell() {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [pending, startTransition] = useTransition();

  const unreadCount = items.filter((item) => !item.read_at).length;

  useEffect(() => {
    let alive = true;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    async function boot() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        if (alive) setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("notifications")
        .select("id,title,body,link,read_at,created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (alive) {
        setItems((data ?? []) as NotificationItem[]);
        setLoading(false);
      }

      channel = supabase
        .channel(`notifications:${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            const next = payload.new as NotificationItem | null;
            const old = payload.old as Partial<NotificationItem> | null;

            setItems((current) => {
              if (payload.eventType === "DELETE" && old?.id) {
                return current.filter((item) => item.id !== old.id);
              }

              if (!next?.id) return current;

              const merged = [
                next,
                ...current.filter((item) => item.id !== next.id),
              ].sort(
                (a, b) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime(),
              );

              return merged.slice(0, 10);
            });
          },
        )
        .subscribe();
    }

    void boot();

    return () => {
      alive = false;
      if (channel) void supabase.removeChannel(channel);
    };
  }, [supabase]);

  function openNotification(notification: NotificationItem) {
    startTransition(async () => {
      if (!notification.read_at) {
        await supabase
          .from("notifications")
          .update({ read_at: new Date().toISOString() })
          .eq("id", notification.id);
      }

      if (notification.link) {
        setOpen(false);
        router.push(notification.link);
      } else {
        setItems((current) =>
          current.map((item) =>
            item.id === notification.id
              ? { ...item, read_at: item.read_at ?? new Date().toISOString() }
              : item,
          ),
        );
      }
    });
  }

  return (
    <div className="relative">
      <button
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} non lues` : ""}`}
        aria-expanded={open}
        className="relative inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-paper/15 bg-paper/5 text-paper transition hover:bg-paper/10"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <Bell className="size-4" aria-hidden="true" />
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-sienna px-1.5 py-0.5 text-[10px] font-semibold text-paper">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="fixed inset-x-4 top-16 z-50 overflow-hidden rounded-[4px] border border-line-strong bg-paper text-ink shadow-[0_30px_90px_rgba(13,13,12,0.22)] sm:absolute sm:inset-x-auto sm:right-0 sm:top-12 sm:w-[25rem]">
          <div className="border-b border-line px-4 py-3">
            <p className="text-sm font-semibold">Notifications</p>
            <p className="mt-1 text-xs text-mute">
              Flux temps réel des dossiers, messages, devis et livrables.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center gap-2 px-4 py-5 text-sm text-mute">
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Chargement du flux...
            </div>
          ) : items.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-mute">
              Aucune notification pour le moment.
            </div>
          ) : (
            <div className="max-h-[26rem] overflow-y-auto p-2">
              {items.map((notification) => {
                const isRead = Boolean(notification.read_at);
                return (
                  <button
                    className="group flex w-full cursor-pointer gap-3 rounded-[3px] px-3 py-3 text-left transition hover:bg-vellum/70"
                    disabled={pending}
                    key={notification.id}
                    onClick={() => openNotification(notification)}
                    type="button"
                  >
                    <span
                      aria-hidden="true"
                      className={`mt-1.5 size-2 shrink-0 rounded-full ${
                        isRead ? "bg-line-strong" : "bg-sienna"
                      }`}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-start justify-between gap-3">
                        <span className="text-sm font-medium text-ink">
                          {notification.title}
                        </span>
                        {isRead ? (
                          <Check className="size-3.5 shrink-0 text-moss" />
                        ) : null}
                      </span>
                      {notification.body ? (
                        <span className="mt-1 line-clamp-2 block text-xs leading-5 text-graphite">
                          {notification.body}
                        </span>
                      ) : null}
                      <span className="mt-2 flex items-center gap-2 text-[11px] text-mute">
                        {formatTime(notification.created_at)}
                        {notification.link ? (
                          <ExternalLink className="size-3" aria-hidden="true" />
                        ) : null}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
