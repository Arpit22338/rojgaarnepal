import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN") return new NextResponse("Unauthorized", { status: 401 });

  const requests = await (prisma as any).premiumRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } } }
  });

  return NextResponse.json(requests);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN") return new NextResponse("Unauthorized", { status: 401 });

  const { id, status, durationDays } = await req.json();

  const request = await (prisma as any).premiumRequest.update({
    where: { id },
    data: { status },
  });

  if (status === "APPROVED") {
    const now = new Date();
    const expiresAt = new Date(now.setDate(now.getDate() + (durationDays || 30)));

    const updateData: {
      isPremium: boolean;
      premiumExpiresAt: Date;
      jobLimit?: number;
      talentLimit?: number;
    } = {
      isPremium: true,
      premiumExpiresAt: expiresAt,
    };

    if (request.planType === "20_UPLOADS") {
      updateData.jobLimit = 20;
      updateData.talentLimit = 20; // Assuming talent limit also increases
    }

    await prisma.user.update({
      where: { id: request.userId },
      data: updateData,
    });
  }

  return NextResponse.json(request);
}
