import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { requireAdmin } from "@/lib/auth/session";
import { getServerEnv, isCloudinaryConfigured } from "@/lib/env";

export async function POST(request: Request) {
  const auth = await requireAdmin("gallery");
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }
  if (!isCloudinaryConfigured()) {
    return NextResponse.json({ error: "Cloudinary is not configured." }, { status: 503 });
  }

  const body = await request.json();
  const folder = typeof body.folder === "string" ? body.folder.slice(0, 80) : "po-select";
  const timestamp = Math.round(Date.now() / 1000);
  const env = getServerEnv();

  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  });

  const paramsToSign = {
    timestamp,
    folder,
    upload_preset: env.CLOUDINARY_UPLOAD_PRESET!,
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    env.CLOUDINARY_API_SECRET!,
  );

  return NextResponse.json({
    signature,
    timestamp,
    folder,
    apiKey: env.CLOUDINARY_API_KEY,
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    uploadPreset: env.CLOUDINARY_UPLOAD_PRESET,
  });
}
