import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { smartAICall, parseAIJSON } from "@/lib/ai/smart-client";
import * as z from "zod";

// OWASP: Input validation schema
const resumeSchema = z.object({
  personalInfo: z.object({
    fullName: z.string().min(1).max(100),
    email: z.string().email().max(255),
    phone: z.string().max(20),
    location: z.string().max(200),
    linkedin: z.string().max(500).optional(),
    portfolio: z.string().max(500).optional(),
  }),
  summary: z.string().max(2000),
  hasWorkExperience: z.boolean().optional(),
  experience: z.array(z.object({
    title: z.string().max(100),
    company: z.string().max(100),
    location: z.string().max(200).optional(),
    startDate: z.string().max(50),
    endDate: z.string().max(50).optional(),
    current: z.boolean().optional(),
    responsibilities: z.string().max(2000),
  })).max(10).optional(),
  education: z.array(z.object({
    degree: z.string().max(100),
    institution: z.string().max(200),
    field: z.string().max(100).optional(),
    graduationYear: z.string().max(10),
    gpa: z.string().max(10).optional(),
    coursework: z.string().max(500).optional(),
    achievements: z.string().max(500).optional(),
  })).max(5),
  skills: z.object({
    technical: z.string().max(1000),
    soft: z.string().max(500).optional(),
    languages: z.array(z.object({
      language: z.string().max(50),
      proficiency: z.string().max(50),
    })).max(10).optional(),
    tools: z.string().max(500).optional(),
    certifications: z.string().max(500).optional(),
  }),
  hasProjects: z.boolean().optional(),
  projects: z.array(z.object({
    title: z.string().max(100),
    description: z.string().max(500),
    technologies: z.string().max(200),
    link: z.string().max(500).optional(),
    duration: z.string().max(50).optional(),
  })).max(5).optional(),
  hasVolunteer: z.boolean().optional(),
  volunteer: z.array(z.object({
    organization: z.string().max(100),
    role: z.string().max(100),
    duration: z.string().max(50),
    description: z.string().max(500),
  })).max(5).optional(),
  hasAwards: z.boolean().optional(),
  awards: z.array(z.object({
    title: z.string().max(100),
    issuer: z.string().max(100).optional(),
    date: z.string().max(50).optional(),
  })).max(5).optional(),
  publications: z.string().max(1000).optional(),
  hobbies: z.string().max(500).optional(),
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
    const validatedData = resumeSchema.parse(body);

    // Destructure for prompt clarity
    const {
      personalInfo, summary, hasWorkExperience, experience, education, skills,
      hasProjects, projects, hasVolunteer, volunteer, hasAwards, awards,
      publications, hobbies
    } = validatedData;

    // Detect languages provided by user
    const userProvidedLanguages = skills.languages && skills.languages.length > 0
      ? skills.languages.map(l => `${l.language} (${l.proficiency})`).join(', ')
      : "None provided";

    const systemPrompt = `You are an expert ATS (Applicant Tracking System) Resume Optimizer.
Your goal is to generate a JSON resume structure that is readable by machines and humans.

CRITICAL RULES:
1. **LANGUAGES**: If the user provided languages (${userProvidedLanguages}), you MUST include them in the 'skills.languages' array. Do NOT omit them.
2. **ATS OPTIMIZATION**: Use standard headings and Action Verbs (Achieved, Led, Developed).
3. **FORMAT**: Return ONLY valid JSON matching the schema below.
4. **CONTENT**: Polish the descriptions to be professional and impact-oriented.

JSON STRUCTURE:
{
  "header": { "name": "", "email": "", "phone": "", "location": "", "linkedin": "", "portfolio": "" },
  "summary": "Compelling professional summary...",
  "experience": [{ "title": "", "company": "", "location": "", "startDate": "", "endDate": "", "current": boolean, "responsibilities": ["bullet 1", "bullet 2"] }],
  "education": [{ "degree": "", "institution": "", "field": "", "graduationYear": "", "gpa": "" }],
  "skills": { 
    "technical": ["skill1", "skill2"], 
    "soft": ["skill1", "skill2"], 
    "tools": ["tool1", "tool2"],
    "languages": [{ "language": "Name", "proficiency": "Level" }]
  },
  "projects": [{ "title": "", "description": "", "technologies": ["tech1"], "link": "" }],
  "certifications": ["cert1", "cert2"],
  "volunteer": [{ "role": "", "organization": "", "duration": "", "description": "" }],
  "awards": [{ "title": "", "issuer": "", "date": "" }]
}`;

    const userPrompt = `Generate a resume for:
    Name: ${personalInfo.fullName}
    Location: ${personalInfo.location}
    Summary: ${summary}
    Languages: ${userProvidedLanguages}
    Technical Skills: ${skills.technical}
    
    Experience: ${JSON.stringify(experience || [])}
    Education: ${JSON.stringify(education || [])}
    Projects: ${JSON.stringify(projects || [])}
    Awards: ${JSON.stringify(awards || [])}
    `;

    // Use Smart Client (DeepSeek R1 preferred for strong logic/formatting)
    const result = await smartAICall([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ], {
      modelType: "reasoner", // Use DeepSeek R1 for reasoning about ATS rules
      temperature: 0.3,
      jsonMode: true
    });

    const parsedResume = parseAIJSON(result);

    return NextResponse.json({ success: true, resume: parsedResume });

  } catch (error) {
    console.error("Resume generation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate resume" },
      { status: 500 }
    );
  }
}
