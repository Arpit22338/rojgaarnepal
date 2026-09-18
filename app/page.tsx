import Link from "next/link";
import {
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Clock3,
  GraduationCap,
  MapPin,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { alternates: { canonical: "https://www.rojgaarnepal.com" } };

async function readOrFallback<T>(label: string, query: Promise<T>, fallback: T): Promise<T> {
  try {
    return await query;
  } catch (error) {
    console.warn(JSON.stringify({
      event: "homepage.data_error",
      source: label,
      error: error instanceof Error ? error.message : "Unknown error",
    }));
    return fallback;
  }
}

export default async function Home() {
  const [session, latestJobs, jobCount, talentCount] = await Promise.all([
    getServerSession(authOptions),
    readOrFallback("latest_jobs", prisma.job.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { employer: { include: { employerProfile: true } } },
    }), []),
    readOrFallback("job_count", prisma.job.count(), 0),
    readOrFallback("talent_count", prisma.talentPost.count(), 0),
  ]);

  const user = session?.user as { role?: string } | undefined;
  const primaryHref = user?.role === "EMPLOYER" ? "/employer/jobs/new" : "/jobs";
  const primaryLabel = user?.role === "EMPLOYER" ? "Post a job" : "Explore jobs";

  return (
    <div className="pb-10">
      <section className="relative overflow-hidden border-b border-border py-16 sm:py-20 lg:py-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_10%,hsl(var(--primary)/0.12),transparent_34%),linear-gradient(to_bottom,hsl(var(--background)),hsl(var(--accent)/0.35))]" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-primary">
              <span className="size-2 rounded-full bg-primary" /> Opportunities across Nepal
            </p>
            <h1 className="font-display max-w-3xl text-balance text-5xl font-bold leading-[1.02] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              Work worth finding.
              <span className="block text-primary">People worth hiring.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
              RojgaarNepal brings jobs, skilled people, and practical learning into one clear place—built for Nepal&apos;s growing workforce.
            </p>

            <form action="/jobs" className="mt-8 flex max-w-2xl flex-col gap-3 rounded-2xl border border-border bg-card p-2 shadow-lg shadow-foreground/5 sm:flex-row">
              <label className="flex min-h-12 flex-1 items-center gap-3 px-3">
                <Search size={19} className="shrink-0 text-primary" />
                <span className="sr-only">Search jobs</span>
                <input
                  name="search"
                  type="search"
                  autoComplete="off"
                  placeholder="Job title, skill, or company…"
                  className="w-full bg-transparent text-sm placeholder:text-muted-foreground"
                />
              </label>
              <button className="min-h-12 rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground hover:bg-primary/90">
                Search jobs
              </button>
            </form>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={primaryHref} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-bold text-background hover:opacity-90">
                {primaryLabel} <ArrowRight size={17} />
              </Link>
              <Link href="/talent" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-card px-5 text-sm font-bold hover:border-primary/40">
                Browse talent <Users size={17} />
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[1.75rem] border border-border bg-card p-3 shadow-2xl shadow-foreground/8 sm:p-5">
              <div className="flex items-center justify-between px-2 pb-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Opportunity board</p>
                  <h2 className="font-display mt-1 text-xl font-bold">Recently posted</h2>
                </div>
                <Link href="/jobs" className="text-sm font-bold text-primary hover:underline">View all</Link>
              </div>
              <div className="space-y-2">
                {latestJobs.slice(0, 4).map((job, index) => (
                  <Link
                    key={job.id}
                    href={`/jobs/${job.id}`}
                    className="group grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl border border-transparent p-3 hover:border-border hover:bg-accent/60"
                  >
                    <span className="grid size-11 place-items-center rounded-xl bg-primary/10 font-display text-sm font-bold text-primary">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-bold group-hover:text-primary">{job.title}</span>
                      <span className="mt-1 flex items-center gap-1 truncate text-xs text-muted-foreground">
                        <Building2 size={12} /> {job.employer.employerProfile?.companyName || "Employer"}
                      </span>
                    </span>
                    <ArrowRight size={17} className="text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                  </Link>
                ))}
                {latestJobs.length === 0 && (
                  <div className="rounded-2xl bg-accent p-8 text-center text-sm text-muted-foreground">
                    New opportunities will appear here.
                  </div>
                )}
              </div>
            </div>
            <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-border bg-background px-4 py-3 shadow-lg sm:block">
              <p className="text-2xl font-bold">{jobCount}+</p>
              <p className="text-xs text-muted-foreground">job opportunities</p>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Platform highlights" className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-7xl divide-y divide-border px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6 lg:px-8">
          <Stat icon={BriefcaseBusiness} value={`${jobCount}+`} label="jobs published" />
          <Stat icon={Users} value={`${talentCount}+`} label="talent profiles" />
          <Stat icon={ShieldCheck} value="Free" label="to explore and join" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Fresh opportunities</p>
            <h2 className="font-display mt-2 text-3xl font-bold tracking-[-0.035em] sm:text-4xl">Latest jobs in Nepal</h2>
            <p className="mt-3 text-muted-foreground">Clear details, direct applications, no unnecessary noise.</p>
          </div>
          <Link href="/jobs" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">
            Browse every job <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {latestJobs.map((job) => (
            <Link key={job.id} href={`/jobs/${job.id}`} className="group rounded-2xl border border-border bg-card p-5 shadow-sm hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-lg">
              <div className="flex items-start justify-between gap-4">
                <span className="grid size-11 place-items-center rounded-xl bg-accent font-display font-bold text-primary">
                  {(job.employer.employerProfile?.companyName || "R").slice(0, 1).toUpperCase()}
                </span>
                <span className="rounded-full bg-accent px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-accent-foreground">{job.type}</span>
              </div>
              <h3 className="mt-5 text-lg font-bold group-hover:text-primary">{job.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{job.employer.employerProfile?.companyName || "Verified employer"}</p>
              <div className="mt-5 flex flex-wrap gap-3 border-t border-border pt-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><MapPin size={13} /> {job.location}</span>
                <span className="inline-flex items-center gap-1.5"><Clock3 size={13} /> {new Intl.DateTimeFormat("en-NP", { month: "short", day: "numeric" }).format(job.createdAt)}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
        <div className="grid overflow-hidden rounded-[2rem] border border-border bg-foreground text-background lg:grid-cols-[1.1fr_0.9fr]">
          <div className="p-8 sm:p-10 lg:p-14">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">One platform, three useful paths</p>
            <h2 className="font-display mt-3 max-w-xl text-3xl font-bold tracking-[-0.04em] sm:text-4xl">Spend less time navigating. Get to the next step.</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <PathLink href="/jobs" icon={BriefcaseBusiness} label="Find work" />
              <PathLink href="/courses" icon={GraduationCap} label="Build skills" />
              <PathLink href="/messages/rojgaar-ai" icon={Bot} label="Ask for help" />
            </div>
          </div>
          <div className="border-t border-white/10 bg-white/5 p-8 sm:p-10 lg:border-l lg:border-t-0 lg:p-14">
            <p className="font-display text-2xl font-bold">Hiring in Nepal?</p>
            <p className="mt-3 leading-7 text-background/70">Publish a role, review applicants, and discover skilled people from one straightforward dashboard.</p>
            <ul className="mt-6 space-y-3 text-sm">
              {["Publish job openings", "Discover local talent", "Manage applications"].map((item) => (
                <li key={item} className="flex items-center gap-2"><CheckCircle2 size={17} className="text-primary" /> {item}</li>
              ))}
            </ul>
            <Link href={session ? "/employer/dashboard" : "/register"} className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground">
              Start hiring <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ icon: Icon, value, label }: { icon: typeof Users; value: string; label: string }) {
  return (
    <div className="flex items-center gap-4 px-3 py-6 sm:justify-center sm:px-6">
      <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary"><Icon size={19} /></span>
      <span><strong className="block font-display text-xl">{value}</strong><span className="text-xs text-muted-foreground">{label}</span></span>
    </div>
  );
}

function PathLink({ href, icon: Icon, label }: { href: string; icon: typeof Bot; label: string }) {
  return (
    <Link href={href} className="group rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10">
      <Icon size={21} className="text-primary" />
      <span className="mt-3 flex items-center justify-between text-sm font-bold">{label}<ArrowRight size={15} className="transition-transform group-hover:translate-x-1" /></span>
    </Link>
  );
}
