import { MessageSquareText } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import type { ProjectMessage } from "@/types/message";

const roleLabel = {
  admin: "Admin",
  client: "Client",
  drafter: "Architecte",
  project_manager: "Manager",
  system: "Systeme",
} as const;

type MessageThreadProps = {
  messages: ProjectMessage[];
};

export function MessageThread({ messages }: MessageThreadProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fil projet</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {messages.map((message) => (
          <article
            className="rounded-[3px] border border-[#d8d0bf] bg-[#f8f5ed]/80 p-4"
            key={message.id}
          >
            <div className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-[3px] bg-[#171613] text-[#f7f3ea] ring-1 ring-[#34312b]">
                <MessageSquareText className="size-4" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-[#171613]">
                    {message.authorName}
                  </p>
                  <Badge tone={message.authorRole === "client" ? "blue" : "neutral"}>
                    {roleLabel[message.authorRole]}
                  </Badge>
                </div>
                <p className="mt-2 text-sm leading-6 text-[#5e594d]">
                  {message.body}
                </p>
                <p className="mt-2 text-xs text-[#8a7a5f]">{message.timestamp}</p>
              </div>
            </div>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
