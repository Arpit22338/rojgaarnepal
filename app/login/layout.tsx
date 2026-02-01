import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Access Your Rojgaar Nepal Account",
  description: "Sign in to your Rojgaar Nepal account to find jobs, manage applications, access AI tools, and connect with employers in Nepal.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
