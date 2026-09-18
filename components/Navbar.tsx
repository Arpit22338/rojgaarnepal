"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Bot,
  BriefcaseBusiness,
  ChevronDown,
  GraduationCap,
  LogOut,
  Menu,
  MessageCircle,
  Search,
  Settings,
  User,
  Users,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import NotificationBell from "./NotificationBell";
import { ThemeToggle } from "./ui/theme-toggle";

const navigation = [
  { href: "/jobs", label: "Find jobs", icon: Search },
  { href: "/talent", label: "Hire talent", icon: Users },
  { href: "/courses", label: "Learn", icon: GraduationCap },
  { href: "/people", label: "Community", icon: User },
  { href: "/messages/rojgaar-ai", label: "Ask RojgaarAI", icon: Bot },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user as
    | { name?: string | null; email?: string | null; role?: string }
    | undefined;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeAccountMenu = (event: MouseEvent) => {
      if (!accountRef.current?.contains(event.target as Node)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", closeAccountMenu);
    return () => document.removeEventListener("mousedown", closeAccountMenu);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const dashboardHref =
    user?.role === "EMPLOYER"
      ? "/employer/dashboard"
      : user?.role === "TEACHER"
        ? "/teacher/dashboard"
        : user?.role === "ADMIN"
          ? "/admin/dashboard"
          : "/profile";

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur-xl">
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8"
      >
        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="Rojgaar Nepal home">
          <Image src="/logo.png" alt="" width={34} height={34} priority />
          <span className="font-display text-lg font-bold tracking-[-0.03em]">
            Rojgaar<span className="text-primary">Nepal</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navigation.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`inline-flex min-h-10 items-center gap-2 rounded-full px-3.5 text-sm font-semibold transition-colors ${
                isActive(href)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <Icon size={16} aria-hidden="true" />
              {label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle className="scale-90" />
          {session ? (
            <>
              <NotificationBell />
              <Link
                href="/messages"
                aria-label="Messages"
                className="grid size-10 place-items-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <MessageCircle size={19} />
              </Link>
              <div className="relative" ref={accountRef}>
                <button
                  type="button"
                  onClick={() => setAccountOpen((open) => !open)}
                  aria-label="Open account menu"
                  aria-expanded={accountOpen}
                  aria-controls="account-menu"
                  className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border bg-card px-3 text-sm font-semibold shadow-sm hover:border-primary/40"
                >
                  <span className="grid size-7 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {(user?.name || "U").slice(0, 1).toUpperCase()}
                  </span>
                  <span className="max-w-28 truncate">{user?.name || "Account"}</span>
                  <ChevronDown size={14} />
                </button>
                {accountOpen && (
                  <div id="account-menu" className="absolute right-0 mt-2 w-64 rounded-2xl border border-border bg-card p-2 shadow-xl">
                    <div className="border-b border-border px-3 py-2.5">
                      <p className="truncate text-sm font-semibold">{user?.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                    <AccountLink href={dashboardHref} icon={BriefcaseBusiness} label="Dashboard" />
                    <AccountLink href="/profile" icon={User} label="Profile" />
                    <AccountLink href="/profile/edit" icon={Settings} label="Settings" />
                    <button
                      type="button"
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10"
                    >
                      <LogOut size={17} /> Sign out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-full px-4 py-2 text-sm font-semibold hover:bg-accent">
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-sm hover:bg-primary/90"
              >
                Join free
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle className="scale-75" />
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen((open) => !open)}
            className="grid size-10 place-items-center rounded-full border border-border bg-card"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div id="mobile-menu" className="border-t border-border bg-background px-4 py-4 shadow-lg lg:hidden">
          <div className="mx-auto grid max-w-7xl gap-1">
            {navigation.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold ${
                  isActive(href) ? "bg-primary/10 text-primary" : "hover:bg-accent"
                }`}
              >
                <Icon size={18} aria-hidden="true" /> {label}
              </Link>
            ))}
            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border pt-4">
              {session ? (
                <>
                  <Link href={dashboardHref} className="rounded-xl border border-border px-4 py-3 text-center text-sm font-semibold">
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="rounded-xl bg-foreground px-4 py-3 text-sm font-semibold text-background"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="rounded-xl border border-border px-4 py-3 text-center text-sm font-semibold">
                    Sign in
                  </Link>
                  <Link href="/register" className="rounded-xl bg-primary px-4 py-3 text-center text-sm font-bold text-primary-foreground">
                    Join free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function AccountLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: typeof User;
  label: string;
}) {
  return (
    <Link href={href} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-accent">
      <Icon size={17} className="text-muted-foreground" /> {label}
    </Link>
  );
}
