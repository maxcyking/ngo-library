# 🔧 Email Troubleshooting Guide
## एरोज्ञा पुस्तकालय - ईमेल समस्या निवारण गाइड

## 🚨 Common Issues & Solutions

### Issue 1: "Failed to send test email"

#### Step 1: Check Gmail App Password Setup
1. **Go to Gmail Settings**: https://myaccount.google.com/security
2. **Enable 2-Step Verification** (if not already enabled)
3. **Generate App Password**:
   - Click "App passwords"
   - Select "Mail" as the app
   - Copy the 16-character password (format: `abcd efgh ijkl mnop`)
   - **IMPORTANT**: Use this App Password, NOT your Gmail password

#### Step 2: Verify SMTP Settings
```
✅ Correct Gmail Settings:
SMTP Host: smtp.gmail.com
SMTP Port: 587
SSL/TLS: ✅ Enabled (checked)
Username: your-email@gmail.com
Password: [16-character App Password]
```

#### Step 3: Debug Your Configuration
1. Open browser console (F12)
2. Go to: `your-website.com/api/debug-email`
3. Check the response for configuration details

### Issue 2: "Invalid login" Error

**Solution**: You're using your regular Gmail password instead of App Password
- ❌ Wrong: Your regular Gmail password
- ✅ Correct: 16-character App Password from Google

### Issue 3: "Connection refused" Error

**Possible Causes**:
1. **Wrong SMTP Host**: Should be `smtp.gmail.com`
2. **Wrong Port**: Should be `587` for TLS or `465` for SSL
3. **Firewall blocking**: Check if port 587/465 is blocked

**Solutions**:
- Try Port 465 with SSL enabled
- Contact your hosting provider about SMTP ports

### Issue 4: "Connection timeout" Error

**Possible Causes**:
1. Network connectivity issues
2. Hosting provider blocking SMTP
3. Wrong SMTP settings

**Solutions**:
1. Check internet connection
2. Try different SMTP port (465 instead of 587)
3. Contact hosting provider

## 🔍 Step-by-Step Debugging

### Step 1: Verify Gmail Setup
1. Login to Gmail
2. Go to: https://myaccount.google.com/security
3. Check if 2-Step Verification is ON
4. Generate new App Password if needed

### Step 2: Check Admin Panel Settings
1. Go to `/admin/settings`
2. Click "ईमेल सेटिंग्स" tab
3. Verify these settings:
   ```
   ✅ Enable Email Notifications: Checked
   SMTP Host: smtp.gmail.com
   SMTP Port: 587
   ✅ SSL/TLS Security: Checked
   SMTP Username: your-email@gmail.com
   SMTP Password: [App Password - 16 characters]
   Admin Email: admin@yourdomain.com
   ```

### Step 3: Test Configuration
1. Click "परीक्षण ईमेल भेजें" button
2. Check browser console for errors (F12)
3. Wait for response message

### Step 4: Debug API Response
1. Open: `your-website.com/api/debug-email`
2. Check the JSON response
3. Look for these values:
   ```json
   {
     "configExists": true,
     "enabled": true,
     "smtpHost": "smtp.gmail.com",
     "smtpPort": 587,
     "hasPassword": true,
     "passwordLength": 16
   }
   ```

## 🛠️ Alternative SMTP Providers

### If Gmail doesn't work, try these:

#### Outlook/Hotmail
```
SMTP Host: smtp-mail.outlook.com
SMTP Port: 587
SSL/TLS: ✅ Enabled
Username: your-email@outlook.com
Password: Your Outlook password
```

#### Yahoo Mail
```
SMTP Host: smtp.mail.yahoo.com
SMTP Port: 587 or 465
SSL/TLS: ✅ Enabled
Username: your-email@yahoo.com
Password: App Password (generate from Yahoo settings)
```

#### Custom Domain (cPanel)
```
SMTP Host: mail.yourdomain.com
SMTP Port: 587 or 465
SSL/TLS: ✅ Enabled
Username: your-email@yourdomain.com
Password: Your email password
```

## 🔧 Manual Testing

### Test 1: Check if nodemailer is installed
```bash
npm list nodemailer
```
Should show: `nodemailer@x.x.x`

### Test 2: Check Firebase settings
1. Go to Firebase Console
2. Check if `settings/general` document exists
3. Verify `emailConfig` field is present

### Test 3: Browser Console Debugging
1. Open browser console (F12)
2. Go to admin settings page
3. Try sending test email
4. Check for JavaScript errors

## 📞 Common Error Messages & Solutions

### "Email configuration not found or disabled"
**Solution**: 
1. Enable email notifications in admin panel
2. Save settings before testing

### "SMTP configuration error: Invalid login"
**Solution**: 
1. Use Gmail App Password, not regular password
2. Regenerate App Password if needed

### "Connection refused"
**Solution**: 
1. Check SMTP host and port
2. Try port 465 with SSL
3. Contact hosting provider

### "ENOTFOUND smtp.gmail.com"
**Solution**: 
1. Check internet connection
2. Verify SMTP host spelling
3. Try different DNS server

## 🚀 Quick Fix Checklist

- [ ] 2-Factor Authentication enabled in Gmail
- [ ] App Password generated (16 characters)
- [ ] SMTP Host: `smtp.gmail.com`
- [ ] SMTP Port: `587`
- [ ] SSL/TLS: Enabled
- [ ] Username: Full Gmail address
- [ ] Password: App Password (not Gmail password)
- [ ] Email notifications enabled in admin panel
- [ ] Settings saved before testing
- [ ] Browser console checked for errors

## 📧 Test Email Manually

If admin panel test fails, try this manual test:

1. Go to: `your-website.com/api/send-email`
2. Send POST request with:
```json
{
  "type": "test-email",
  "data": {
    "email": "your-email@gmail.com"
  }
}
```

## 🆘 Still Not Working?

### Check These:

1. **Hosting Provider**: Some hosts block SMTP ports
2. **Firewall**: Port 587/465 might be blocked
3. **Gmail Security**: Try "Less secure app access" (not recommended)
4. **Alternative**: Use SendGrid, Mailgun, or other email services

### Contact Information:
If you're still having issues, provide these details:
- Error message from browser console
- Response from `/api/debug-email`
- Gmail App Password setup confirmation
- Hosting provider name

## 🎯 Success Indicators

When email is working correctly, you should see:
- ✅ "Test email sent successfully" message
- ✅ Email received in inbox
- ✅ No errors in browser console
- ✅ Debug API shows all green values

---

**Remember**: Gmail App Password is the most common issue. Make sure you're using the 16-character App Password, not your regular Gmail password!