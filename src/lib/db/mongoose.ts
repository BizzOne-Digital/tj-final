import mongoose from "mongoose";
import { getServerEnv, isDatabaseConfigured } from "@/lib/env";

declare global {
  // eslint-disable-next-line no-var
  var mongooseConn: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

const globalCache = global.mongooseConn ?? { conn: null, promise: null };
global.mongooseConn = globalCache;

export async function connectMongoose(): Promise<typeof mongoose | null> {
  if (!isDatabaseConfigured()) {
    return null;
  }

  if (globalCache.conn) {
    return globalCache.conn;
  }

  const { MONGODB_URI, MONGODB_DB_NAME } = getServerEnv();
  if (!MONGODB_URI) {
    return null;
  }

  if (!globalCache.promise) {
    globalCache.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: MONGODB_DB_NAME,
        bufferCommands: false,
      })
      .then((m) => m)
      .catch((err) => {
        globalCache.promise = null;
        throw err;
      });
  }

  try {
    globalCache.conn = await globalCache.promise;
  } catch {
    globalCache.conn = null;
    return null;
  }

  return globalCache.conn;
}

export async function withDatabase<T>(
  fn: () => Promise<T>,
): Promise<{ ok: true; data: T } | { ok: false; error: string }> {
  if (!isDatabaseConfigured()) {
    return { ok: false, error: "Database is not configured." };
  }
  try {
    await connectMongoose();
    const data = await fn();
    return { ok: true, data };
  } catch (e) {
    console.error(e);
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Database error",
    };
  }
}
