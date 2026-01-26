import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { callGroqAI } from "@/lib/groq";
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

// Helper to safely parse JSON from AI responses
function parseAIResponse(result: string) {
  const cleaned = result
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/gi, "")
    .trim();

  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }

  throw new Error("No valid JSON found in response");
}

// Role-specific requirements database for validation
const roleRequirements: Record<string, { 
  essential: string[]; 
  notNeeded: string[];
  realisticTime: string;
}> = {
  "bug bounty": {
    essential: ["web security", "networking", "burp suite", "scripting", "owasp"],
    notNeeded: ["java", "c++", "c#", "ruby", "advanced programming", "machine learning"],
    realisticTime: "3-4 months"
  },
  "frontend": {
    essential: ["html", "css", "javascript", "react", "vue", "angular", "typescript", "git"],
    notNeeded: ["python", "java", "php", "ruby", "sql", "backend", "devops"],
    realisticTime: "3-4 months"
  },
  "backend": {
    essential: ["node", "python", "java", "sql", "api", "rest", "database"],
    notNeeded: ["react", "vue", "css", "design", "figma"],
    realisticTime: "4-5 months"
  },
  "data analyst": {
    essential: ["sql", "excel", "tableau", "power bi", "python", "r", "statistics"],
    notNeeded: ["java", "c++", "react", "frontend", "mobile"],
    realisticTime: "2-3 months"
  },
  "data scientist": {
    essential: ["python", "machine learning", "statistics", "sql", "pandas", "numpy"],
    notNeeded: ["java", "c++", "frontend", "react", "css"],
    realisticTime: "6-9 months"
  },
  "devops": {
    essential: ["linux", "docker", "kubernetes", "ci/cd", "aws", "terraform", "scripting"],
    notNeeded: ["react", "frontend", "mobile", "design"],
    realisticTime: "4-6 months"
  },
  "full stack": {
    essential: ["html", "css", "javascript", "react", "node", "sql", "git"],
    notNeeded: ["c++", "java", "mobile", "devops"],
    realisticTime: "6-8 months"
  },
  "mobile": {
    essential: ["react native", "flutter", "swift", "kotlin", "mobile ui"],
    notNeeded: ["backend", "devops", "data science"],
    realisticTime: "4-6 months"
  }
};

