import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://rojgaarnepal.com'

    // Fetch all dynamic IDs
    const jobs = await prisma.job.findMany({ select: { id: true, updatedAt: true } })
    const courses = await prisma.course.findMany({
        where: { isPublished: true },
        select: { id: true, updatedAt: true }
    })
    const talentPosts = await prisma.talentPost.findMany({ select: { id: true, userId: true, updatedAt: true } })
    const users = await prisma.user.findMany({
        where: { isProfileComplete: true },
        select: { id: true, updatedAt: true }
    })

    const jobEntries = jobs.map((job) => ({
        url: `${baseUrl}/jobs/${job.id}`,
        lastModified: job.updatedAt,
        changeFrequency: 'daily' as const,
        priority: 0.7,
    }))

    const courseEntries = courses.map((course) => ({
        url: `${baseUrl}/courses/${course.id}`,
        lastModified: course.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    const talentEntries = talentPosts.map((post) => ({
        url: `${baseUrl}/profile/${post.userId}`, // Talent posts link to profiles
        lastModified: post.updatedAt,
        changeFrequency: 'daily' as const,
        priority: 0.6,
    }))

    const profileEntries = users.map((user) => ({
        url: `${baseUrl}/profile/${user.id}`,
        lastModified: user.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.5,
    }))

    const staticPages = [
        '',
        '/jobs',
        '/courses',
        '/courses/basic-python',
        '/courses/cv-building',
        '/talent',
        '/talent-posts',
        '/people',
        '/about',
        '/contact',
        '/ai-tools',
        '/ai-tools/resume-builder',
        '/ai-tools/interview-prep',
        '/ai-tools/job-matcher',
        '/ai-tools/skills-gap',
        '/login',
        '/register',
        '/privacy',
        '/terms',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' as const : 'weekly' as const,
        priority: route === '' ? 1.0 : route.includes('/courses') || route.includes('/ai-tools') ? 0.9 : 0.8,
    }))

    return [...staticPages, ...jobEntries, ...courseEntries, ...talentEntries, ...profileEntries]
}
