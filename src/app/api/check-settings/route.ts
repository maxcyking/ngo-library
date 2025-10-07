import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET(request: NextRequest) {
  try {
    console.log('Checking Firebase settings...');
    
    const settingsDoc = await getDoc(doc(db, 'settings', 'general'));
    
    if (!settingsDoc.exists()) {
      return NextResponse.json({
        success: false,
        message: 'Settings document not found',
        documentExists: false
      });
    }

    const settings = settingsDoc.data();
    
    return NextResponse.json({
      success: true,
      message: 'Settings document found',
      documentExists: true,
      hasEmailConfig: !!settings.emailConfig,
      emailConfigEnabled: settings.emailConfig?.enabled || false,
      emailConfigDetails: settings.emailConfig ? {
        enabled: settings.emailConfig.enabled,
        smtpHost: settings.emailConfig.smtpHost,
        smtpPort: settings.emailConfig.smtpPort,
        smtpSecure: settings.emailConfig.smtpSecure,
        smtpUser: settings.emailConfig.smtpUser,
        hasPassword: !!settings.emailConfig.smtpPassword,
        passwordLength: settings.emailConfig.smtpPassword?.length || 0,
        fromName: settings.emailConfig.fromName,
        fromEmail: settings.emailConfig.fromEmail,
        adminEmail: settings.emailConfig.adminEmail
      } : null
    });

  } catch (error) {
    console.error('Error checking settings:', error);
    return NextResponse.json({
      success: false,
      message: 'Error checking settings',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}