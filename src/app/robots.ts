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
          '/debug/',
          '/_next/',
          '/private/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/debug/',
          '/private/',
        ],
      },
    ],
    sitemap: 'https://aerogyalibrary.org/sitemap.xml',
    host: 'https://aerogyalibrary.org',
  }
}