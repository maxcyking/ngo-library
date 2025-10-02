import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { DynamicMetadata } from "@/components/seo/DynamicMetadata";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = generateSEOMetadata();

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
              "name": "एरोज्ञा पुस्तकालय एवं सेवा संस्था",
              "alternateName": "Arogya Library and Service Organization",
              "url": "https://arogyango.org",
              "logo": "https://arogyango.org/logo.png",
              "description": "एरोज्ञा पुस्तकालय एवं सेवा संस्था बाड़मेर राजस्थान में 2020 से सेवारत NGO है। निःशुल्क पुस्तकालय, रक्तदान शिविर, स्वास्थ्य सेवा प्रदान करती है।",
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
                "https://facebook.com/Arogyalibrary",
                "https://twitter.com/Arogyalibrary",
                "https://instagram.com/Arogyalibrary"
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
              "name": "एरोज्ञा पुस्तकालय",
              "alternateName": "Arogya Library",
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
          <SettingsProvider>
            <DynamicMetadata />
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
