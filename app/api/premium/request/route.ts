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
    const { planType, amount, screenshotUrl } = body;

    if (!planType || !amount || !screenshotUrl) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    await (prisma as any).premiumRequest.create({
      data: {
        userId: session.user.id,
        planType,
        amount,
        screenshotUrl,
      },
    });

    return NextResponse.json({ message: "Request submitted successfully" });
  } catch (error) {
    console.error("Premium request error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
