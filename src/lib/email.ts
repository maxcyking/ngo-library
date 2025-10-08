import nodemailer from 'nodemailer';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
  fromName: string;
  fromEmail: string;
}

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Get email configuration from Firebase settings or environment variables
export async function getEmailConfig(): Promise<EmailConfig | null> {
  try {
    console.log('Fetching email config from Firebase...');
    
    // Try to get from Firebase first
    try {
      const settingsDoc = await getDoc(doc(db, 'settings', 'general'));
      
      if (settingsDoc.exists()) {
        const settings = settingsDoc.data();
        console.log('Settings document found:', {
          hasEmailConfig: !!settings.emailConfig,
          emailConfigEnabled: settings.emailConfig?.enabled
        });
        
        const emailConfig = settings.emailConfig;

        if (emailConfig && emailConfig.enabled) {
          const config = {
            host: emailConfig.smtpHost || 'smtp.gmail.com',
            port: emailConfig.smtpPort || 587,
            secure: emailConfig.smtpSecure || false,
            user: emailConfig.smtpUser || '',
            password: emailConfig.smtpPassword || '',
            fromName: emailConfig.fromName || settings.siteName || 'एरोज्ञा पुस्तकालय',
            fromEmail: emailConfig.fromEmail || emailConfig.smtpUser || '',
          };

          console.log('Email config loaded from Firebase:', {
            host: config.host,
            port: config.port,
            secure: config.secure,
            user: config.user,
            hasPassword: !!config.password,
            fromName: config.fromName,
            fromEmail: config.fromEmail
          });

          return config;
        }
      }
    } catch (firebaseError) {
      console.warn('Firebase config failed, trying environment variables:', firebaseError);
    }

    // Fallback to environment variables
    console.log('Trying environment variables...');
    const envConfig = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      user: process.env.SMTP_USER || '',
      password: process.env.SMTP_PASSWORD || '',
      fromName: process.env.FROM_NAME || 'एरोज्ञा पुस्तकालय',
      fromEmail: process.env.FROM_EMAIL || process.env.SMTP_USER || '',
    };

    if (envConfig.user && envConfig.password) {
      console.log('Using environment variables for email config');
      return envConfig;
    }

    console.error('No valid email configuration found in Firebase or environment variables');
    return null;
  } catch (error) {
    console.error('Error getting email config:', error);
    return null;
  }
}

// Create transporter with configuration
export async function createTransporter() {
  const config = await getEmailConfig();
  if (!config) {
    throw new Error('Email configuration not found or disabled');
  }

  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure, // true for 465, false for other ports
    requireTLS: !config.secure, // Use STARTTLS for non-secure connections
    auth: {
      user: config.user,
      pass: config.password,
    },
    tls: {
      // Don't fail on invalid certs (for development)
      rejectUnauthorized: false
    }
  });
}

// Send email function
export async function sendEmail(emailData: EmailData): Promise<boolean> {
  try {
    const config = await getEmailConfig();
    if (!config) {
      console.error('Email configuration not available');
      return false;
    }

    const transporter = await createTransporter();
    
    const mailOptions = {
      from: `"${config.fromName}" <${config.fromEmail}>`,
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text || emailData.html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
    };

    console.log('📧 Sending email:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
      smtpUser: config.user
    });

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', {
      messageId: result.messageId,
      to: mailOptions.to,
      from: mailOptions.from
    });
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

// Send email to admin
export async function sendAdminNotification(subject: string, html: string): Promise<boolean> {
  try {
    const settingsDoc = await getDoc(doc(db, 'settings', 'general'));
    if (!settingsDoc.exists()) {
      console.error('Settings document not found');
      return false;
    }

    const settings = settingsDoc.data();
    const adminEmail = settings.emailConfig?.adminEmail;

    if (!adminEmail) {
      console.error('Admin email not configured in emailConfig.adminEmail');
      return false;
    }

    // Get SMTP configuration to avoid sending to SMTP user
    const emailConfig = await getEmailConfig();
    if (emailConfig && adminEmail.toLowerCase() === emailConfig.user.toLowerCase()) {
      console.warn('⚠️ Admin email is same as SMTP user. This will cause duplicate emails.');
      console.warn('Please set a different admin email in settings to avoid this issue.');
    }

    console.log('📧 Sending admin notification to:', adminEmail);

    return await sendEmail({
      to: adminEmail,
      subject,
      html,
    });
  } catch (error) {
    console.error('Error sending admin notification:', error);
    return false;
  }
}

// Test email configuration
export async function testEmailConfig(): Promise<{ success: boolean; message: string }> {
  try {
    console.log('Testing email configuration...');
    const config = await getEmailConfig();
    
    if (!config) {
      return { 
        success: false, 
        message: 'Email configuration not found or not enabled. Please check your settings.' 
      };
    }

    console.log('Email config loaded:', {
      host: config.host,
      port: config.port,
      secure: config.secure,
      user: config.user,
      hasPassword: !!config.password
    });

    const transporter = await createTransporter();
    console.log('Transporter created, verifying connection...');
    
    await transporter.verify();
    console.log('SMTP verification successful');
    
    return { success: true, message: 'SMTP configuration is valid and connection successful' };
  } catch (error) {
    console.error('SMTP test error:', error);
    
    let errorMessage = 'Unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Provide specific error messages for common issues
      if (errorMessage.includes('Invalid login')) {
        errorMessage = 'Invalid email or password. For Gmail, make sure you are using an App Password, not your regular password.';
      } else if (errorMessage.includes('ECONNREFUSED')) {
        errorMessage = 'Connection refused. Check your SMTP host and port settings.';
      } else if (errorMessage.includes('ETIMEDOUT')) {
        errorMessage = 'Connection timeout. Check your internet connection and SMTP settings.';
      } else if (errorMessage.includes('ENOTFOUND')) {
        errorMessage = 'SMTP host not found. Please verify the SMTP host address.';
      }
    }
    
    return { 
      success: false, 
      message: `SMTP Error: ${errorMessage}` 
    };
  }
}