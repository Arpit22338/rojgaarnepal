import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const kycSchema = z.object({
  documentType: z.enum(["citizenship", "passport", "national_id", "driving_license"]),
  frontImageUrl: z.string().url(),
  backImageUrl: z.string().url(),
  phoneNumber: z.string().min(10),
  qrCodeUrl: z.string().url().optional().or(z.literal("")),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { documentType, frontImageUrl, backImageUrl, phoneNumber, qrCodeUrl } = kycSchema.parse(body);

    // Update user profile with phone and QR
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        phoneNumber,
        qrCodeUrl: qrCodeUrl || undefined,
      },
    });

    // Check if record already exists
    const existingRecord = await (prisma as any).kycRecord.findFirst({
      where: {
        teacherId: session.user.id,
        status: "PENDING",
      },
    });

    if (existingRecord) {
      return NextResponse.json({ error: "KYC verification already pending" }, { status: 400 });
    }

    const record = await (prisma as any).kycRecord.create({
      data: {
        teacherId: session.user.id,
        documentType,
        frontImageUrl,
        backImageUrl,
        status: "PENDING",
      },
    });

    return NextResponse.json({ record }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: (error as any).errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const record = await (prisma as any).kycRecord.findFirst({
      where: {
        teacherId: session.user.id,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ record });
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
