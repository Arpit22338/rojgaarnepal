import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/admin/',
                    '/api/',
                    '/teacher/dashboard/',
                    '/profile/edit/',
                    '/messages/',
                    '/my-applications/',
                    '/saved-jobs/',
                    '/my-certificates/',
                    '/forgot-password/',
                    '/reset-password/',
                    '/verify-email/',
                ],
            },
            {
                userAgent: 'Googlebot',
                allow: '/',
                disallow: ['/admin/', '/api/'],
            },
        ],
        sitemap: 'https://rojgaarnepal.com/sitemap.xml',
        host: 'https://rojgaarnepal.com',
    }
}
