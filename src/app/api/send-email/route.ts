import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, sendAdminNotification } from '@/lib/email';
import { 
  getLibraryApplicationAdminTemplate, 
  getLibraryApplicationUserTemplate,
  getContactFormAdminTemplate,
  getContactFormUserTemplate,
  LibraryApplicationData,
  ContactFormData
} from '@/lib/emailTemplates';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    switch (type) {
      case 'library-application':
        return await handleLibraryApplication(data);
      case 'contact-form':
        return await handleContactForm(data);
      case 'test-email':
        return await handleTestEmail(data);
      default:
        return NextResponse.json(
          { success: false, message: 'Invalid email type' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleLibraryApplication(data: LibraryApplicationData) {
  try {
    // Send notification to admin
    const adminEmailSent = await sendAdminNotification(
      `🆕 नया पुस्तकालय आवेदन - ${data.applicationId}`,
      getLibraryApplicationAdminTemplate(data)
    );

    // Send confirmation to user
    const userEmailSent = await sendEmail({
      to: data.email,
      subject: `✅ आवेदन प्राप्त - ${data.applicationId} | एरोज्ञा पुस्तकालय`,
      html: getLibraryApplicationUserTemplate(data),
    });

    return NextResponse.json({
      success: true,
      message: 'Library application emails sent',
      details: {
        adminEmailSent,
        userEmailSent,
      },
    });
  } catch (error) {
    console.error('Library application email error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send library application emails' },
      { status: 500 }
    );
  }
}

async function handleContactForm(data: ContactFormData) {
  try {
    // Send notification to admin
    const adminEmailSent = await sendAdminNotification(
      `📧 नया संपर्क संदेश - ${data.subject}`,
      getContactFormAdminTemplate(data)
    );

    // Send confirmation to user
    const userEmailSent = await sendEmail({
      to: data.email,
      subject: `✅ संदेश प्राप्त हुआ - ${data.subject} | एरोज्ञा पुस्तकालय`,
      html: getContactFormUserTemplate(data),
    });

    return NextResponse.json({
      success: true,
      message: 'Contact form emails sent',
      details: {
        adminEmailSent,
        userEmailSent,
      },
    });
  } catch (error) {
    console.error('Contact form email error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send contact form emails' },
      { status: 500 }
    );
  }
}

async function handleTestEmail(data: { email: string }) {
  try {
    // First test the SMTP configuration
    const { testEmailConfig } = await import('@/lib/email');
    const testResult = await testEmailConfig();
    
    if (!testResult.success) {
      return NextResponse.json({
        success: false,
        message: testResult.message,
      });
    }

    // If SMTP test passes, send actual test email
    const emailSent = await sendEmail({
      to: data.email,
      subject: '✅ SMTP Test Email - एरोज्ञा पुस्तकालय',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #f97316, #dc2626); color: white; padding: 20px; text-align: center; border-radius: 8px;">
            <h1>✅ SMTP Configuration Test</h1>
            <p>यदि आप यह ईमेल देख रहे हैं, तो आपका SMTP कॉन्फ़िगरेशन सही तरीके से काम कर रहा है!</p>
          </div>
          <div style="padding: 20px; background: #f9fafb; border: 1px solid #e5e7eb;">
            <p><strong>परीक्षण सफल!</strong></p>
            <p>आपका ईमेल सिस्टम तैयार है और निम्नलिखित सुविधाएं उपलब्ध हैं:</p>
            <ul>
              <li>पुस्तकालय आवेदन सूचनाएं</li>
              <li>संपर्क फॉर्म सूचनाएं</li>
              <li>उपयोगकर्ता पुष्टिकरण ईमेल</li>
              <li>व्यवस्थापक सूचनाएं</li>
            </ul>
          </div>
          <div style="background: #374151; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px;">
            <p>एरोज्ञा पुस्तकालय एवं सेवा संस्था</p>
            <p>Email System Test - ${new Date().toLocaleString('hi-IN')}</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({
      success: emailSent,
      message: emailSent ? 'Test email sent successfully! Please check your inbox.' : 'SMTP connection successful but failed to send email. Please check your email address.',
    });
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json({
      success: false,
      message: `Test email failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }
}