"use client";

import { useRef, useState } from "react";
import { useToast } from "@/components/admin/Toast";

export type UploadFolderName = "products" | "gallery" | "pages" | "misc";

const ACCEPT = "image/png,image/jpeg,image/webp,image/gif";
const MAX_BYTES = 8 * 1024 * 1024;
/** Vercel serverless request bodies are capped (~4.5MB), so large images are shrunk first. */
const SHRINK_ABOVE_BYTES = 3.5 * 1024 * 1024;
const MAX_DIMENSION = 2600;

async function shrinkIfNeeded(file: File): Promise<File> {
  if (file.size <= SHRINK_ABOVE_BYTES || file.type === "image/gif") return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    for (const quality of [0.9, 0.8, 0.7, 0.6]) {
      const blob: Blob | null = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/webp", quality),
      );
      if (blob && blob.size <= SHRINK_ABOVE_BYTES) {
        return new File([blob], file.name.replace(/\.\w+$/, "") + ".webp", { type: "image/webp" });
      }
    }
  } catch {
    // fall through and upload the original
  }
  return file;
}

export function ImageUploadField({
  value,
  onChange,
  folder = "pages",
  label,
  hint,
  className = "",
}: {
  value: string;
  onChange: (url: string) => void;
  folder?: UploadFolderName;
  label?: string;
  hint?: string;
  className?: string;
}) {
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [broken, setBroken] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    if (!ACCEPT.split(",").includes(file.type)) {
      toast.error("Unsupported file type. Use PNG, JPEG, WebP or GIF.");
      return;
    }
    if (file.size > MAX_BYTES * 2) {
      toast.error("That file is far too large. Please choose an image under 8MB.");
      return;
    }
    setUploading(true);
    try {
      const prepared = await shrinkIfNeeded(file);
      if (prepared.size > MAX_BYTES) {
        toast.error("Image is larger than 8MB. Please choose a smaller file.");
        return;
      }
      const body = new FormData();
      body.append("file", prepared);
      body.append("folder", folder);
      const res = await fetch("/api/upload", { method: "POST", body });
      const json = (await res.json().catch(() => ({}))) as {
        success?: boolean;
        url?: string;
        error?: string;
      };
      if (!res.ok || !json.success || !json.url) {
        toast.error(json.error ?? `Upload failed (${res.status}).`);
        return;
      }
      setBroken(false);
      onChange(json.url);
      toast.success("Image uploaded. Remember to save your changes.");
    } catch {
      toast.error("Upload failed. Check your connection and try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className={className}>
      {label ? <p className="text-sm font-medium text-slate-700">{label}</p> : null}
      <div className="mt-1 flex items-start gap-3">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
          {value && !broken ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt=""
              className="h-full w-full object-contain"
              onError={() => setBroken(true)}
            />
          ) : (
            <span className="px-1 text-center text-[11px] text-slate-400">
              {value && broken ? "Preview unavailable" : "No image"}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
              className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {uploading ? "Uploading…" : value ? "Replace" : "Upload image"}
            </button>
            {value ? (
              <button
                type="button"
                disabled={uploading}
                onClick={() => {
                  setBroken(false);
                  onChange("");
                }}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-60"
              >
                Remove
              </button>
            ) : null}
          </div>
          {value ? (
            <p className="break-all text-[11px] text-slate-400">{value}</p>
          ) : null}
          {hint ? <p className="text-xs text-slate-500">{hint}</p> : null}
        </div>
      </div>
    </div>
  );
}
