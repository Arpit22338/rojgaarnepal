import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import { Prisma } from "@prisma/client";
import { z } from "zod";

const jobSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  location: z.string().min(2),
  salary: z.string().optional(),
  type: z.string(),
  requiredSkills: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || (user.role !== "EMPLOYER" && user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Only employers can post jobs" }, { status: 403 });
    }

    // Check limits for Non-Premium Users
    if (!user.isPremium) {
      const jobCount = await prisma.job.count({
        where: { employerId: user.id },
      });

      if (jobCount >= 1) {
        return NextResponse.json({ 
          error: "Free plan limit reached (1 job). Upgrade to Premium to post more jobs." 
        }, { status: 403 });
      }
    }

    const body = await req.json();
    const validatedData = jobSchema.parse(body);

    // Set expiry for non-premium users (24 hours)
    const expiresAt = user.isPremium ? null : new Date(Date.now() + 24 * 60 * 60 * 1000);

    const job = await prisma.job.create({
      data: {
        ...validatedData,
        employerId: user.id,
        expiresAt: expiresAt,
      } as any,
    });

    return NextResponse.json({ job }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: (error as any).errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const whereClause: Prisma.JobWhereInput = {
      OR: [
        { expiresAt: null } as any,
        { expiresAt: { gt: new Date() } } as any
      ]
    };

    const jobs = await prisma.job.findMany({
      where: whereClause,
      include: {
        employer: {
          include: {
            employerProfile: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ jobs });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
