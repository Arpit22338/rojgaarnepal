import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { smartAICall, parseAIJSON } from "@/lib/ai/smart-client";
import * as z from "zod";

// OWASP A03: Input validation schema
const analyzeSchema = z.object({
  questions: z.array(z.object({
    question: z.string().max(1000),
    category: z.string().max(50).optional(),
  })).min(1).max(20),
  answers: z.array(z.string().max(5000)).min(1).max(20),
  jobTitle: z.string().max(100).optional(),
  experienceLevel: z.string().max(50).optional(),
});

// Rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(userId);
  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(userId, { count: 1, resetTime: now + 60000 });
    return true;
  }
  if (limit.count >= 10) return false;
  limit.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    // OWASP A01: Authentication check
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // OWASP A04: Rate limiting
    if (!checkRateLimit(session.user.id)) {
      return NextResponse.json({ error: "Too many requests. Please wait." }, { status: 429 });
    }

    const body = await req.json();
    // OWASP A03: Input validation
    const validatedData = analyzeSchema.parse(body);

    const { questions, answers, jobTitle, experienceLevel } = validatedData;

    if (questions.length === 0) {
      return NextResponse.json(
        { success: false, error: "Questions and answers are required" },
        { status: 400 }
      );
    }

    // Build Q&A pairs for analysis
    const qaPairs = questions.map((q: any, i: number) => ({
      question: q.question,
      category: q.category || "General",
      answer: answers[i] || "No answer provided",
    }));

    const prompt = `
Analyze the following interview performance for a ${jobTitle} role (${experienceLevel}):

Interview Q&A:
${qaPairs.map((qa: any, i: number) => `
Question ${i + 1} (${qa.category}): ${qa.question}
Answer: ${qa.answer}
`).join("\n")}

Provide a comprehensive analysis.

IMPORTANT: Return ONLY a valid JSON object (no markdown, no code blocks, no extra text).
Return in this exact JSON format:
{
  "overallScore": 75,
  "summary": "brief overall assessment",
  "categoryScores": {
    "technical": 70,
    "behavioral": 75,
    "communication": 80,
    "problemSolving": 70,
    "cultureFit": 75
  },
  "questionScores": [
    {
      "questionNumber": 1,
      "question": "question text",
      "score": 7,
      "feedback": "specific feedback for this answer"
    }
  ],
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["area 1", "area 2", "area 3"],
  "recommendations": ["tip 1", "tip 2", "tip 3"],
  "hireRecommendation": "Hire|No Hire|Maybe",
  "keyTakeaways": "2-3 sentence summary of most important points"
}

Be fair but constructive in your assessment. Focus on specific, actionable feedback.
`;

    // Use Smart Client (DeepSeek R1 for logic and scoring)
    const result = await smartAICall([
      {
        role: "system",
        content: `You are an expert interview coach and hiring manager using DeepSeek reasoning. 
Analyze interview responses objectively and provide detailed, constructive feedback.
IMPORTANT: Always return ONLY valid JSON without markdown code blocks or any other text.
Be specific, actionable, and STRICT with scoring (don't inflate scores).`
      },
      { role: "user", content: prompt }
    ], {
      modelType: "reasoner",
      temperature: 0.3,
      jsonMode: true
    });

    // Parse JSON response
    let analysis: any;
    try {
      analysis = parseAIJSON<any>(result);

      // Ensure required fields exist with proper types (Defensive programming)
      analysis = {
        overallScore: analysis.overallScore || 60,
        summary: analysis.summary || "Analysis completed.",
        categoryScores: {
          technical: analysis.categoryScores?.technical || 60,
          behavioral: analysis.categoryScores?.behavioral || 60,
          communication: analysis.categoryScores?.communication || 60,
          problemSolving: analysis.categoryScores?.problemSolving || 60,
          cultureFit: analysis.categoryScores?.cultureFit || 60,
        },
        questionScores: Array.isArray(analysis.questionScores) ? analysis.questionScores : [],
        strengths: Array.isArray(analysis.strengths) ? analysis.strengths : [],
        improvements: Array.isArray(analysis.improvements) ? analysis.improvements : [],
        recommendations: Array.isArray(analysis.recommendations) ? analysis.recommendations : [],
        hireRecommendation: analysis.hireRecommendation || "Maybe",
        keyTakeaways: analysis.keyTakeaways || "Continue practicing to improve.",
      };
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      // Fallback only if JSON fails completely
      analysis = {
        overallScore: 50,
        summary: "Analysis failed to parse instructions.",
        categoryScores: { technical: 50, behavioral: 50, communication: 50, problemSolving: 50, cultureFit: 50 },
        questionScores: [],
        strengths: ["Attempted interview"],
        improvements: ["Try again"],
        recommendations: ["System analyzer temporary failure"],
        hireRecommendation: "Maybe",
        keyTakeaways: "Please retry the analysis."
      };
    }

    return NextResponse.json({ success: true, analysis });

  } catch (error) {
    console.error("Interview analysis error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to analyze interview" },
      { status: 500 }
    );
  }
}
