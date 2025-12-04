import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title");

  if (!title) return new NextResponse("Missing title", { status: 400 });

  const course = await prisma.course.findFirst({ where: { title } });
  if (!course) return NextResponse.json({ status: "NONE" });

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      courseId_userId: {
        courseId: course.id,
        userId: (session.user as any).id
      }
    }
  });

  if (!enrollment) return NextResponse.json({ status: "NONE" });

  return NextResponse.json({ status: enrollment.status });
}
