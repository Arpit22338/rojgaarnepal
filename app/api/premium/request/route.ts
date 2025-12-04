import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { planType, amount, screenshotUrl, phoneNumber } = body;

    if (!planType || !amount || !screenshotUrl || !phoneNumber) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    // Check if this is a course enrollment
    // We assume if it's not a standard plan, it might be a course.
    // Or we can just try to find a course with this title.
    // For "Basic Python Programming", we ensure it exists.
    
    let courseId = null;
    if (planType === "Basic Python Programming") {
       let course = await prisma.course.findFirst({ where: { title: planType } });
       if (!course) {
         course = await prisma.course.create({
           data: {
             title: planType,
             description: "Learn Python from scratch",
             price: amount,
             thumbnail: "/python-course.jpg" // Placeholder
           }
         });
       }
       courseId = course.id;
    } else {
       // Try to find other courses
       const course = await prisma.course.findFirst({ where: { title: planType } });
       if (course) courseId = course.id;
    }

    if (courseId) {
      // Create Pending Enrollment
      const existing = await prisma.enrollment.findUnique({
        where: {
          courseId_userId: {
            courseId: courseId,
            userId: session.user.id
          }
        }
      });

      if (!existing) {
        await prisma.enrollment.create({
          data: {
            courseId: courseId,
            userId: session.user.id,
            status: "PENDING"
          }
        });
      }
    }

    await (prisma as any).premiumRequest.create({
      data: {
        userId: session.user.id,
        planType,
        amount,
        screenshotUrl,
        phoneNumber,
      },
    });

    return NextResponse.json({ message: "Request submitted successfully" });
  } catch (error) {
    console.error("Premium request error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
