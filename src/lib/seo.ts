// SEO Configuration for Arogya Library and Service Organization
import type { Metadata } from "next";

export const siteConfig = {
  name: "एरोज्ञा पुस्तकालय एवं सेवा संस्था",
  description: "बाड़मेर राजस्थान में 2020 से सेवारत NGO। 2000+ पुस्तकों का निःशुल्क पुस्तकालय, रक्तदान शिविर, स्वास्थ्य सेवा। 150+ रक्तदाता, 35 लाख का नया भवन निर्माणाधीन।",
  url: "https://arogyango.org",
  ogImage: "/og-image.jpg",
  keywords: [
    "एरोज्ञा पुस्तकालय",
    "बाड़मेर NGO",
    "राजस्थान पुस्तकालय",
    "निःशुल्क पुस्तकालय",
    "रक्तदान शिविर बाड़मेर",
    "स्वास्थ्य सेवा राजस्थान",
    "सामाजिक सेवा संस्था",
    "चैरिटेबल ट्रस्ट बाड़मेर",
    "शिक्षा सेवा",
    "पर्यावरण संरक्षण",
    "महिला सशक्तिकरण",
    "देहदान",
    "सामुदायिक सेवा",
    "धार्मिक पुस्तकें",
    "शैक्षणिक पुस्तकें",
    "Arogya Library",
    "Barmer NGO",
    "Free Library Rajasthan",
    "Blood Donation Camp",
    "Health Services",
    "Social Service Organization"
  ]
};

export function generateMetadata(
  title?: string,
  description?: string,
  image?: string,
  noIndex?: boolean
): Metadata {
  return {
    title: title ? `${title} | ${siteConfig.name}` : siteConfig.name,
    description: description || siteConfig.description,
    keywords: siteConfig.keywords,
    authors: [
      { name: siteConfig.name, url: siteConfig.url }
    ],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: '/',
      languages: {
        'hi-IN': '/',
        'en-US': '/en',
      },
    },
    openGraph: {
      title: title || siteConfig.name,
      description: description || siteConfig.description,
      url: siteConfig.url,
      siteName: siteConfig.name,
      images: [
        {
          url: image || siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: title || siteConfig.name,
        }
      ],
      locale: 'hi_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: title || siteConfig.name,
      description: description || siteConfig.description,
      images: [image || siteConfig.ogImage],
      creator: '@Arogyalibrary',
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      nocache: true,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    category: 'NGO',
    classification: 'Non-Profit Organization',
  };
}

export function generateStructuredData(settings?: any) {
  return {
    "@context": "https://schema.org",
    "@type": "NGO",
    "name": settings?.siteName || siteConfig.name,
    "alternateName": "Arogya Library and Service Organization",
    "url": siteConfig.url,
    "logo": settings?.logo || `${siteConfig.url}/logo.png`,
    "description": settings?.description || siteConfig.description,
    "foundingDate": settings?.establishedYear || "2020",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": settings?.address || "बाड़मेर",
      "addressLocality": "बाड़मेर",
      "addressRegion": "राजस्थान",
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "telephone": settings?.phone,
      "email": settings?.email,
      "availableLanguage": ["Hindi", "English"]
    },
    "sameAs": [
      settings?.facebook,
      settings?.twitter,
      settings?.instagram,
      settings?.youtube
    ].filter(Boolean),
    "knowsAbout": [
      "Library Services",
      "Blood Donation",
      "Health Services",
      "Education",
      "Social Service",
      "Community Development"
    ],
    "areaServed": {
      "@type": "Place",
      "name": "Barmer, Rajasthan, India"
    }
  };
}

export function generateLibraryStructuredData(settings?: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Library",
    "name": "एरोज्ञा पुस्तकालय",
    "alternateName": "Arogya Library",
    "description": "2000+ पुस्तकों का निःशुल्क पुस्तकालय। धार्मिक, शैक्षणिक, साहित्यिक और तकनीकी पुस्तकों का विशाल संग्रह।",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": settings?.address || "बाड़मेर",
      "addressLocality": "बाड़मेर",
      "addressRegion": "राजस्थान",
      "addressCountry": "IN"
    },
    "openingHours": "Mo-Sa 09:00-18:00",
    "priceRange": "Free",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Library Books",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Book",
            "name": "Religious Books"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Book",
            "name": "Educational Books"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Book",
            "name": "Literature Books"
          }
        }
      ]
    }
  };
}