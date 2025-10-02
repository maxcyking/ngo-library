"use client";

import { useSettings } from "@/contexts/SettingsContext";
import { generateStructuredData, generateLibraryStructuredData } from "@/lib/seo";
import { useEffect } from "react";

export function DynamicMetadata() {
  const { settings, loading } = useSettings();

  useEffect(() => {
    if (!loading && settings) {
      // Update document title dynamically
      document.title = settings.siteTitle || settings.siteName;
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription && settings.description) {
        metaDescription.setAttribute('content', settings.description);
      }

      // Update meta keywords
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords && settings.metaKeywords) {
        metaKeywords.setAttribute('content', settings.metaKeywords);
      }

      // Update favicon if provided
      if (settings.favicon) {
        const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
        if (favicon) {
          favicon.href = settings.favicon;
        }
      }

      // Add/update structured data
      const existingScript = document.getElementById('structured-data');
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      script.id = 'structured-data';
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify([
        generateStructuredData(settings),
        generateLibraryStructuredData(settings)
      ]);
      document.head.appendChild(script);

      // Add Google Analytics if provided
      if (settings.googleAnalytics) {
        const existingGA = document.getElementById('google-analytics');
        if (!existingGA) {
          const gaScript = document.createElement('script');
          gaScript.id = 'google-analytics';
          gaScript.async = true;
          gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${settings.googleAnalytics}`;
          document.head.appendChild(gaScript);

          const gaConfigScript = document.createElement('script');
          gaConfigScript.innerHTML = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${settings.googleAnalytics}');
          `;
          document.head.appendChild(gaConfigScript);
        }
      }
    }
  }, [settings, loading]);

  return null; // This component doesn't render anything
}