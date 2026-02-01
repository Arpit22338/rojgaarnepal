import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free AI Career Tools - Resume Builder, Interview Prep | Rojgaar Nepal",
  description: "Use free AI-powered career tools: Resume Builder, Interview Preparation, Job Matcher, Skills Gap Analysis. Boost your career with smart AI tools on Rojgaar Nepal.",
  keywords: [
    "ai resume builder nepal",
    "free resume builder",
    "ai interview preparation",
    "job matcher ai",
    "skills gap analysis",
    "career ai tools",
    "resume maker nepal",
    "interview practice ai",
    "ai career assistant",
    "rojgaar ai"
  ],
  openGraph: {
    title: "Free AI Career Tools | Rojgaar Nepal",
    description: "Build professional resumes, practice interviews, find matching jobs with free AI tools. Start your career journey today!",
    url: "https://rojgaarnepal.com/ai-tools",
    type: "website",
  },
};

export default function AIToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
