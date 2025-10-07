# 📧 Email Notification Setup Guide
## एरोज्ञा पुस्तकालय - ईमेल सूचना सेटअप गाइड

This guide will help you set up email notifications for library applications and contact form submissions.

## 🚀 Features Added

### ✅ Email Notifications for:
1. **Library Applications** - Admin notification + User confirmation
2. **Contact Form Submissions** - Admin notification + User confirmation
3. **SMTP Configuration** - Complete admin panel integration
4. **Email Testing** - Built-in test functionality

## 📋 Step-by-Step Gmail Setup

### Step 1: Enable 2-Factor Authentication
1. Go to your Gmail account settings
2. Navigate to **Security** section
3. Enable **2-Step Verification** if not already enabled

### Step 2: Generate App Password
1. In Gmail Security settings, find **App passwords**
2. Click **Generate** and select **Mail** as the app
3. Copy the generated 16-character password (e.g., `abcd efgh ijkl mnop`)
4. **Important**: Use this App Password, NOT your regular Gmail password

### Step 3: Configure SMTP in Admin Panel
1. Login to admin panel: `/admin/settings`
2. Go to **ईमेल सेटिंग्स (Email Settings)** tab
3. Fill in the following details:

```
✅ Enable Email Notifications: Checked
SMTP Host: smtp.gmail.com
SMTP Port: 587
✅ SSL/TLS Security: Checked
SMTP Username: your-email@gmail.com
SMTP Password: [Your 16-character App Password]
From Name: एरोज्ञा पुस्तकालय
From Email: your-email@gmail.com (or leave blank)
Admin Email: admin@yourdomain.com
```

### Step 4: Test Configuration
1. Click **परीक्षण ईमेल भेजें (Send Test Email)** button
2. Check your inbox for the test email
3. If successful, save the settings

## 🔧 Technical Implementation

### Files Added/Modified:

#### New Files:
- `src/lib/email.ts` - Email service functions
- `src/lib/emailTemplates.ts` - HTML email templates
- `src/app/api/send-email/route.ts` - API endpoint for sending emails

#### Modified Files:
- `src/app/admin/settings/page.tsx` - Added SMTP configuration
- `src/app/apply/page.tsx` - Added email sending on application submission
- `src/app/contact/page.tsx` - Added email sending on contact form submission

### Email Templates:

#### 1. Library Application - Admin Notification
- **Subject**: `🆕 नया पुस्तकालय आवेदन - [APPLICATION_ID]`
- **Content**: Complete application details with next steps
- **Language**: Hindi + English

#### 2. Library Application - User Confirmation
- **Subject**: `✅ आवेदन प्राप्त - [APPLICATION_ID] | एरोज्ञा पुस्तकालय`
- **Content**: Confirmation with tracking information
- **Language**: Hindi + English

#### 3. Contact Form - Admin Notification
- **Subject**: `📧 नया संपर्क संदेश - [SUBJECT]`
- **Content**: Complete message details with sender info
- **Language**: Hindi + English

#### 4. Contact Form - User Confirmation
- **Subject**: `✅ संदेश प्राप्त हुआ - [SUBJECT] | एरोज्ञा पुस्तकालय`
- **Content**: Acknowledgment with response timeline
- **Language**: Hindi + English

## 🛠️ Alternative SMTP Providers

### Gmail (Recommended)
```
Host: smtp.gmail.com
Port: 587 (TLS) or 465 (SSL)
Security: TLS/SSL
Authentication: App Password required
```

### Outlook/Hotmail
```
Host: smtp-mail.outlook.com
Port: 587
Security: TLS
Authentication: Regular password
```

### Yahoo Mail
```
Host: smtp.mail.yahoo.com
Port: 587 or 465
Security: TLS/SSL
Authentication: App Password required
```

### Custom Domain (cPanel/WHM)
```
Host: mail.yourdomain.com
Port: 587 or 465
Security: TLS/SSL
Authentication: Email password
```

## 🔍 Troubleshooting

### Common Issues:

#### 1. "Authentication Failed"
- **Solution**: Use App Password instead of regular password
- **Gmail**: Generate App Password in Security settings
- **Yahoo**: Enable "Less secure app access" or use App Password

#### 2. "Connection Timeout"
- **Solution**: Check port and security settings
- **Try**: Port 465 with SSL instead of 587 with TLS

#### 3. "Emails Not Sending"
- **Check**: SMTP credentials are correct
- **Verify**: Email configuration is enabled in admin panel
- **Test**: Use the built-in test email function

#### 4. "Emails Going to Spam"
- **Solution**: Set up proper SPF, DKIM, and DMARC records
- **Alternative**: Use a dedicated email service like SendGrid or Mailgun

### Debug Steps:
1. Check browser console for errors
2. Verify SMTP settings in admin panel
3. Test with the built-in test email function
4. Check server logs for detailed error messages

## 📱 Mobile-Friendly Templates

All email templates are responsive and work well on:
- ✅ Desktop computers
- ✅ Mobile phones
- ✅ Tablets
- ✅ Email clients (Gmail, Outlook, etc.)

## 🔐 Security Features

- **App Password Support**: Secure authentication for Gmail
- **TLS/SSL Encryption**: Secure email transmission
- **Input Validation**: Prevents email injection attacks
- **Error Handling**: Graceful failure without breaking application flow

## 📊 Email Analytics

The system logs email sending status:
- ✅ Success/failure status
- 📧 Email type (application/contact)
- ⏰ Timestamp
- 🎯 Recipient information

## 🚀 Production Deployment

### Environment Variables (Optional)
You can also set SMTP configuration via environment variables:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_NAME=एरोज्ञा पुस्तकालय
FROM_EMAIL=your-email@gmail.com
ADMIN_EMAIL=admin@yourdomain.com
```

### Vercel Deployment
1. Add environment variables in Vercel dashboard
2. Redeploy the application
3. Test email functionality

## 📞 Support

If you need help with email setup:
1. Check this guide first
2. Test with the built-in test function
3. Verify Gmail App Password setup
4. Contact technical support if issues persist

---

## 🎉 Success!

Once configured, your library will automatically send:
- 📧 Admin notifications for new applications
- ✅ User confirmations for applications
- 📞 Admin notifications for contact form messages
- 🙏 User acknowledgments for contact form submissions

All emails are professionally designed with your organization's branding and are mobile-friendly!