import { connectMongoose } from "@/lib/db/mongoose";
import { isDatabaseConfigured } from "@/lib/env";
import { StoredUpload } from "@/models/StoredUpload";
import { isSafeFilename, isUploadFolder } from "@/lib/uploads";

export const runtime = "nodejs";

function notFound() {
  return new Response("Not found", { status: 404 });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ folder: string; filename: string }> },
) {
  const { folder, filename } = await params;

  if (
    !isUploadFolder(folder) ||
    filename.includes("..") ||
    filename.includes("/") ||
    filename.includes("\\") ||
    !isSafeFilename(filename)
  ) {
    return notFound();
  }
  if (!isDatabaseConfigured()) return notFound();

  const etag = `"${filename}"`;
  if (request.headers.get("if-none-match") === etag) {
    return new Response(null, {
      status: 304,
      headers: { ETag: etag, "Cache-Control": "public, max-age=31536000, immutable" },
    });
  }

  await connectMongoose();
  const doc = await StoredUpload.findOne({ folder, filename })
    .select("mimeType size data")
    .lean();
  if (!doc) return notFound();

  // lean() may hand back a BSON Binary instead of a Buffer.
  const raw = doc.data as unknown as Buffer | { buffer: Uint8Array };
  const buf = Buffer.isBuffer(raw) ? raw : Buffer.from((raw as { buffer: Uint8Array }).buffer);

  return new Response(new Uint8Array(buf), {
    status: 200,
    headers: {
      "Content-Type": doc.mimeType,
      "Content-Length": String(buf.length),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      ETag: etag,
    },
  });
}
