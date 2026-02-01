import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hire Freelancers in Nepal - Find Skilled Talent | Rojgaar Nepal",
  description: "Find and hire skilled freelancers in Nepal. Browse verified profiles of developers, designers, writers, marketers & more. Post projects and connect with talent instantly.",
  keywords: [
    "hire freelancers nepal",
    "freelancers in nepal",
    "hire developers nepal",
    "hire designers nepal",
    "find talent nepal",
    "freelance professionals nepal",
    "skilled workers nepal",
    "remote workers nepal",
    "hire experts nepal",
    "nepal freelance marketplace"
  ],
  openGraph: {
    title: "Hire Freelancers in Nepal | Rojgaar Nepal Talent Pool",
    description: "Browse 1000+ verified freelancer profiles. Find developers, designers, writers & more. Hire the best talent in Nepal!",
    url: "https://rojgaarnepal.com/talent",
    type: "website",
  },
};

export default function TalentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
