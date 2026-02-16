import { NextRequest, NextResponse } from "next/server";

async function getGeo(ip: string) {
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=country,city,regionName`);
    if (res.ok) return await res.json();
  } catch {}
  return null;
}

async function sendTelegram(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatThread = process.env.TELEGRAM_CHAT_ID || "";
  const [chatId, threadId] = chatThread.split(":");

  if (!token || !chatId) return;

  const body: Record<string, string | number> = {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
  };
  if (threadId) body.message_thread_id = Number(threadId);

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "unknown";

    const geo = await getGeo(ip);
    const location = geo
      ? `${geo.city || "?"}, ${geo.regionName || "?"}, ${geo.country || "?"}`
      : "unknown";

    await sendTelegram(
      `🚀 <b>New Waitlist Signup!</b>\n\nEmail: <code>${email}</code>\nIP: <code>${ip}</code>\nLocation: ${location}`
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
