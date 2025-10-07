import { NextRequest, NextResponse } from 'next/server';
import { getEmailConfig, testEmailConfig } from '@/lib/email';

export async function GET(request: NextRequest) {
  try {
    console.log('=== EMAIL DEBUG INFO ===');
    
    // Get email configuration
    const config = await getEmailConfig();
    
    if (!config) {
      return NextResponse.json({
        success: false,
        message: 'Email configuration not found or not enabled',
        debug: {
          configExists: false,
          enabled: false
        }
      });
    }

    // Test SMTP connection
    const testResult = await testEmailConfig();
    
    const debugInfo = {
      configExists: true,
      enabled: true,
      smtpHost: config.host,
      smtpPort: config.port,
      smtpSecure: config.secure,
      smtpUser: config.user,
      hasPassword: !!config.password,
      passwordLength: config.password ? config.password.length : 0,
      fromName: config.fromName,
      fromEmail: config.fromEmail,
      testResult: testResult
    };

    console.log('Debug info:', debugInfo);

    return NextResponse.json({
      success: true,
      message: 'Email configuration debug info',
      debug: debugInfo
    });

  } catch (error) {
    console.error('Debug email error:', error);
    return NextResponse.json({
      success: false,
      message: 'Error getting debug info',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}