import { Metadata } from 'next';
import JobsClient from './JobsClient';
import { Suspense } from 'react';

export const metadata: Metadata = {
    title: "Jobs in Nepal - Latest Vacancies & Career Opportunities",
    description: "Find current job vacancies in Nepal. Explore opportunities by role, skill, employer, and location on RojgaarNepal.",
    keywords: [
        "jobs in nepal",
        "job in nepal",
        "vacancy nepal",
        "latest job vacancy nepal",
        "online jobs nepal",
        "remote jobs nepal",
        "IT jobs kathmandu",
        "software developer jobs nepal",
        "work in kathmandu",
        "fresher jobs nepal",
        "part time jobs nepal",
        "freelance jobs nepal",
        "nepal job portal",
        "apply jobs online nepal"
    ],
    alternates: { canonical: "https://www.rojgaarnepal.com/jobs" },
    openGraph: {
        title: "Jobs in Nepal - Find Your Dream Career | Rojgaar Nepal",
        description: "Browse current job vacancies across Nepal by role, skill, employer, and location.",
        url: "https://www.rojgaarnepal.com/jobs",
        type: "website",
    },
};

export default function JobsPage() {
    return (
        <Suspense fallback={<div className="text-center py-20 font-bold opacity-50">Loading Opportunities...</div>}>
            <JobsClient />
        </Suspense>
    );
}
