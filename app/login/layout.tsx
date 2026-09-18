import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log in to Rojgaar Nepal",
  description: "Sign in to search jobs, manage applications, learn new skills, and connect with employers on Rojgaar Nepal.",
  keywords: [
    "rojgaar nepal login",
    "job portal login nepal",
    "sign in rojgaarnepal",
    "nepal jobs login",
    "employer login nepal"
  ],
  openGraph: {
    title: "Login | Rojgaar Nepal - Nepal's #1 Job Portal",
    description: "Access your Rojgaar Nepal account to find jobs, hire talent, and grow your career.",
    url: "https://www.rojgaarnepal.com/login",
    type: "website",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
