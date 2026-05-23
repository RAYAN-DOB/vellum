"use client";

import { Bell, CheckCircle2 } from "lucide-react";
import { useState } from "react";

import { mockNotifications } from "@/lib/workflow";

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [read, setRead] = useState<string[]>([]);

  return (
    <div className="relative">
      <button
        aria-expanded={open}
        aria-label="Ouvrir les notifications mockees"
        className="relative inline-flex size-10 items-center justify-center rounded-full border border-[#d8d0bf] bg-[#fbfaf6]/80 text-[#5e594d] shadow-sm transition hover:bg-white hover:text-[#171613]"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <Bell className="size-4" aria-hidden="true" />
        <span className="absolute right-2 top-2 size-2 rounded-full bg-[#d7a64d]" />
      </button>

      {open ? (
        <div className="absolute right-0 top-12 z-40 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-[24px] border border-[#34312b] bg-[#10100e]/96 text-[#f7f3ea] shadow-[0_30px_100px_rgba(0,0,0,0.38)] backdrop-blur-xl">
          <div className="border-b border-[#f7f3ea]/10 px-4 py-4">
            <p className="text-sm font-semibold">Notifications projet</p>
            <p className="mt-1 text-xs text-[#9d9485]">
              Centre mocke : aucun evenement n&apos;est persiste en V1.
            </p>
          </div>
          <div className="grid gap-2 p-2">
            {mockNotifications.map((notification) => {
              const isRead = read.includes(notification.id);

              return (
                <button
                  className="rounded-[18px] border border-[#f7f3ea]/8 bg-[#f7f3ea]/5 p-3 text-left transition hover:bg-[#f7f3ea]/8"
                  key={notification.id}
                  onClick={() =>
                    setRead((current) =>
                      current.includes(notification.id)
                        ? current
                        : [...current, notification.id],
                    )
                  }
                  type="button"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-1 size-2 rounded-full ${
                        isRead ? "bg-[#6f6759]" : "bg-emerald-200"
                      }`}
                    />
                    <span className="min-w-0">
                      <span className="flex items-center gap-2 text-sm font-semibold">
                        {notification.title}
                        {isRead ? (
                          <CheckCircle2 className="size-3.5 text-emerald-200" />
                        ) : null}
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-[#bdb4a4]">
                        {notification.detail}
                      </span>
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
