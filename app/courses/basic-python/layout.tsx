import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Python Course Nepal - Learn Python Programming from Scratch",
  description: "Learn Python programming for FREE! Beginner-friendly Python course with hands-on exercises, coding playground, and verified certificate. Start your programming journey today with Rojgaar Nepal.",
  keywords: [
    "free python course",
    "python course nepal",
    "learn python nepal",
    "python programming nepal",
    "python tutorial nepali",
    "free coding course nepal",
    "python for beginners",
    "python basics",
    "programming course nepal",
    "python certificate nepal",
    "learn coding free nepal",
    "python online course"
  ],
  openGraph: {
    title: "Free Python Programming Course | Rojgaar Nepal",
    description: "Learn Python from scratch with our FREE course. Interactive lessons, coding playground, and get certified! Perfect for beginners.",
    url: "https://rojgaarnepal.com/courses/basic-python",
    type: "website",
  },
};

export default function BasicPythonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
