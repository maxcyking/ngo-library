import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "श्री गणेश सेवा संस्थान - शिक्षा, स्वास्थ्य और सेवा के लिए समर्पित",
  description: "श्री गणेश सेवा संस्थान एक NGO और लाइब्रेरी है जो शिक्षा, स्वास्थ्य, पर्यावरण और सामाजिक सेवा के क्षेत्र में कार्य करती है।",
  keywords: "NGO, लाइब्रेरी, शिक्षा, स्वास्थ्य, रक्तदान, देहदान, सामाजिक सेवा",
  authors: [{ name: "श्री गणेश सेवा संस्थान" }],
  openGraph: {
    title: "श्री गणेश सेवा संस्थान",
    description: "शिक्षा, स्वास्थ्य और सेवा के लिए समर्पित",
    type: "website",
    locale: "hi_IN",
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Mukta:wght@300;400;500;600;700&family=Hind:wght@300;400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className={`${inter.variable} antialiased min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
