import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const verifySchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, otp } = verifySchema.parse(body);

    // Check TempRegistration
    const tempUser = await (prisma as any).tempRegistration.findUnique({
      where: { email },
    });

    if (!tempUser) {
      // Fallback: Check if user exists but is unverified (legacy support)
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
           if (existingUser.isVerified) return NextResponse.json({ message: "User already verified" }, { status: 200 });
           // If unverified user exists in User table (from old flow), we might want to handle it
           // But for now, let's assume the new flow.
      }
      return NextResponse.json({ message: "Invalid verification request or expired" }, { status: 400 });
    }

    if (tempUser.otp !== otp) {
      return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
    }

    if (new Date() > new Date(tempUser.otpExpires)) {
      return NextResponse.json({ message: "OTP expired" }, { status: 400 });
    }

    // Create User
    const userData = JSON.parse(tempUser.data);
    
    const user = await prisma.user.create({
        data: {
            name: userData.name,
            email: userData.email,
            password: userData.password,
            role: userData.role,
            image: userData.image,
            isVerified: true,
        }
    });

    // Create Profile
    if (userData.role === "JOBSEEKER") {
      await prisma.jobSeekerProfile.create({
        data: { userId: user.id },
      });
    } else if (userData.role === "EMPLOYER") {
      await prisma.employerProfile.create({
        data: { userId: user.id, companyName: userData.name || "My Company" },
      });
    }

    // Delete TempRegistration
    await (prisma as any).tempRegistration.delete({ where: { email } });

    return NextResponse.json({ message: "Email verified successfully", user }, { status: 200 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }
    console.error("Verification error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
