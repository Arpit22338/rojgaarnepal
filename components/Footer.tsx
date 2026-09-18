import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Bot, BriefcaseBusiness, GraduationCap, Mail, Users } from "lucide-react";

const explore = [
  { href: "/jobs", label: "Find jobs", icon: BriefcaseBusiness },
  { href: "/jobs-in-nepal", label: "Jobs in Nepal guide", icon: BriefcaseBusiness },
  { href: "/talent", label: "Hire talent", icon: Users },
  { href: "/courses", label: "Courses", icon: GraduationCap },
  { href: "/messages/rojgaar-ai", label: "Ask RojgaarAI", icon: Bot },
];

const company = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-card pb-28 pt-14 md:pb-10">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5">
            <Image src="/logo.png" alt="" width={38} height={38} />
            <span className="font-display text-xl font-bold">RojgaarNepal</span>
          </Link>
          <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
            A clearer path between Nepal&apos;s opportunities and the people ready to take them.
            Find work, discover talent, and build useful skills in one place.
          </p>
          <a
            href="mailto:contact@arpitkafle.com.np"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            <Mail size={16} /> contact@arpitkafle.com.np
          </a>
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Explore</h2>
          <ul className="mt-4 space-y-2">
            {explore.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link href={href} className="inline-flex items-center gap-2 py-1.5 text-sm font-semibold hover:text-primary">
                  <Icon size={16} className="text-muted-foreground" /> {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Company</h2>
          <ul className="mt-4 space-y-2">
            {company.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="inline-flex items-center gap-1 py-1.5 text-sm font-semibold hover:text-primary">
                  {label} <ArrowUpRight size={13} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-7xl flex-col gap-2 border-t border-border px-4 pt-6 text-xs text-muted-foreground sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <p>© {new Date().getFullYear()} RojgaarNepal. All rights reserved.</p>
        <p>Built in Nepal for Nepal&apos;s workforce.</p>
      </div>
    </footer>
  );
}
