import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { smartAICall, parseAIJSON } from "@/lib/ai/smart-client";
import * as z from "zod";

// OWASP A03: Input validation schema
const skillsGapSchema = z.object({
  currentTitle: z.string().max(100).optional(),
  currentSkills: z.union([z.array(z.string().max(100)), z.string().max(1000)]),
  yearsExperience: z.union([z.number(), z.string()]).optional(),
  education: z.string().max(200).optional(),
  targetRole: z.string().max(100),
  targetIndustry: z.string().max(100).optional(),
  timeline: z.string().max(50).optional(),
  currentRole: z.string().max(100).optional(),
  targetLevel: z.string().max(50).optional(),
  learningHoursPerWeek: z.number().optional(),
  learningPreference: z.array(z.string()).optional(),
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
  if (limit.count >= 15) return false;
  limit.count++;
  return true;
}

// Create fallback analysis if AI fails
function createFallbackAnalysis(currentSkills: string[], targetRole: string) {
  return {
    matchPercentage: Math.min(70, 30 + currentSkills.length * 5),
    transferableSkills: currentSkills.slice(0, 5),
    missingSkills: [
      {
        skill: `${targetRole} specific skills`,
        priority: "high",
        learningTime: "3-4 months",
        resources: [
          { title: "Official documentation", type: "Documentation", duration: "Self-paced" },
          { title: "Online courses", type: "Course", duration: "2-4 weeks each" }
        ]
      }
    ],
    roadmap: [
      {
        phase: 1,
        title: "Foundation",
        duration: "1-2 months",
        skills: ["Core fundamentals"],
        milestones: ["Complete introductory course", "Build first project"]
      }
    ],
    tips: [
      "Research specific requirements for this role on job boards",
      "Build projects to demonstrate your skills",
      "Network with professionals in this field"
    ],
    estimatedTimeToGoal: "3-6 months",
    warnings: ["Analysis generated with limited data - verify with industry resources"]
  };
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
    const validatedData = skillsGapSchema.parse(body);

    const {
      currentTitle,
      currentSkills,
      yearsExperience,
      targetRole,
      targetIndustry,
      timeline,
      currentRole,
      targetLevel,
      learningHoursPerWeek
    } = validatedData;

    const skillsArray = Array.isArray(currentSkills) ? currentSkills : currentSkills.split(',').map(s => s.trim());
    const skillsList = skillsArray.join(', ');

    // Enhanced system prompt with anti-hallucination measures and DeepSeek logic
    const systemPrompt = `You are an expert career counselor and technical skills advisor using DeepSeek reasoning.

CRITICAL RULES - FOLLOW EXACTLY:
1. **REALISTIC TIME ESTIMATES**: Varied and accurate durations are MANDATORY. Do NOT default to "6 months".
   - Simple tools/libs: "1-2 weeks"
   - Moderate skills: "1-2 months"
   - Complex domains: "3-6 months"
   - Expert mastery: "6+ months"
   - IF YOU OUTPUT "6 months" FOR EVERYTHING, YOU FAILED.

2. **PRUNING**: Only recommend TRULY necessary skills.
   - Frontend dev does NOT need Python or Java.
   - Backend dev does NOT need Figma.
   - Bug Bounty needs Burp Suite/Networking, NOT C++ or ML.

3. **MATCH PERCENTAGE**: Be honest. If they have 0 skills, say 0-10%. If they have all, say 90%.

OUTPUT JSON FORMAT:
{
  "matchPercentage": 0-100,
  "transferableSkills": ["skill1", "skill2"],
  "missingSkills": [
    {
      "skill": "skill_name",
      "priority": "high|medium|low",
      "learningTime": "Specific duration (e.g. '2 weeks', '3 months')",
      "resources": [
        {"title": "Specific Course/Doc", "type": "course|docs", "duration": "approx time"}
      ]
    }
  ],
  "roadmap": [
    {
      "phase": 1,
      "title": "Phase Name",
      "duration": "Duration",
      "skills": ["skill1"],
      "milestones": ["milestone1"]
    }
  ],
  "estimatedTimeToGoal": "Total duration (e.g. '4-6 months')",
  "quickWins": ["actionable tip 1", "tip 2"],
  "recommendations": ["recommendation 1"],
  "warnings": ["warning 1 (if applicable)"]
}`;

    const userPrompt = `Analyze skills gap:
    Current Role: ${currentRole || currentTitle || 'Student'}
    Current Skills: ${skillsList || 'None'}
    Target Role: ${targetRole}
    Target Level: ${targetLevel || 'mid'}
    Experience: ${yearsExperience || '0'} years
    `;

    // Use Smart Client (DeepSeek R1 preferred for strong logic)
    const result = await smartAICall([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ], {
      modelType: "reasoner",
      temperature: 0.2, // Low temp for factual estimates
      jsonMode: true
    });

    const analysis = parseAIJSON(result);

    return NextResponse.json({ success: true, analysis });

  } catch (error) {
    console.error("Skills gap analysis error:", error);
    // Fallback safe return
    return NextResponse.json(
      { success: false, error: "Failed to analyze skills", fallback: true },
      { status: 500 }
    );
  }
}
