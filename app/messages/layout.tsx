"use client";

import ConversationList from "@/components/ConversationList";
import { usePathname } from "next/navigation";

export default function MessagesLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isListPage = pathname === "/messages";

  return (
    <div className="flex h-[calc(100vh-80px)] max-w-7xl mx-auto bg-white shadow-xl shadow-blue-900/5 rounded-2xl overflow-hidden my-4 border border-gray-100">
      {/* Sidebar (List) */}
      {/* On mobile: Show only if on list page. On desktop: Always show. */}
      <div className={`w-full md:w-[350px] md:border-r border-gray-100 bg-white flex flex-col ${!isListPage ? "hidden md:flex" : "flex"}`}>
         <ConversationList /> 
      </div>

      {/* Main Content (Chat) */}
      {/* On mobile: Show only if NOT on list page. On desktop: Always show. */}
      <div className={`flex-1 bg-gray-50/50 flex flex-col ${isListPage ? "hidden md:flex" : "flex"}`}>
        {children}
      </div>
    </div>
  );
}
