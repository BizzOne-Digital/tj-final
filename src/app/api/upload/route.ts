import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { connectMongoose } from "@/lib/db/mongoose";
import { isDatabaseConfigured } from "@/lib/env";
import { StoredUpload } from "@/models/StoredUpload";
import {
  MAX_UPLOAD_BYTES,
  buildUploadUrl,
  extensionForMime,
  generateFilename,
  isAllowedMime,
  isSameOrigin,
  isUploadFolder,
  sniffImageMime,
} from "@/lib/uploads";
import { writeAudit } from "@/lib/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function fail(error: string, status: number) {
  return NextResponse.json({ success: false, error }, { status });
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return fail(auth.message, auth.status);
  if (!isSameOrigin(request)) return fail("Cross-origin request blocked.", 403);
  if (!isDatabaseConfigured()) return fail("Database is not configured.", 503);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail("Invalid form data.", 400);
  }

  const folder = form.get("folder");
  if (!isUploadFolder(folder)) {
    return fail("Invalid folder. Use one of: products, gallery, pages, misc.", 400);
  }

  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return fail("No file provided.", 400);
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return fail("File is too large. Maximum size is 8MB.", 413);
  }
  if (!isAllowedMime(file.type)) {
    return fail("Unsupported file type. Use JPEG, PNG, WebP or GIF.", 415);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const detected = sniffImageMime(buffer);
  if (!detected) {
    return fail("File content is not a valid JPEG, PNG, WebP or GIF image.", 415);
  }

  const filename = generateFilename(extensionForMime(detected));

  try {
    await connectMongoose();
    await StoredUpload.create({
      folder,
      filename,
      mimeType: detected,
      size: buffer.length,
      data: buffer,
    });
  } catch (e) {
    console.error("upload failed", e);
    return fail("Could not save the image. Please try again.", 500);
  }

  await writeAudit({
    actorId: auth.userId,
    actorEmail: auth.email,
    action: "upload.create",
    resource: "StoredUpload",
    resourceId: `${folder}/${filename}`,
    metadata: { size: buffer.length, mimeType: detected },
  }).catch(() => undefined);

  return NextResponse.json({
    success: true,
    url: buildUploadUrl(folder, filename),
    filename,
    size: buffer.length,
    folder,
  });
}
