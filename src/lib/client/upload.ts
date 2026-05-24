"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

/**
 * Upload one or more files into the project-documents bucket and create
 * matching project_documents rows. Returns the number of successful uploads.
 *
 * RLS on the storage bucket enforces that the caller can write to the
 * project — see supabase/migrations/0003_storage_buckets.sql.
 */
export async function uploadProjectDocumentsClient(
  projectId: string,
  files: File[],
  category?: string,
): Promise<{ uploaded: number; failed: number }> {
  if (files.length === 0) return { uploaded: 0, failed: 0 };

  const supabase = createSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { uploaded: 0, failed: files.length };

  let uploaded = 0;
  let failed = 0;

  for (const file of files) {
    const safeName = file.name.replace(/[^\w.\-]+/g, "_");
    const path = `${projectId}/${Date.now()}-${safeName}`;

    const { error: storageError } = await supabase.storage
      .from("project-documents")
      .upload(path, file, {
        contentType: file.type || undefined,
        upsert: false,
      });

    if (storageError) {
      failed += 1;
      continue;
    }

    const { error: dbError } = await supabase.from("project_documents").insert({
      project_id: projectId,
      uploaded_by: user.id,
      file_name: file.name,
      file_path: path,
      file_type: file.type || null,
      file_size: file.size,
      document_category: category ?? null,
    });

    if (dbError) {
      failed += 1;
      continue;
    }

    uploaded += 1;
  }

  return { uploaded, failed };
}

/**
 * Return a short-lived signed URL for downloading a document. RLS still
 * applies — the user must be allowed to read the file.
 */
export async function getSignedDocumentUrl(
  path: string,
  bucket: "project-documents" | "deliverables" = "project-documents",
  expiresIn = 60,
): Promise<string | null> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);
  if (error || !data) return null;
  return data.signedUrl;
}
