import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Note: Groq's Whisper is STT-only. For TTS, we use browser's SpeechSynthesis API
// on the frontend which is faster and doesn't require API calls.
// This endpoint is kept for potential future TTS API integration.

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(userId);
  
  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(userId, { count: 1, resetTime: now + 60000 });
    return true;
  }
  
  if (limit.count >= 20) {
    return false;
  }
  
  limit.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!checkRateLimit(session.user.id)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait a moment." },
        { status: 429 }
      );
    }

    const { text } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    if (text.length > 5000) {
      return NextResponse.json(
        { error: "Text too long. Maximum 5000 characters." },
        { status: 400 }
      );
    }

    // Since Groq doesn't have TTS, we return a response indicating 
    // the frontend should use browser's SpeechSynthesis API
    // This is actually better UX - instant, no latency, works offline
    return NextResponse.json({
      success: true,
      method: "browser-tts",
      text: text,
      message: "Use browser SpeechSynthesis API for TTS"
    });
  } catch (error) {
    console.error("TTS error:", error);
    return NextResponse.json(
      { error: "Failed to process text-to-speech request" },
      { status: 500 }
    );
  }
}
