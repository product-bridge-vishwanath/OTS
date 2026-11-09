import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const rate = Number(body?.hourly_rate);
  if (!rate || rate <= 0) {
    return NextResponse.json({ error: "hourly_rate required" }, { status: 400 });
  }

  const { rows } = await db.query(
    `UPDATE rooms SET hourly_rate = $1 WHERE id = $2 RETURNING id, name, hourly_rate`,
    [rate, id]
  );
  if (rows.length === 0) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  console.log(`room.rate_updated id=${id} rate=${rate}`);
  return NextResponse.json({ room: rows[0] });
}
