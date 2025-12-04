"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface Conversation {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
  lastMessage: {
    content: string;
    createdAt: string;
  };
  unreadCount: number;
}

export default function ConversationList() {
  const { status } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch("/api/messages");
        const data = await res.json();
        setConversations(data.conversations || []);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch conversations", error);
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchConversations();
      // Poll for updates
      const interval = setInterval(fetchConversations, 10000);
      return () => clearInterval(interval);
    }
  }, [status]);

  if (status === "loading") return <div className="p-4 text-center">Loading...</div>;
  if (status === "unauthenticated") return <div className="p-4 text-center text-gray-500">Please login to view messages.</div>;
  if (loading) return <div className="p-4 text-center">Loading conversations...</div>;
  if (conversations.length === 0) return <div className="p-4 text-center text-gray-500">No messages yet.</div>;

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-6 pb-4">
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Messages</h2>
        <p className="text-sm text-gray-500 mt-1">Your recent conversations</p>
      </div>
      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1">
        {conversations.map((conv) => {
          const isActive = pathname === `/messages/${conv.user.id}`;
          return (
            <Link
              key={conv.user.id}
              href={`/messages/${conv.user.id}`}
              className={`block p-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-blue-50 shadow-sm ring-1 ring-blue-100' 
                  : 'hover:bg-gray-50 hover:shadow-sm'
              } ${conv.unreadCount > 0 ? 'bg-blue-50/30' : ''}`}
            >
              <div className="flex items-center space-x-4">
                <div className="relative flex-shrink-0">
                  {conv.user.image ? (
                    <Image
                      src={conv.user.image}
                      alt={conv.user.name || "User"}
                      width={48}
                      height={48}
                      className="rounded-full object-cover ring-2 ring-white shadow-sm"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg shadow-inner">
                      {conv.user.name?.[0] || "U"}
                    </div>
                  )}
                  {conv.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center ring-2 ring-white shadow-sm">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0 py-1">
                  <div className="flex justify-between items-baseline mb-1">
                    <p className={`text-sm font-semibold truncate ${conv.unreadCount > 0 ? 'text-gray-900' : 'text-gray-700 group-hover:text-gray-900'}`}>
                      {conv.user.name}
                    </p>
                    <span className="text-[11px] text-gray-400 font-medium">
                      {new Date(conv.lastMessage.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className={`text-xs truncate leading-relaxed ${conv.unreadCount > 0 ? 'font-medium text-gray-900' : 'text-gray-500 group-hover:text-gray-600'}`}>
                    {conv.lastMessage.content}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
