"use client";

import ConversationList from "@/components/ConversationList";
import { usePathname } from "next/navigation";

export default function MessagesLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isListPage = pathname === "/messages";

  return (
    <div className="fixed inset-0 top-16 z-40 flex flex-col md:flex-row bg-white md:static md:h-[calc(100vh-100px)] md:w-full md:max-w-7xl md:mx-auto md:shadow-xl md:rounded-2xl md:overflow-hidden md:my-4 md:border md:border-gray-100">
      {/* Sidebar (List) */}
      <div className={`w-full md:w-[320px] lg:w-[360px] border-r border-gray-100 bg-white flex flex-col ${!isListPage ? "hidden md:flex" : "flex h-full"}`}>
         <ConversationList /> 
      </div>

      {/* Main Content (Chat) */}
      <div className={`flex-1 bg-gray-50/50 flex flex-col overflow-hidden ${isListPage ? "hidden md:flex" : "flex h-full"}`}>
        {children}
      </div>
    </div>
  );
}
