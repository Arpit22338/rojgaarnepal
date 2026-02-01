import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account - Join Rojgaar Nepal Free",
  description: "Create your free Rojgaar Nepal account today. Access thousands of jobs, AI career tools, free courses, and connect with top employers in Nepal.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
