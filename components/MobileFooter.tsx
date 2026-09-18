"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Bot, BriefcaseBusiness, Home, MessageCircle, User } from "lucide-react";

export default function MobileFooter() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const items = [
    { href: "/", label: "Home", icon: Home },
    { href: "/jobs", label: "Jobs", icon: BriefcaseBusiness },
    {
      href: session ? "/messages" : "/login",
      label: "Messages",
      icon: MessageCircle,
    },
    { href: "/messages/rojgaar-ai", label: "RojgaarAI", icon: Bot },
    { href: session ? "/profile" : "/login", label: "Profile", icon: User },
  ];

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-50 rounded-2xl border border-border/80 bg-card/95 p-1.5 shadow-2xl backdrop-blur-xl md:hidden"
    >
      <div className="grid grid-cols-5">
        {items.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={`${href}-${label}`}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-semibold ${
                active ? "bg-primary/10 text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon size={18} strokeWidth={active ? 2.5 : 2} aria-hidden="true" />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
