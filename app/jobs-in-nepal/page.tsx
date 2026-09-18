import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  GraduationCap,
  MapPin,
  Search,
  UserRoundCheck,
} from "lucide-react";

const siteUrl = "https://www.rojgaarnepal.com";

export const metadata: Metadata = {
  title: "Jobs in Nepal: Find Work & Hire Talent",
  description:
    "Find jobs in Nepal, explore Kathmandu and remote opportunities, build your profile, and connect with employers on RojgaarNepal.",
  keywords: [
    "jobs in Nepal",
    "job sites in Nepal",
    "vacancy in Nepal",
    "Kathmandu jobs",
    "remote jobs Nepal",
    "online job portal Nepal",
    "hire employees Nepal",
  ],
  alternates: { canonical: `${siteUrl}/jobs-in-nepal` },
  openGraph: {
    title: "Jobs in Nepal | RojgaarNepal",
    description: "A practical place to discover jobs, local talent, and career resources in Nepal.",
    url: `${siteUrl}/jobs-in-nepal`,
    type: "website",
  },
};

const faqs = [
  {
    question: "Where can I find current jobs in Nepal?",
    answer: "Browse the RojgaarNepal jobs page for current vacancies. Open a listing to review the role, location, employment type, employer, and application details.",
  },
  {
    question: "Can I look for Kathmandu and remote jobs?",
    answer: "Yes. Use the job search and listing details to identify opportunities in Kathmandu, other locations across Nepal, and roles that support remote work.",
  },
  {
    question: "How can employers find talent in Nepal?",
    answer: "Employers can publish a job and browse public talent profiles to discover professionals by their skills, experience, and availability.",
  },
  {
    question: "Does RojgaarNepal charge people to browse jobs?",
    answer: "Browsing public jobs and exploring the platform is free. Individual employers control their own recruitment and selection process.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${siteUrl}/jobs-in-nepal/#webpage`,
      url: `${siteUrl}/jobs-in-nepal`,
      name: "Jobs in Nepal: Find Work & Hire Talent",
      description: "A practical guide to finding jobs and hiring talent through RojgaarNepal.",
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: { "@type": "Thing", name: "Employment in Nepal" },
      inLanguage: "en-NP",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Jobs in Nepal", item: `${siteUrl}/jobs-in-nepal` },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
  ],
};

const steps = [
  { icon: Search, title: "Search clearly", text: "Start with a role, skill, company, or location that matches the work you want." },
  { icon: UserRoundCheck, title: "Build trust", text: "Keep your public profile, skills, experience, and availability accurate and specific." },
  { icon: CheckCircle2, title: "Apply carefully", text: "Read each listing, tailor your application, and track the roles you have applied for." },
];

export default function JobsInNepalPage() {
  return (
    <div className="pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="border-b border-border bg-[linear-gradient(135deg,hsl(var(--background)),hsl(var(--accent)/0.65))]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card px-3.5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-primary">
            <MapPin size={14} aria-hidden="true" /> Careers across Nepal
          </p>
          <h1 className="mt-6 max-w-4xl text-balance font-display text-5xl font-bold leading-[1.04] tracking-[-0.05em] sm:text-6xl">
            Find jobs in Nepal without the clutter.
          </h1>
          <p className="mt-6 max-w-3xl text-pretty text-lg leading-8 text-muted-foreground">
            RojgaarNepal brings together current vacancies, public talent profiles, and practical career learning for people and employers across Nepal.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/jobs" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground hover:bg-primary/90">
              Browse Current Jobs <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <Link href="/talent" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-border bg-card px-6 text-sm font-bold hover:border-primary/40">
              Explore Talent <UserRoundCheck size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary"><Icon size={20} aria-hidden="true" /></span>
              <h2 className="mt-5 font-display text-xl font-bold">{title}</h2>
              <p className="mt-2 text-pretty text-sm leading-6 text-muted-foreground">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 pb-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div className="rounded-[2rem] bg-foreground p-8 text-background sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">For job seekers</p>
          <h2 className="mt-3 text-balance font-display text-3xl font-bold">Turn a broad search into a focused shortlist.</h2>
          <p className="mt-4 text-pretty leading-7 text-background/70">
            Search for the work you want, compare the details employers provide, and use saved jobs and application tracking to stay organized.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            <li className="flex gap-2"><BriefcaseBusiness className="mt-0.5 shrink-0 text-primary" size={17} aria-hidden="true" /> Review employment type and responsibilities.</li>
            <li className="flex gap-2"><MapPin className="mt-0.5 shrink-0 text-primary" size={17} aria-hidden="true" /> Check location and remote-work expectations.</li>
            <li className="flex gap-2"><GraduationCap className="mt-0.5 shrink-0 text-primary" size={17} aria-hidden="true" /> Build missing skills through practical courses.</li>
          </ul>
          <Link href="/register" className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground hover:bg-primary/90">
            Create a Free Account <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <div className="rounded-[2rem] border border-border bg-card p-8 sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">For employers</p>
          <h2 className="mt-3 text-balance font-display text-3xl font-bold">Reach people ready to work in Nepal.</h2>
          <p className="mt-4 text-pretty leading-7 text-muted-foreground">
            Publish clear openings, review applications from one dashboard, and browse professionals who have chosen to showcase their skills.
          </p>
          <div className="mt-6 rounded-2xl bg-accent p-5">
            <Building2 size={22} className="text-primary" aria-hidden="true" />
            <p className="mt-3 font-bold">Write useful job listings</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">Include responsibilities, required skills, location, employment type, and a realistic salary range when possible.</p>
          </div>
          <Link href="/employer/jobs/new" className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-5 text-sm font-bold hover:border-primary/40">
            Post a Job <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Common questions</p>
        <h2 className="mt-2 text-balance font-display text-3xl font-bold">Using a job site in Nepal</h2>
        <div className="mt-8 divide-y divide-border rounded-2xl border border-border bg-card px-6">
          {faqs.map((faq) => (
            <article key={faq.question} className="py-6">
              <h3 className="font-display text-lg font-bold">{faq.question}</h3>
              <p className="mt-2 text-pretty leading-7 text-muted-foreground">{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
