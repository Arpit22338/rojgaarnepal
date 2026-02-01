import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - Rojgaar Nepal Support",
  description: "Get in touch with Rojgaar Nepal team. Have questions about jobs, courses, or our platform? We're here to help you with your career journey.",
  openGraph: {
    title: "Contact Rojgaar Nepal",
    description: "Have questions? Reach out to our support team. We're here to help with your career journey in Nepal.",
    url: "https://rojgaarnepal.com/contact",
    type: "website",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
