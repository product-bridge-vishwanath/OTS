import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const MODEL = process.env.LLM_MODEL ?? "claude-opus-5-5";

// Front-desk assistant: answers questions about rooms and bookings.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const question = String(body?.question ?? "").slice(0, 2000);
  if (!question) {
    return NextResponse.json({ error: "question required" }, { status: 400 });
  }

  // Build the full business context fresh on every request.
  const [rooms, bookings] = await Promise.all([
    db.query(`SELECT id, name, hourly_rate FROM rooms ORDER BY id`),
    db.query(
      `SELECT b.id, r.name AS room, b.customer_name, b.date::text, b.start_hour, b.end_hour
         FROM bookings b LEFT JOIN rooms r ON r.id = b.room_id
        WHERE b.date >= CURRENT_DATE
        ORDER BY b.date, b.start_hour
        LIMIT 500`
    ),
  ]);

  const context = [
    "ROOMS:",
    ...rooms.rows.map((r) => `- [${r.id}] ${r.name}: $${r.hourly_rate}/hour`),
    "",
    "UPCOMING BOOKINGS:",
    ...bookings.rows.map(
      (b) => `- ${b.date} ${b.start_hour}:00-${b.end_hour}:00 ${b.room}: ${b.customer_name}`
    ),
  ].join("\n");

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({
      answer:
        "(offline mode — set ANTHROPIC_API_KEY to enable the assistant) " +
        `I can see ${rooms.rows.length} rooms and ${bookings.rows.length} upcoming bookings.`,
      model: "none",
    });
  }

  const client = new Anthropic();
  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system:
        "You are the front-desk assistant for Riverside Studios, a music/podcast studio rental. " +
        "Answer briefly and concretely from the booking data provided. " +
        "If the data doesn't answer the question, say so — never invent bookings or prices.",
      messages: [
        { role: "user", content: `${context}\n\nQuestion: ${question}` },
      ],
    });

    const answer = response.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n");

    console.log(
      `assistant.answered model=${MODEL} in=${response.usage.input_tokens} out=${response.usage.output_tokens}`
    );
    return NextResponse.json({ answer, model: MODEL, usage: response.usage });
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json({ error: "assistant is rate-limited, try again shortly" }, { status: 429 });
    }
    if (error instanceof Anthropic.APIError) {
      console.error(`assistant.error status=${error.status} ${error.message}`);
      return NextResponse.json({ error: "assistant unavailable" }, { status: 502 });
    }
    throw error;
  }
}
