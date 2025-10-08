import { NextRequest, NextResponse } from 'next/server';
import { getEmailConfig } from '@/lib/email';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET(request: NextRequest) {
  try {
    console.log('=== EMAIL FLOW DEBUG ===');
    
    // Get email configuration
    const config = await getEmailConfig();
    
    if (!config) {
      return NextResponse.json({
        success: false,
        message: 'Email configuration not found',
        debug: {
          configExists: false
        }
      });
    }

    // Get settings to see admin email configuration
    const settingsDoc = await getDoc(doc(db, 'settings', 'general'));
    const settings = settingsDoc.exists() ? settingsDoc.data() : {};

    const debugInfo = {
      smtpConfiguration: {
        smtpUser: config.user,
        fromEmail: config.fromEmail,
        fromName: config.fromName,
        host: config.host,
        port: config.port
      },
      adminEmailConfiguration: {
        adminEmailFromConfig: settings.emailConfig?.adminEmail,
        organizationEmail: settings.email,
        finalAdminEmail: settings.emailConfig?.adminEmail || settings.email
      },
      emailFlow: {
        description: 'When application is submitted:',
        step1: `Admin notification sent TO: ${settings.emailConfig?.adminEmail || settings.email}`,
        step2: `User confirmation sent TO: [user's email from form]`,
        step3: `All emails sent FROM: ${config.fromEmail || config.user}`,
        step4: `SMTP authentication uses: ${config.user}`
      },
      possibleIssues: {
        issue1: config.user === (settings.emailConfig?.adminEmail || settings.email) 
          ? '⚠️ WARNING: SMTP user and admin email are the same!' 
          : '✅ SMTP user and admin email are different',
        issue2: config.fromEmail === (settings.emailConfig?.adminEmail || settings.email)
          ? '⚠️ WARNING: From email and admin email are the same!'
          : '✅ From email and admin email are different',
        issue3: 'Check if Gmail is forwarding emails or treating accounts as aliases'
      }
    };

    console.log('Email flow debug:', debugInfo);

    return NextResponse.json({
      success: true,
      message: 'Email flow debug information',
      debug: debugInfo
    });

  } catch (error) {
    console.error('Debug email flow error:', error);
    return NextResponse.json({
      success: false,
      message: 'Error getting debug info',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}