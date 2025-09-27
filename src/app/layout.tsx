import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "एरोग्या पुस्तकालय एवं सेवा संस्था - बाड़मेर राजस्थान | निःशुल्क पुस्तकालय, रक्तदान, स्वास्थ्य सेवा",
    template: "%s | एरोग्या पुस्तकालय एवं सेवा संस्था"
  },
  description: "एरोग्या पुस्तकालय एवं सेवा संस्था बाड़मेर राजस्थान में 2020 से सेवारत NGO है। 2000+ पुस्तकों का निःशुल्क पुस्तकालय, रक्तदान शिविर, स्वास्थ्य जांच, शिक्षा सेवा। 150+ रक्तदाता, 35 लाख का नया भवन निर्माणाधीन।",
  keywords: [
    "एरोग्या पुस्तकालय",
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
    "Aerogya Library",
    "Barmer NGO",
    "Free Library Rajasthan",
    "Blood Donation Camp",
    "Health Services",
    "Social Service Organization"
  ],
  authors: [
    { name: "एरोग्या पुस्तकालय एवं सेवा संस्था", url: "https://aerogyalibrary.org" }
  ],
  creator: "एरोग्या पुस्तकालय एवं सेवा संस्था",
  publisher: "एरोग्या पुस्तकालय एवं सेवा संस्था",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://aerogyalibrary.org'),
  alternates: {
    canonical: '/',
    languages: {
      'hi-IN': '/',
      'en-US': '/en',
    },
  },
  openGraph: {
    title: "एरोग्या पुस्तकालय एवं सेवा संस्था - बाड़मेर राजस्थान",
    description: "2020 से सेवारत NGO। 2000+ पुस्तकों का निःशुल्क पुस्तकालय, रक्तदान शिविर, स्वास्थ्य सेवा। बाड़मेर राजस्थान में शिक्षा और सामाजिक सेवा के लिए समर्पित।",
    url: 'https://aerogyalibrary.org',
    siteName: 'एरोग्या पुस्तकालय एवं सेवा संस्था',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'एरोग्या पुस्तकालय एवं सेवा संस्था - बाड़मेर राजस्थान',
      }
    ],
    locale: 'hi_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'एरोग्या पुस्तकालय एवं सेवा संस्था - बाड़मेर राजस्थान',
    description: '2000+ पुस्तकों का निःशुल्क पुस्तकालय, रक्तदान शिविर, स्वास्थ्य सेवा। बाड़मेर राजस्थान में 2020 से सेवारत NGO।',
    images: ['/twitter-image.jpg'],
    creator: '@aerogyalibrary',
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'NGO',
  classification: 'Non-Profit Organization',
  other: {
    'google-site-verification': 'your-google-verification-code',
    'msvalidate.01': 'your-bing-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi" dir="ltr">
      <head>
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Mukta:wght@300;400;500;600;700&family=Hind:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        
        {/* Favicon and App Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Theme Color */}
        <meta name="theme-color" content="#16a34a" />
        <meta name="msapplication-TileColor" content="#16a34a" />
        
        {/* Geo Location */}
        <meta name="geo.region" content="IN-RJ" />
        <meta name="geo.placename" content="Barmer, Rajasthan, India" />
        <meta name="geo.position" content="25.7522;71.3962" />
        <meta name="ICBM" content="25.7522, 71.3962" />
        
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "NGO",
              "name": "एरोग्या पुस्तकालय एवं सेवा संस्था",
              "alternateName": "Aerogya Library and Service Organization",
              "url": "https://aerogyalibrary.org",
              "logo": "https://aerogyalibrary.org/logo.png",
              "description": "एरोग्या पुस्तकालय एवं सेवा संस्था बाड़मेर राजस्थान में 2020 से सेवारत NGO है। निःशुल्क पुस्तकालय, रक्तदान शिविर, स्वास्थ्य सेवा प्रदान करती है।",
              "foundingDate": "2020",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "बाड़मेर",
                "addressLocality": "बाड़मेर",
                "addressRegion": "राजस्थान",
                "addressCountry": "IN"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "availableLanguage": ["Hindi", "English"]
              },
              "sameAs": [
                "https://facebook.com/aerogyalibrary",
                "https://twitter.com/aerogyalibrary",
                "https://instagram.com/aerogyalibrary"
              ],
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
            })
          }}
        />
        
        {/* Library Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Library",
              "name": "एरोग्या पुस्तकालय",
              "alternateName": "Aerogya Library",
              "description": "2000+ पुस्तकों का निःशुल्क पुस्तकालय। धार्मिक, शैक्षणिक, साहित्यिक और तकनीकी पुस्तकों का विशाल संग्रह।",
              "address": {
                "@type": "PostalAddress",
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
            })
          }}
        />
      </head>
      <body className={`${inter.variable} antialiased min-h-screen flex flex-col`}>
        <AuthProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
