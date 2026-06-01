import { NextResponse } from "next/server";

import { requireUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type QuotePdfRow = {
  id: string;
  reference: string | null;
  total_amount: number;
  currency: string;
  status: string;
  notes: string | null;
  valid_until: string | null;
  project: {
    reference: string | null;
    title: string;
  } | null;
  items: {
    label: string;
    quantity: number;
    unit_price: number;
    total: number;
  }[];
};

function stripForPdf(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7E]/g, " ");
}

function escapePdf(value: string) {
  return stripForPdf(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
  })
    .format(value)
    .replace(/\s/g, " ");
}

function buildPdf(quote: QuotePdfRow) {
  const lines = [
    { size: 28, text: "Vellum", x: 72, y: 760 },
    { size: 13, text: "Devis projet technique", x: 72, y: 730 },
    {
      size: 11,
      text: `Projet: ${quote.project?.reference ?? "sans ref"} - ${quote.project?.title ?? "Projet"}`,
      x: 72,
      y: 690,
    },
    {
      size: 11,
      text: `Devis: ${quote.reference ?? quote.id.slice(0, 8)} · statut ${quote.status}`,
      x: 72,
      y: 670,
    },
    {
      size: 11,
      text: quote.valid_until ? `Valable jusqu'au ${quote.valid_until}` : "Validite a confirmer",
      x: 72,
      y: 650,
    },
    { size: 12, text: "Lignes", x: 72, y: 610 },
    ...quote.items.flatMap((item, index) => {
      const y = 585 - index * 24;
      return [
        {
          size: 10,
          text: `${index + 1}. ${item.label}`,
          x: 72,
          y,
        },
        {
          size: 10,
          text: `${item.quantity} x ${formatCurrency(Number(item.unit_price), quote.currency)} = ${formatCurrency(Number(item.total), quote.currency)}`,
          x: 360,
          y,
        },
      ];
    }),
    {
      size: 16,
      text: `Total: ${formatCurrency(Number(quote.total_amount), quote.currency)}`,
      x: 360,
      y: Math.max(180, 565 - quote.items.length * 24),
    },
    {
      size: 9,
      text: "Document genere par Vellum.",
      x: 72,
      y: 84,
    },
  ];

  const stream = [
    "q",
    "0.96 0.94 0.89 rg 0 0 612 792 re f",
    "0.05 0.05 0.05 rg",
    ...lines.map(
      (line) =>
        `BT /F1 ${line.size} Tf ${line.x} ${line.y} Td (${escapePdf(line.text)}) Tj ET`,
    ),
    "Q",
  ].join("\n");

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(pdf));
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefStart = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  offsets.slice(1).forEach((offset) => {
    pdf += `${offset.toString().padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return Buffer.from(pdf, "binary");
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ quoteId: string }> },
) {
  await requireUser();
  const { quoteId } = await params;
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("quotes")
    .select(
      "*, items:quote_items(label, quantity, unit_price, total), project:projects(reference, title)",
    )
    .eq("id", quoteId)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: "Quote not found" }, { status: 404 });
  }

  const quote = data as unknown as QuotePdfRow;
  const pdf = buildPdf(quote);
  const filename = `vellum-devis-${quote.reference ?? quote.id.slice(0, 8)}.pdf`;

  return new Response(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
