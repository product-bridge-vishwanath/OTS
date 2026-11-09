import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";

export const dynamic = "force-dynamic";

const CACHE_KEY = "rooms:all";
const CACHE_TTL_SECONDS = 600;

export async function GET() {
  try {
    const cached = await redis.get(CACHE_KEY);
    if (cached) {
      return NextResponse.json({ rooms: JSON.parse(cached), cache: "hit" });
    }
  } catch {
    // Redis down: fall through to the database.
  }

  const { rows } = await db.query(
    `SELECT id, name, hourly_rate FROM rooms ORDER BY id`
  );

  try {
    await redis.set(CACHE_KEY, JSON.stringify(rows), "EX", CACHE_TTL_SECONDS);
  } catch {}

  return NextResponse.json({ rooms: rows, cache: "miss" });
}
