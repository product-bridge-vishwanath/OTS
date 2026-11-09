import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks: Record<string, string> = {};
  let ok = true;

  try {
    await db.query("SELECT 1");
    checks.postgres = "ok";
  } catch (e) {
    checks.postgres = `error: ${(e as Error).message}`;
    ok = false;
  }

  try {
    await redis.ping();
    checks.redis = "ok";
  } catch (e) {
    checks.redis = `error: ${(e as Error).message}`;
    ok = false;
  }

  return NextResponse.json({ ok, checks }, { status: ok ? 200 : 503 });
}
