import { prisma } from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const otherUserId = searchParams.get("userId");

  if (otherUserId) {
    // Get messages between current user and specific user
    const messages = await (prisma as any).message.findMany({
      where: {
        OR: [
          { senderId: session.user.id, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: session.user.id },
        ],
      },
      orderBy: { createdAt: "asc" },
      include: { sender: true, receiver: true },
    });

    const otherUser = await prisma.user.findUnique({
      where: { id: otherUserId },
      select: { id: true, name: true, image: true, lastActivityAt: true } as any,
    });

    return NextResponse.json({ messages, otherUser });
  } else {
    // Get list of conversations with details (last message, unread count)
    const allMessages = await (prisma as any).message.findMany({
      where: {
        OR: [
          { senderId: session.user.id },
          { receiverId: session.user.id },
        ],
      },
      orderBy: { createdAt: 'desc' },
      include: { sender: true, receiver: true },
    });

    const conversationMap = new Map();

    for (const msg of allMessages) {
      const otherUser = msg.senderId === session.user.id ? msg.receiver : msg.sender;
      const otherUserId = otherUser.id;

      if (!conversationMap.has(otherUserId)) {
        conversationMap.set(otherUserId, {
          user: otherUser,
          lastMessage: msg,
          unreadCount: 0,
        });
      }

      const conv = conversationMap.get(otherUserId);
      // Count unread messages for the current user
      if (msg.receiverId === session.user.id && !msg.isRead) {
        conv.unreadCount++;
      }
    }

    const conversations = Array.from(conversationMap.values());

    return NextResponse.json({ conversations });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { receiverId, content } = body;

  if (!receiverId || !content) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  const message = await (prisma as any).message.create({
    data: {
      senderId: session.user.id,
      receiverId,
      content,
    },
  });

  // Update last activity
  await prisma.user.update({
    where: { id: session.user.id },
    data: { lastActivityAt: new Date() },
  });

  // Create notification
  await (prisma as any).notification.create({
    data: {
      userId: receiverId,
      content: `New message from ${session.user.name}`,
      link: `/messages/${session.user.id}`,
    },
  });

  return NextResponse.json({ message });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { senderId } = body;

  if (!senderId) {
    return NextResponse.json({ message: "Missing senderId" }, { status: 400 });
  }

  // Mark all messages from senderId to current user as read
  await (prisma as any).message.updateMany({
    where: {
      senderId: senderId,
      receiverId: session.user.id,
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });

  // Update last activity
  await prisma.user.update({
    where: { id: session.user.id },
    data: { lastActivityAt: new Date() },
  });

  return NextResponse.json({ success: true });
}
