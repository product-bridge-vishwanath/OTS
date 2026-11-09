import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const { rows } = await db.query(`SELECT notes FROM bookings WHERE id = $1`, [id]);
  if (rows.length === 0) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json({ notes: rows[0].notes });
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  if (!body?.text || !body?.author) {
    return NextResponse.json({ error: "author and text required" }, { status: 400 });
  }

  // Load the current notes array, append the new note, save it back.
  const { rows } = await db.query(`SELECT notes FROM bookings WHERE id = $1`, [id]);
  if (rows.length === 0) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const notes: unknown[] = rows[0].notes ?? [];
  notes.push({
    author: String(body.author),
    text: String(body.text),
    at: new Date().toISOString(),
  });

  await db.query(`UPDATE bookings SET notes = $1 WHERE id = $2`, [
    JSON.stringify(notes),
    id,
  ]);

  return NextResponse.json({ notes });
}
