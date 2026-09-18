"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { X, Send, Loader2, ChevronRight, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIFeature {
  name: string;
  description: string;
  path: string;
}

export default function RojgaarAIPopup() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleMessage, setBubbleMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [features, setFeatures] = useState<AIFeature[]>([]);
  const [showFeatures, setShowFeatures] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowFeatures(false);
        setShowBubble(false);
      }
    };

    if (isOpen || showFeatures || showBubble) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, showFeatures, showBubble]);

  // Fetch random tip on mount
  useEffect(() => {
    if (session) {
      const fetchTip = async () => {
        try {
          const res = await fetch("/api/ai/rojgaar-assistant");
          const data = await res.json();
          if (data.success) {
            setFeatures(data.allFeatures || []);
            // Show bubble after 5 seconds
            setTimeout(() => {
              setBubbleMessage(data.tip || "Ask me about your next career step.");
              setShowBubble(true);
              // Hide bubble after 8 seconds
              setTimeout(() => setShowBubble(false), 15000);
            }, 5000);
          }
        } catch (error) {
          console.error("Failed to fetch tip:", error);
        }
      };
      fetchTip();

      // Show random tips periodically (every 2 minutes)
      const interval = setInterval(async () => {
        if (!isOpen) {
          try {
            const res = await fetch("/api/ai/rojgaar-assistant");
            const data = await res.json();
            if (data.success && data.tip) {
              setBubbleMessage(data.tip);
              setShowBubble(true);
              setTimeout(() => setShowBubble(false), 15000);
            }
          } catch (error) {
            console.error("Failed to fetch tip:", error);
          }
        }
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [session, isOpen]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSend = async (text?: string) => {
    const nextMessage = text ?? input;
    if (!nextMessage.trim() || loading) return;

    const userMessage = nextMessage.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/rojgaar-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: messages.slice(-6),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessages(prev => [...prev, { role: "assistant", content: data.message }]);
        if (data.features) setFeatures(data.features);
      } else {
        setMessages(prev => [...prev, {
          role: "assistant",
          content: data.error || "Sorry, I couldn't process that. Please try again."
        }]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Oops! Something went wrong. Please try again."
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleBubbleClick = () => {
    setShowBubble(false);
    setShowFeatures(true);
  };

  if (!session) return null;

  return (
    <>
      {/* Floating Button with Cloud Bubble */}
      <div ref={popupRef} className="fixed bottom-20 right-6 z-[100] hidden md:block">
        {/* Cloud Tip Bubble */}
        {showBubble && !isOpen && (
          <div className="absolute bottom-16 right-0 w-64 rounded-2xl border border-border bg-card shadow-2xl animate-in slide-in-from-right-5 fade-in duration-300">
            {/* Cloud tail */}
            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-card border-r border-b border-border transform rotate-45" />
            <button type="button" onClick={handleBubbleClick} className="flex w-full items-start gap-3 rounded-2xl p-4 pr-9 text-left transition-transform hover:scale-[1.02]" aria-label="Open RojgaarAI quick links">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <i className="bx bx-bot text-primary text-lg"></i>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-primary mb-1">RojgaarAI</p>
                <p className="text-sm text-foreground line-clamp-3">{bubbleMessage}</p>
              </div>
            </button>
            <button
              type="button"
              aria-label="Dismiss tip"
              onClick={(e) => { e.stopPropagation(); setShowBubble(false); }}
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-accent transition-colors"
            >
              <X size={14} className="text-muted-foreground" />
            </button>
          </div>
        )}

        {/* Features Panel (shows when bubble clicked) */}
        {showFeatures && !isOpen && (
          <div className="absolute bottom-16 right-0 w-72 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
            <div className="p-4 border-b border-border flex items-center justify-between bg-primary/5">
              <div className="flex items-center gap-2">
                <i className="bx bx-bot text-primary text-xl"></i>
                <span className="font-bold text-foreground">Quick links</span>
              </div>
              <button
                type="button"
                aria-label="Close quick links"
                onClick={() => setShowFeatures(false)}
                className="p-1 rounded-full hover:bg-accent transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-2 max-h-80 overflow-y-auto">
              {features.map((feature, i) => (
                <Link
                  key={i}
                  href={feature.path}
                  onClick={() => setShowFeatures(false)}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Sparkles size={20} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm">{feature.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{feature.description}</p>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </Link>
              ))}
            </div>
            <div className="p-3 border-t border-border">
              <button
                type="button"
                onClick={() => { setShowFeatures(false); setIsOpen(true); }}
                className="w-full py-2 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <i className="bx bx-message-dots"></i>
                Chat with RojgaarAI
              </button>
            </div>
          </div>
        )}

        {/* Main Floating Button */}
        <button
          type="button"
          aria-label={isOpen ? "Close RojgaarAI chat" : "Open RojgaarAI chat"}
          onClick={() => { setIsOpen(!isOpen); setShowBubble(false); setShowFeatures(false); }}
          className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-[transform,background-color,box-shadow] duration-300 ${isOpen
            ? "bg-red-500 hover:bg-red-600 rotate-90"
            : "bg-linear-to-br from-primary to-primary/80 hover:shadow-primary/40 hover:scale-110"
            }`}
        >
          {isOpen ? (
            <X size={24} className="text-white" />
          ) : (
            <i className="bx bx-bot text-white text-2xl"></i>
          )}
        </button>

        {/* Chat Window */}
        {isOpen && (
          <div role="dialog" aria-label="RojgaarAI chat" className="fixed bottom-36 right-6 z-50 hidden h-[500px] w-96 flex-col overflow-hidden overscroll-contain rounded-2xl border border-border bg-card shadow-2xl md:flex animate-in slide-in-from-bottom-5 fade-in duration-300">
            {/* Header */}
            <div className="p-4 border-b border-border bg-linear-to-r from-primary/10 to-primary/5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <i className="bx bx-bot text-primary text-xl"></i>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-foreground">RojgaarAI</h3>
                <p className="text-xs text-muted-foreground">Your career assistant</p>
              </div>
              <button
                type="button"
                aria-label="Open quick links"
                onClick={() => setShowFeatures(!showFeatures)}
                className="p-2 rounded-lg hover:bg-accent transition-colors"
                title="Quick links"
              >
                <Sparkles size={18} className="text-primary" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" aria-live="polite">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <i className="bx bx-bot text-primary text-3xl"></i>
                  </div>
                  <h4 className="font-bold text-foreground mb-2">Hi! I&apos;m RojgaarAI 👋</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    I can help you navigate RojgaarNepal and boost your career.
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {["What can you do?", "Find jobs", "Help with my profile"].map((q, i) => (
                      <button
                        type="button"
                        key={i}
                        onClick={() => handleSend(q)}
                        className="px-3 py-1.5 bg-accent rounded-full text-xs font-medium hover:bg-accent/80 transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-accent text-foreground rounded-bl-md"
                      }`}
                  >
                    {msg.role === "assistant" && (
                      <div className="flex items-center gap-1.5 mb-1">
                        <i className="bx bx-bot text-primary text-sm"></i>
                        <span className="text-xs font-semibold text-primary">RojgaarAI</span>
                      </div>
                    )}
                    <div className="text-sm prose dark:prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0">
                      {msg.role === "assistant" ? (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            a: ({ ...props }) => (
                              <a
                                {...props}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline font-medium"
                              />
                            ),
                            p: ({ ...props }) => <p {...props} className="mb-1 last:mb-0" />,
                            ul: ({ ...props }) => <ul {...props} className="list-disc pl-4 mb-2 space-y-1" />,
                            ol: ({ ...props }) => <ol {...props} className="list-decimal pl-4 mb-2 space-y-1" />,
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      ) : (
                        msg.content
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-accent rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin text-primary" />
                      <span className="text-sm text-muted-foreground">Thinking…</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <label htmlFor="rojgaar-ai-popup-message" className="sr-only">Message RojgaarAI</label>
                <input
                  id="rojgaar-ai-popup-message"
                  name="message"
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  autoComplete="off"
                  placeholder="Ask about your career…"
                  className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus-visible:ring-2 focus-visible:ring-primary/50"
                  maxLength={500}
                />
                <button
                  type="button"
                  onClick={() => handleSend()}
                  aria-label="Send message"
                  disabled={!input.trim() || loading}
                  className="p-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
