import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Free Account - Join Rojgaar Nepal Today",
  description: "Create a free Rojgaar Nepal account to find jobs, publish your professional profile, explore courses, and connect with employers.",
  keywords: [
    "rojgaar nepal register",
    "create account job portal nepal",
    "sign up rojgaarnepal",
    "free job portal account nepal",
    "employer registration nepal",
    "job seeker signup nepal"
  ],
  openGraph: {
    title: "Join Rojgaar Nepal Free | Create Your Account",
    description: "Sign up for Rojgaar Nepal to find jobs, hire talent, and build practical career skills.",
    url: "https://www.rojgaarnepal.com/register",
    type: "website",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
