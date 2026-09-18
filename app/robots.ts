import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const privatePaths = [
        '/admin/',
        '/api/',
        '/teacher/',
        '/employer/dashboard/',
        '/profile/edit/',
        '/messages/',
        '/my-applications/',
        '/saved-jobs/',
        '/my-certificates/',
        '/login',
        '/register',
        '/forgot-password',
        '/reset-password',
        '/verify-email',
    ]

    return {
        rules: [
            { userAgent: '*', allow: '/', disallow: privatePaths },
            { userAgent: 'Googlebot', allow: '/', disallow: privatePaths },
            { userAgent: 'Google-Extended', allow: '/', disallow: privatePaths },
            { userAgent: 'OAI-SearchBot', allow: '/', disallow: privatePaths },
            { userAgent: 'ChatGPT-User', allow: '/', disallow: privatePaths },
            { userAgent: 'GPTBot', allow: '/', disallow: privatePaths },
            { userAgent: 'Claude-SearchBot', allow: '/', disallow: privatePaths },
            { userAgent: 'Claude-User', allow: '/', disallow: privatePaths },
            { userAgent: 'ClaudeBot', allow: '/', disallow: privatePaths },
        ],
        sitemap: 'https://www.rojgaarnepal.com/sitemap.xml',
        host: 'https://www.rojgaarnepal.com',
    }
}
