"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Flag,
  MoreVertical,
  Trash2,
  UserMinus2,
  Send,
} from "lucide-react";
import { deleteMessage } from "@/app/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  isRead: boolean;
}

interface ChatUser {
  id: string;
  name: string | null;
  image: string | null;
  lastActivityAt?: string | null;
}

export default function ChatPage() {
  const { data: session } = useSession();
  const params = useParams();
  const otherUserId = params.userId as string;
  const [messages, setMessages] = useState<Message[]>([]);
  const [otherUser, setOtherUser] = useState<ChatUser | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getLastSeenText = (dateString?: string | null) => {
    if (!dateString) return "Offline";
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 2) return "Online";
    if (minutes < 60) return `Last seen ${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Last seen ${hours}h ago`;
    return `Last seen ${date.toLocaleDateString()}`;
  };

  const isOnline = otherUser?.lastActivityAt
    ? (new Date().getTime() - new Date(otherUser.lastActivityAt).getTime() < 2 * 60 * 1000)
    : false;

  const formatMessageContent = (content: string, isMe: boolean) => {
    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
    const parts = content.split(urlRegex);

    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        const href = part.startsWith("www.") ? `http://${part}` : part;
        return (
          <a
            key={index}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`underline break-all ${isMe ? 'text-primary-foreground hover:text-primary-foreground/80' : 'text-primary hover:text-primary/80'}`}
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/messages?userId=${otherUserId}`);
      const data = await res.json();
      setMessages(data.messages);
      if (data.otherUser) {
        setOtherUser(data.otherUser);
      }
    } catch (error) {
      console.error("Failed to fetch messages", error);
    }
  }, [otherUserId]);

  const markAsRead = useCallback(async () => {
    try {
      await fetch("/api/messages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderId: otherUserId }),
      });
    } catch (error) {
      console.error("Failed to mark messages as read", error);
    }
  }, [otherUserId]);

  useEffect(() => {
    if (session) {
      const loadMessages = async () => {
        await fetchMessages();
        await markAsRead();
      };
      loadMessages();
      const interval = setInterval(async () => {
        await fetchMessages();
        await markAsRead();
      }, 5000); // Poll every 5 seconds
      return () => clearInterval(interval);
    }
  }, [session, fetchMessages, markAsRead]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: otherUserId,
          content: newMessage,
        }),
      });

      if (res.ok) {
        setNewMessage("");
        fetchMessages();
      }
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-background overflow-hidden">
      {/* Header */}
      <div className="shrink-0 flex flex-row items-center justify-between gap-2 border-b border-border/40 bg-card/80 backdrop-blur-md px-4 py-3 shadow-sm z-10 text-foreground">
        <div className="flex items-center gap-3">
          <Link href="/messages" className="md:hidden text-muted-foreground hover:text-foreground">
            <ArrowLeft size={24} />
          </Link>
          {otherUser ? (
            <Link href={`/profile/${otherUser.id}`} className="flex items-center gap-3 group">
              <div className="relative">
                <Avatar>
                  <AvatarImage alt={otherUser.name || "User"} src={otherUser.image || undefined} />
                  <AvatarFallback>{otherUser.name?.[0] || "U"}</AvatarFallback>
                </Avatar>
                {isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></span>
                )}
              </div>
              <div className="flex flex-col">
                <div className="font-semibold text-base group-hover:text-primary transition-colors">{otherUser.name || "User"}</div>
                <div className="flex items-center gap-1 text-muted-foreground text-xs">
                  {isOnline ? (
                    <>
                      <span className="inline-block size-2 rounded-full bg-green-500" /> Online
                    </>
                  ) : (
                    <span>{getLastSeenText(otherUser.lastActivityAt)}</span>
                  )}
                </div>
              </div>
            </Link>
          ) : (
            <h2 className="text-lg font-bold">Chat</h2>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <MoreVertical className="size-5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10">
              <UserMinus2 className="mr-2 size-4" /> Block User
            </Button>
            <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10">
              <Flag className="mr-2 size-4" /> Report User
            </Button>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-background/50 scroll-smooth" ref={messagesContainerRef}>
        <div className="flex flex-col gap-4 pb-4">
          {messages.map((msg) => {
            const isMe = msg.senderId === (session?.user as any)?.id;
            return (
              <div
                key={msg.id}
                className={cn(
                  "group flex gap-2 items-end mb-2",
                  isMe ? "justify-end" : "justify-start"
                )}
              >
                {!isMe && (
                  <Avatar className="size-8 mb-1">
                    <AvatarImage alt={otherUser?.name || "User"} src={otherUser?.image || undefined} />
                    <AvatarFallback>{otherUser?.name?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                )}

                <div className={cn("flex flex-col max-w-[75%]", isMe ? "items-end" : "items-start")}>
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2.5 text-sm shadow-sm relative group/bubble max-w-md break-words",
                      isMe
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-accent text-foreground rounded-bl-sm border border-border/50"
                    )}
                  >
                    {formatMessageContent(msg.content, isMe)}

                    {/* Message Actions (Hover) */}
                    <div className={cn(
                      "absolute top-0 opacity-0 group-hover/bubble:opacity-100 transition-opacity",
                      isMe ? "-left-8" : "-right-8"
                    )}>
                      {isMe && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-6 hover:bg-destructive/10 hover:text-destructive rounded-full">
                              <Trash2 className="size-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Message?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this message.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={async () => {
                                  await deleteMessage(msg.id);
                                  setMessages((prev) => prev.filter((m) => m.id !== msg.id));
                                }}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </div>

                  <div className="mt-1 flex items-center gap-1 px-1">
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {isMe && (
                      <span className={cn("text-[10px]", msg.isRead ? "text-primary" : "text-muted-foreground")}>
                        {msg.isRead ? "✓✓" : "✓"}
                      </span>
                    )}
                  </div>
                </div>

                {isMe && (
                  <Avatar className="size-8 mb-1">
                    <AvatarImage alt="Me" src={(session?.user as any)?.image || undefined} />
                    <AvatarFallback>Me</AvatarFallback>
                  </Avatar>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="shrink-0 p-3 md:p-4 border-t border-border/40 bg-card/80 backdrop-blur-md pb-safe">
        <form onSubmit={sendMessage} className="flex gap-2 items-center max-w-4xl mx-auto relative">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-background border border-input rounded-full px-5 py-3 text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none placeholder:text-muted-foreground text-foreground"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!newMessage.trim()}
            className="rounded-full size-10 shrink-0 transition-all hover:scale-105 active:scale-95"
          >
            <Send className="size-4 ml-0.5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
