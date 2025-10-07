"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface WebsiteSettings {
  // Basic Information
  siteName: string;
  siteTitle: string;
  tagline: string;
  description: string;
  logo: string;
  favicon: string;
  
  // Contact Information
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  mapLink: string;
  mapIframe: string;
  
  // Social Media Links
  facebook: string;
  twitter: string;
  instagram: string;
  youtube: string;
  linkedin: string;
  
  // Organization Details
  establishedYear: string;
  registrationNumber: string;
  chairperson: string;
  viceChairperson: string;
  secretary: string;
  
  // Office Hours
  officeHours: string;
  libraryHours: string;
  
  // SEO Settings
  metaKeywords: string;
  googleAnalytics: string;
  googleVerification?: string;
  bingVerification?: string;
  
  // Emergency Contact
  emergencyContact: string;
  emergencyPhone: string;
  
  // Bank Details (for donations)
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
  
  // Last Updated
  updatedAt?: Date;
  updatedBy?: string;
}

interface SettingsContextType {
  settings: WebsiteSettings;
  loading: boolean;
  refreshSettings: () => void;
}

const defaultSettings: WebsiteSettings = {
  siteName: 'एरोग्या पुस्तकालय एवं सेवा संस्था',
  siteTitle: 'एरोग्या पुस्तकालय एवं सेवा संस्था - बाड़मेर राजस्थान',
  tagline: 'समाज सेवा में समर्पित',
  description: 'बाड़मेर राजस्थान में 2020 से सेवारत एरोग्या पुस्तकालय एवं सेवा संस्था। निःशुल्क पुस्तकालय, रक्तदान शिविर, स्वास्थ्य सेवा।',
  logo: '',
  favicon: '',
  phone: '+91 9024635808',
  whatsapp: '+91 9024635808',
  email: 'arogyapustkalaya@gmail.com',
  address: 'मालियों की ढाणी, आरजीटी सर्कल,नगर तहसील - गुडामालानी जिला बाडमेर राजस्थान 344031',
  mapLink: '',
  mapIframe: '',
  facebook: '',
  twitter: '',
  instagram: '',
  youtube: '',
  linkedin: '',
  establishedYear: '2020',
  registrationNumber: '',
  chairperson: 'श्री अमराराम बोस',
  viceChairperson: 'श्री कालुराम माली',
  secretary: '',
  officeHours: 'सुबह 9:00 से शाम 6:00 तक',
  libraryHours: 'सुबह 9:00 से शाम 6:00 तक',
  metaKeywords: 'एरोग्या पुस्तकालय, बाड़मेर NGO, राजस्थान पुस्तकालय, निःशुल्क पुस्तकालय, रक्तदान शिविर',
  googleAnalytics: '',
  googleVerification: '',
  bingVerification: '',
  emergencyContact: 'श्री अमराराम बोस',
  emergencyPhone: '+91 9024635808',
  bankName: '',
  accountNumber: '',
  ifscCode: '',
  upiId: ''
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  loading: true,
  refreshSettings: () => {}
});

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<WebsiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const settingsDocRef = doc(db, 'settings', 'website');

    // Set up real-time listener for settings
    const unsubscribe = onSnapshot(
      settingsDocRef,
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setSettings(prev => ({
            ...prev,
            ...data,
            updatedAt: data.updatedAt?.toDate() || new Date()
          }));
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching settings:', error);
        // Use default settings on error
        setSettings(defaultSettings);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const refreshSettings = async () => {
    try {
      setLoading(true);
      const settingsDoc = await getDoc(doc(db, 'settings', 'website'));
      if (settingsDoc.exists()) {
        const data = settingsDoc.data();
        setSettings(prev => ({
          ...prev,
          ...data,
          updatedAt: data.updatedAt?.toDate() || new Date()
        }));
      }
    } catch (error) {
      console.error('Error refreshing settings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};