// Validate and fix hallucinations in the analysis
function validateAnalysis(analysis: any, targetRole: string, currentSkills: string[]): any {
  const targetRoleLower = targetRole.toLowerCase();
  
  // Find matching role requirements
  let roleReqs: typeof roleRequirements[string] | null = null;
  for (const [key, reqs] of Object.entries(roleRequirements)) {
    if (targetRoleLower.includes(key)) {
      roleReqs = reqs;
      break;
    }
  }

  // Validate missing skills
  if (analysis.missingSkills && Array.isArray(analysis.missingSkills)) {
    analysis.missingSkills = analysis.missingSkills.map((skill: any) => {
      // Fix unrealistic time estimates - if everything says "6 months", it's wrong
      const time = (skill.learningTime || skill.estimatedTime || "").toLowerCase();
      const skillName = (skill.skill || "").toLowerCase();
      
      // Simple skills shouldn't take 6 months
      const simpleSkills = ["html", "css", "git", "basic", "intro", "fundamentals", "beginner"];
      if (simpleSkills.some(s => skillName.includes(s))) {
        if (time.includes("6 month") || time.includes("1 year") || time.includes("12 month")) {
          skill.learningTime = "2-4 weeks";
        }
      }
      
      // Medium skills: 2-3 months
      const mediumSkills = ["javascript", "python", "sql", "react basics", "vue basics"];
      if (mediumSkills.some(s => skillName.includes(s))) {
        if (time.includes("6 month") || time.includes("1 year")) {
          skill.learningTime = "2-3 months";
        }
      }
      
      // Remove unnecessary prerequisites based on role
      if (roleReqs && skill.prerequisites && Array.isArray(skill.prerequisites)) {
        skill.prerequisites = skill.prerequisites.filter((prereq: string) => {
          const prereqLower = prereq.toLowerCase();
          return !roleReqs!.notNeeded.some(nn => prereqLower.includes(nn));
        });
      }
      
      return skill;
    });

    // Remove skills that aren't actually needed for the role
    if (roleReqs) {
      analysis.missingSkills = analysis.missingSkills.filter((skill: any) => {
        const skillName = (skill.skill || "").toLowerCase();
        // Don't filter out skills that are essential or not in notNeeded list
        return !roleReqs!.notNeeded.some(nn => skillName.includes(nn));
      });
    }
  }

  // Fix unrealistic total time
  const totalTime = (analysis.totalEstimatedTime || analysis.estimatedTimeToGoal || "").toLowerCase();
  if (totalTime.includes("year") || totalTime.includes("18 month") || totalTime.includes("24 month")) {
    analysis.estimatedTimeToGoal = roleReqs?.realisticTime || "3-6 months";
    analysis.totalEstimatedTime = roleReqs?.realisticTime || "3-6 months";
  }

  // Boost match percentage if user has relevant skills
  if (currentSkills.length > 0 && roleReqs) {
    const currentSkillsLower = currentSkills.map(s => s.toLowerCase());
    const matchingEssential = roleReqs.essential.filter(e => 
      currentSkillsLower.some(cs => cs.includes(e) || e.includes(cs))
    );
    if (matchingEssential.length > 0) {
      const calculatedMatch = Math.min(95, 30 + (matchingEssential.length / roleReqs.essential.length) * 60);
      if (analysis.matchPercentage < calculatedMatch) {
        analysis.matchPercentage = Math.round(calculatedMatch);
      }
    }
  }

  // Add warnings for detected issues
  analysis.warnings = [];
  
  // Check if all skills have same time
  const times = (analysis.missingSkills || []).map((s: any) => s.learningTime || s.estimatedTime);
  const uniqueTimes = new Set(times);
  if (times.length > 3 && uniqueTimes.size === 1) {
    analysis.warnings.push("Time estimates have been adjusted for accuracy");
  }

  return analysis;
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
        prerequisites: [],
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
      },
      {
        phase: 2,
        title: "Practical Skills",
        duration: "2-3 months",
        skills: ["Role-specific tools"],
        milestones: ["Complete 2-3 projects", "Start portfolio"]
      }
    ],
    intermediateRoles: [],
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

    // Enhanced system prompt with anti-hallucination measures
    const systemPrompt = `You are an expert career counselor and technical skills advisor.

CRITICAL RULES - FOLLOW EXACTLY:
1. Be REALISTIC about time estimates - NOT everything takes 6 months
2. Only recommend TRULY necessary prerequisites - don't add unnecessary languages
3. Consider the user's EXISTING skills and experience level
4. Provide SPECIFIC, PRACTICAL learning paths
5. Base recommendations on ACTUAL industry standards

TIME ESTIMATE GUIDELINES (be accurate):
- Basic skills (HTML, CSS, Git basics): 2-4 weeks
- Intermediate skills (JavaScript, Python basics, SQL): 1-3 months  
- Advanced skills (React/Vue mastery, Backend frameworks): 3-4 months
- Expert level (ML/AI, System Design, Architecture): 6-12 months
- ONLY say "6 months" for truly complex topics

ROLE-SPECIFIC KNOWLEDGE:
- Bug Bounty/Security: Needs web security, networking, Burp Suite, basic scripting. Does NOT need Java, C++, advanced programming.
- Frontend Developer: Needs HTML, CSS, JavaScript, React/Vue. Does NOT need Python, Java, backend, DevOps.
- Data Analyst: Needs SQL, Excel, Tableau/PowerBI, basic Python. Does NOT need Java, C++, frontend.
- Backend Developer: Needs Node/Python/Java, SQL, APIs. Does NOT need CSS, design, frontend frameworks.
- Full Stack: Needs both frontend and backend basics. Realistic time: 6-8 months total.

PREREQUISITES RULE:
- Only recommend prerequisites that are ACTUALLY required
- Don't recommend learning multiple programming languages unless the job specifically needs them
- Focus on the most direct path to the target role

OUTPUT FORMAT - Return ONLY valid JSON:
{
  "matchPercentage": 0-100,
  "transferableSkills": ["skill1", "skill2"],
  "missingSkills": [
    {
      "skill": "skill_name",
      "priority": "high|medium|low",
      "learningTime": "realistic time like '2-4 weeks' or '2-3 months'",
      "prerequisites": ["only if actually needed - keep minimal"],
      "whyNeeded": "brief explanation",
      "resources": [
        {"title": "resource name", "type": "course|documentation|project", "duration": "realistic time"}
      ]
    }
  ],
  "roadmap": [
    {
      "phase": 1,
      "title": "Phase Title",
      "duration": "realistic duration",
      "skills": ["skill1", "skill2"],
      "milestones": ["milestone1", "milestone2"]
    }
  ],
  "intermediateRoles": ["role1", "role2"],
  "tips": ["specific tip 1", "specific tip 2"],
  "estimatedTimeToGoal": "realistic total like '3-4 months' or '6-8 months'",
  "quickWins": ["quick action 1", "quick action 2"]
}

VARY YOUR TIME ESTIMATES - different skills take different amounts of time!`;

    const userPrompt = `Analyze skills gap for career transition:

CURRENT SITUATION:
- Current Role: ${currentRole || currentTitle || 'Student/Career Changer'}
- Current Skills: ${skillsList || 'None specified'}
- Years of Experience: ${yearsExperience || '0'}
- Learning Hours Per Week: ${learningHoursPerWeek || 5}

TARGET GOAL:
- Target Role: ${targetRole}
- Target Level: ${targetLevel || 'mid'}
${targetIndustry ? `- Target Industry: ${targetIndustry}` : ''}
- Preferred Timeline: ${timeline || '3-6 months'}

ANALYSIS REQUIRED:
1. What percentage of required skills does the user ALREADY have?
2. Which skills are GENUINELY missing for this specific role?
3. What's the REALISTIC learning time for EACH missing skill (VARY the times)?
4. What are the ACTUAL prerequisites (don't add unnecessary ones)?
5. What's the most EFFICIENT learning path?

Remember: Be honest, practical, and accurate. Don't overestimate time or add fake prerequisites.
Return ONLY the JSON object, no other text.`;

    const messages = [
      { role: "system" as const, content: systemPrompt },
      { role: "user" as const, content: userPrompt }
    ];

    // Lower temperature for more factual, consistent responses
    const result = await callGroqAI(messages, { temperature: 0.3, maxTokens: 4000 });

    // Parse JSON response
    let analysis;
    try {
      analysis = parseAIResponse(result);
      // Validate and fix potential hallucinations
      analysis = validateAnalysis(analysis, targetRole, skillsArray);
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      console.error("Raw response:", result);
      // Return safe fallback
      analysis = createFallbackAnalysis(skillsArray, targetRole);
    }

    return NextResponse.json({ success: true, analysis });
  } catch (error) {
    console.error("Skills gap analysis error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to analyze skills gap" },
      { status: 500 }
    );
  }
}
