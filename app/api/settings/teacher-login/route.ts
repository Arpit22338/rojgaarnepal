import { NextResponse } from "next/server";
import { setSetting } from "@/lib/settings";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { enabled } = body as { enabled: boolean };
    await setSetting("teacher_login_enabled", enabled ? "true" : "false");
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error updating teacher login setting:", err);
    return new NextResponse(JSON.stringify({ error: "Failed to update setting" }), { status: 500 });
  }
}
