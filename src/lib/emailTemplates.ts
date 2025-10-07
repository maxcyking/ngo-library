// Email templates for different notifications

export interface LibraryApplicationData {
    name: string;
    applicationId: string;
    phone: string;
    email: string;
    aadharNumber: string;
    address: string;
    occupation: string;
    submittedAt: string;
}

export interface ContactFormData {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    submittedAt: string;
}

// Library Application - Admin Notification
export function getLibraryApplicationAdminTemplate(data: LibraryApplicationData): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f97316, #dc2626); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
        .footer { background: #374151; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; }
        .info-row { margin: 10px 0; padding: 10px; background: white; border-radius: 4px; border-left: 4px solid #f97316; }
        .label { font-weight: bold; color: #374151; }
        .value { margin-left: 10px; }
        .urgent { background: #fef2f2; border-left-color: #dc2626; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🆕 नया पुस्तकालय आवेदन प्राप्त हुआ</h1>
          <p>New Library Application Received</p>
        </div>
        
        <div class="content">
          <div class="info-row urgent">
            <span class="label">आवेदन संख्या (Application ID):</span>
            <span class="value"><strong>${data.applicationId}</strong></span>
          </div>
          
          <div class="info-row">
            <span class="label">आवेदक का नाम (Name):</span>
            <span class="value">${data.name}</span>
          </div>
          
          <div class="info-row">
            <span class="label">फोन नंबर (Phone):</span>
            <span class="value">${data.phone}</span>
          </div>
          
          <div class="info-row">
            <span class="label">ईमेल (Email):</span>
            <span class="value">${data.email}</span>
          </div>
          
          <div class="info-row">
            <span class="label">आधार नंबर (Aadhar):</span>
            <span class="value">${data.aadharNumber}</span>
          </div>
          
          <div class="info-row">
            <span class="label">पता (Address):</span>
            <span class="value">${data.address}</span>
          </div>
          
          <div class="info-row">
            <span class="label">व्यवसाय (Occupation):</span>
            <span class="value">${data.occupation}</span>
          </div>
          
          <div class="info-row">
            <span class="label">आवेदन समय (Submitted At):</span>
            <span class="value">${data.submittedAt}</span>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background: #dbeafe; border-radius: 4px;">
            <p><strong>📋 अगले कदम (Next Steps):</strong></p>
            <ul>
              <li>आवेदन की समीक्षा करें</li>
              <li>आवश्यक दस्तावेजों की जांच करें</li>
              <li>आवेदक से संपर्क करें</li>
              <li>स्वीकृति/अस्वीकृति की स्थिति अपडेट करें</li>
            </ul>
          </div>
        </div>
        
        <div class="footer">
          <p>एरोज्ञा पुस्तकालय एवं सेवा संस्था</p>
          <p>यह एक स्वचालित ईमेल है, कृपया इसका उत्तर न दें।</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Library Application - User Confirmation
export function getLibraryApplicationUserTemplate(data: LibraryApplicationData): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f97316, #dc2626); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
        .footer { background: #374151; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; }
        .success-box { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 15px; border-radius: 4px; margin: 15px 0; }
        .info-box { background: #eff6ff; border: 1px solid #bfdbfe; padding: 15px; border-radius: 4px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ आवेदन सफलतापूर्वक प्राप्त हुआ</h1>
          <p>Application Successfully Received</p>
        </div>
        
        <div class="content">
          <div class="success-box">
            <h3>🙏 धन्यवाद ${data.name} जी!</h3>
            <p>आपका पुस्तकालय सदस्यता आवेदन सफलतापूर्वक प्राप्त हो गया है।</p>
          </div>
          
          <div class="info-box">
            <h4>📋 आवेदन विवरण:</h4>
            <p><strong>आवेदन संख्या:</strong> ${data.applicationId}</p>
            <p><strong>आवेदन दिनांक:</strong> ${data.submittedAt}</p>
            <p><strong>स्थिति:</strong> समीक्षाधीन (Under Review)</p>
          </div>
          
          <div class="info-box">
            <h4>⏰ अगले कदम:</h4>
            <ul>
              <li>हमारी टीम 2-3 कार्य दिवसों में आपके आवेदन की समीक्षा करेगी</li>
              <li>आवश्यक दस्तावेजों की जांच की जाएगी</li>
              <li>स्वीकृति पर आपको फोन/ईमेल से सूचित किया जाएगा</li>
              <li>आप अपने आवेदन की स्थिति ऑनलाइन ट्रैक कर सकते हैं</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 20px 0;">
            <p><strong>आवेदन ट्रैक करने के लिए:</strong></p>
            <p>आवेदन संख्या: <strong>${data.applicationId}</strong> का उपयोग करें</p>
          </div>
          
          <div class="info-box">
            <h4>📞 संपर्क जानकारी:</h4>
            <p>यदि आपके कोई प्रश्न हैं, तो कृपया हमसे संपर्क करें:</p>
            <p><strong>फोन:</strong> [PHONE_NUMBER]</p>
            <p><strong>ईमेल:</strong> [EMAIL_ADDRESS]</p>
          </div>
        </div>
        
        <div class="footer">
          <p>एरोज्ञा पुस्तकालय एवं सेवा संस्था</p>
          <p>शिक्षा, स्वास्थ्य और सामाजिक कल्याण के लिए समर्पित</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Contact Form - Admin Notification
export function getContactFormAdminTemplate(data: ContactFormData): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
        .footer { background: #374151; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; }
        .info-row { margin: 10px 0; padding: 10px; background: white; border-radius: 4px; border-left: 4px solid #3b82f6; }
        .message-box { background: #fefce8; border: 1px solid #fde047; padding: 15px; border-radius: 4px; margin: 15px 0; }
        .label { font-weight: bold; color: #374151; }
        .value { margin-left: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📧 नया संपर्क संदेश प्राप्त हुआ</h1>
          <p>New Contact Form Message</p>
        </div>
        
        <div class="content">
          <div class="info-row">
            <span class="label">नाम (Name):</span>
            <span class="value">${data.name}</span>
          </div>
          
          <div class="info-row">
            <span class="label">ईमेल (Email):</span>
            <span class="value">${data.email}</span>
          </div>
          
          ${data.phone ? `
          <div class="info-row">
            <span class="label">फोन नंबर (Phone):</span>
            <span class="value">${data.phone}</span>
          </div>
          ` : ''}
          
          <div class="info-row">
            <span class="label">विषय (Subject):</span>
            <span class="value">${data.subject}</span>
          </div>
          
          <div class="info-row">
            <span class="label">संदेश समय (Submitted At):</span>
            <span class="value">${data.submittedAt}</span>
          </div>
          
          <div class="message-box">
            <h4>💬 संदेश (Message):</h4>
            <p style="white-space: pre-wrap;">${data.message}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background: #dbeafe; border-radius: 4px;">
            <p><strong>📋 सुझावित कार्य (Suggested Actions):</strong></p>
            <ul>
              <li>24 घंटे के भीतर उत्तर दें</li>
              <li>यदि आवश्यक हो तो फोन से संपर्क करें</li>
              <li>संदेश को उपयुक्त विभाग को फॉरवर्ड करें</li>
            </ul>
          </div>
        </div>
        
        <div class="footer">
          <p>एरोज्ञा पुस्तकालय एवं सेवा संस्था</p>
          <p>यह एक स्वचालित ईमेल है, कृपया इसका उत्तर न दें।</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Contact Form - User Confirmation
export function getContactFormUserTemplate(data: ContactFormData): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
        .footer { background: #374151; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; }
        .success-box { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 15px; border-radius: 4px; margin: 15px 0; }
        .info-box { background: #eff6ff; border: 1px solid #bfdbfe; padding: 15px; border-radius: 4px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ आपका संदेश प्राप्त हुआ</h1>
          <p>Your Message Has Been Received</p>
        </div>
        
        <div class="content">
          <div class="success-box">
            <h3>🙏 धन्यवाद ${data.name} जी!</h3>
            <p>आपका संदेश सफलतापूर्वक प्राप्त हो गया है। हम जल्द ही आपसे संपर्क करेंगे।</p>
          </div>
          
          <div class="info-box">
            <h4>📋 आपका संदेश:</h4>
            <p><strong>विषय:</strong> ${data.subject}</p>
            <p><strong>भेजा गया:</strong> ${data.submittedAt}</p>
          </div>
          
          <div class="info-box">
            <h4>⏰ अपेक्षित प्रतिक्रिया समय:</h4>
            <ul>
              <li><strong>सामान्य प्रश्न:</strong> 24-48 घंटे</li>
              <li><strong>तकनीकी सहायता:</strong> 2-3 कार्य दिवस</li>
              <li><strong>आपातकालीन मामले:</strong> तत्काल (फोन करें)</li>
            </ul>
          </div>
          
          <div class="info-box">
            <h4>📞 तत्काल सहायता के लिए:</h4>
            <p>यदि आपका मामला आपातकालीन है, तो कृपया हमें फोन करें:</p>
            <p><strong>फोन:</strong> [PHONE_NUMBER]</p>
            <p><strong>कार्यालय समय:</strong> सोमवार-शनिवार, 9:00 AM - 6:00 PM</p>
          </div>
        </div>
        
        <div class="footer">
          <p>एरोज्ञा पुस्तकालय एवं सेवा संस्था</p>
          <p>शिक्षा, स्वास्थ्य और सामाजिक कल्याण के लिए समर्पित</p>
        </div>
      </div>
    </body>
    </html>
  `;
}