import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { callGroqAI } from "@/lib/groq";

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(userId);

  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(userId, { count: 1, resetTime: now + 60000 });
    return true;
  }

  if (limit.count >= 5) { // 5 analyses per minute
    return false;
  }

  limit.count++;
  return true;
}

interface QuestionAnswer {
  question: string;
  answer: string;
  category: string;
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

    const { jobTitle, answers } = await req.json() as {
      jobTitle: string;
      answers: QuestionAnswer[];
    };

    if (!jobTitle || !answers || !Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json(
        { error: "Job title and answers are required" },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedJobTitle = jobTitle.slice(0, 200).replace(/[<>]/g, "");
    const sanitizedAnswers = answers.slice(0, 20).map(a => ({
      question: a.question?.slice(0, 1000).replace(/[<>]/g, "") || "",
      answer: a.answer?.slice(0, 5000).replace(/[<>]/g, "") || "",
      category: a.category?.slice(0, 50) || "general"
    }));

    const systemPrompt = `You are an expert interview coach and HR specialist. Analyze the following interview responses for a ${sanitizedJobTitle} position.

Evaluate each answer based on:
1. Technical accuracy and depth
2. Communication clarity and structure (STAR method usage)
3. Problem-solving approach
4. Cultural fit indicators
5. Behavioral competencies

Provide a comprehensive analysis in the following JSON format:
{
  "overallScore": <number 0-100>,
  "summary": "<2-3 sentence summary of overall performance>",
  "hireRecommendation": "<Strong Hire | Hire | Maybe | No Hire>",
  "categoryScores": {
    "technical": <number 0-10>,
    "behavioral": <number 0-10>,
    "communication": <number 0-10>,
    "problemSolving": <number 0-10>,
    "cultureFit": <number 0-10>
  },
  "questionScores": [
    {
      "questionIndex": <number>,
      "score": <number 0-10>,
      "feedback": "<brief feedback>"
    }
  ],
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "improvements": ["<improvement 1>", "<improvement 2>", "<improvement 3>"],
  "recommendations": ["<recommendation 1>", "<recommendation 2>", "<recommendation 3>"],
  "keyTakeaways": "<Most important insight from this interview>"
}

Be constructive, specific, and actionable in your feedback. ONLY return valid JSON, no other text.`;

    const userPrompt = `Interview for: ${sanitizedJobTitle}

Questions and Answers:
${sanitizedAnswers.map((qa, i) => `
Question ${i + 1} (${qa.category}):
${qa.question}

Candidate's Answer:
${qa.answer || "[No answer provided - candidate skipped this question]"}
`).join("\n---\n")}

Analyze this interview and provide detailed feedback.`;

    const response = await callGroqAI([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ], {
      temperature: 0.3,
      maxTokens: 4096
    });

    // Parse JSON response with improved handling
    let analysis;
    try {
      // Extract JSON from response (handle multiple formats)
      let jsonStr = response.trim();

      // Try markdown code block first
      const codeBlockMatch = response.match(/```(?:json)?[\s\n]*(\{[\s\S]*?\})[\s\n]*```/);
      if (codeBlockMatch) {
        jsonStr = codeBlockMatch[1];
      } else {
        // Try to find JSON object directly
        const jsonObjectMatch = response.match(/\{[\s\S]*\}/);
        if (jsonObjectMatch) {
          jsonStr = jsonObjectMatch[0];
        }
      }

      analysis = JSON.parse(jsonStr);

      // Validate and ensure required fields exist with proper types
      analysis = {
        overallScore: typeof analysis.overallScore === 'number' ? analysis.overallScore : 60,
        summary: analysis.summary || "Interview analysis completed.",
        hireRecommendation: analysis.hireRecommendation || "Maybe",
        categoryScores: {
          technical: typeof analysis.categoryScores?.technical === 'number' ? analysis.categoryScores.technical : 6,
          behavioral: typeof analysis.categoryScores?.behavioral === 'number' ? analysis.categoryScores.behavioral : 6,
          communication: typeof analysis.categoryScores?.communication === 'number' ? analysis.categoryScores.communication : 6,
          problemSolving: typeof analysis.categoryScores?.problemSolving === 'number' ? analysis.categoryScores.problemSolving : 6,
          cultureFit: typeof analysis.categoryScores?.cultureFit === 'number' ? analysis.categoryScores.cultureFit : 6,
        },
        questionScores: Array.isArray(analysis.questionScores) ? analysis.questionScores.map((q: { questionIndex?: number; score?: number; feedback?: string }, i: number) => ({
          questionIndex: typeof q.questionIndex === 'number' ? q.questionIndex : i,
          score: typeof q.score === 'number' ? q.score : 6,
          feedback: q.feedback || "Answer evaluated."
        })) : sanitizedAnswers.map((_, i) => ({
          questionIndex: i,
          score: 6,
          feedback: "Answer evaluated."
        })),
        strengths: Array.isArray(analysis.strengths) ? analysis.strengths : ["Completed the interview"],
        improvements: Array.isArray(analysis.improvements) ? analysis.improvements : ["Continue practicing"],
        recommendations: Array.isArray(analysis.recommendations) ? analysis.recommendations : ["Practice with more mock interviews"],
        keyTakeaways: analysis.keyTakeaways || "Continue practicing to improve interview performance."
      };

      console.log("Interview analysis parsed successfully:", JSON.stringify(analysis.categoryScores));
    } catch (parseError) {
      console.error("Failed to parse analysis. Raw response:", response.substring(0, 500));
      console.error("Parse error:", parseError);
      // Return a default structure if parsing fails completely
      analysis = {
        overallScore: 55,
        summary: "Interview analysis completed. Please review individual responses.",
        hireRecommendation: "Maybe",
        categoryScores: {
          technical: 5.5,
          behavioral: 5.5,
          communication: 5.5,
          problemSolving: 5.5,
          cultureFit: 5.5
        },
        questionScores: sanitizedAnswers.map((_, i) => ({
          questionIndex: i,
          score: 5.5,
          feedback: "Answer recorded. Unable to provide detailed analysis."
        })),
        strengths: ["Completed the interview", "Showed willingness to participate"],
        improvements: ["Provide more detailed answers", "Use the STAR method"],
        recommendations: ["Practice more with mock interviews"],
        keyTakeaways: "Continue practicing to improve interview performance."
      };
    }

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Interview analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze interview. Please try again." },
      { status: 500 }
    );
  }
}
