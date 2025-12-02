import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";
    const role = searchParams.get("role") || "";

    const whereClause: Prisma.UserWhereInput = {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
      ],
    };

    if (session?.user?.id) {
      whereClause.id = { not: session.user.id };
    }

    if (role && role !== "ALL") {
      whereClause.role = role;
    } else {
        // Exclude ADMINs from general search usually, unless requested
        // If we already have an id exclusion, we need to make sure we don't overwrite it or conflict?
        // Prisma allows multiple fields in where.
        // But wait, if I set whereClause.role, it's fine.
        // However, if I want to combine role exclusion and id exclusion, it's also fine as they are different fields.
        
        // But wait, the original code was:
        // whereClause.role = { not: "ADMIN" };
        
        // If I want to keep that logic:
        if (whereClause.role) {
             // It was set above
        } else {
             whereClause.role = { not: "ADMIN" };
        }
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        isPremium: true,
        jobSeekerProfile: {
          select: {
            bio: true,
            skills: true,
            location: true,
          }
        },
        employerProfile: {
          select: {
            companyName: true,
            description: true,
            location: true,
          }
        }
      },
      take: 50,
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error searching users:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
