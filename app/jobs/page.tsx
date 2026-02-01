import { Metadata } from 'next';
import JobsClient from './JobsClient';
import { Suspense } from 'react';

export const metadata: Metadata = {
    title: "Jobs in Nepal 2025 - Latest Job Vacancies & Career Opportunities",
    description: "Find the latest job vacancies in Nepal. Browse 1000+ jobs in IT, engineering, marketing, freelancing & more. Apply now on Rojgaar Nepal - Nepal's top job portal.",
    keywords: [
        "jobs in nepal",
        "job in nepal",
        "vacancy nepal",
        "job vacancy nepal 2025",
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
    openGraph: {
        title: "Jobs in Nepal - Find Your Dream Career | Rojgaar Nepal",
        description: "Browse 1000+ job vacancies across Nepal. IT, Engineering, Marketing, Freelancing & more. Free job alerts!",
        url: "https://rojgaarnepal.com/jobs",
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
