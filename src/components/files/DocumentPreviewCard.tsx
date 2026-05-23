import {
  Camera,
  CircuitBoard,
  ClipboardList,
  Droplets,
  FileText,
  PenTool,
  Workflow,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import type { ProjectFile } from "@/types/file";

const fileMeta = {
  dwg: { label: "DWG", icon: Workflow },
  pdf: { label: "PDF", icon: FileText },
  sketch: { label: "Croquis", icon: PenTool },
  electrical_schema: { label: "Schema elec", icon: CircuitBoard },
  plumbing_schema: { label: "Schema plomberie", icon: Droplets },
  site_photo: { label: "Photo site", icon: Camera },
  project_note: { label: "Note projet", icon: ClipboardList },
} as const;

const statusLabel = {
  mock_ready: "Pret en demo",
  needs_context: "A completer",
  review_only: "Lecture seule",
  not_uploaded: "Emplacement V2",
} as const;

type DocumentPreviewCardProps = {
  file: ProjectFile;
};

export function DocumentPreviewCard({ file }: DocumentPreviewCardProps) {
  const meta = fileMeta[file.type];
  const Icon = meta.icon;

  return (
    <Card className="shadow-none" interactive>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-slate-950 text-white">
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="blue">{meta.label}</Badge>
              <Badge tone={file.status === "not_uploaded" ? "amber" : "neutral"}>
                {statusLabel[file.status]}
              </Badge>
            </div>
            <p className="mt-3 truncate text-sm font-semibold text-slate-950">
              {file.name}
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-600">
              {file.description}
            </p>
            <p className="mt-3 text-xs font-medium text-slate-500">
              {file.sizeLabel} - fichier fictif V1
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
