# 💳 Razorpay Payment Gateway Setup Guide
## एरोज्ञा पुस्तकालय - Razorpay Integration

This guide will help you set up Razorpay payment gateway for accepting donations.

## 🚀 Features Implemented

### ✅ Donation System:
1. **Money Donation (भामाशाह)** - Online payment via Razorpay
2. **Blood Donation (रक्तदान)** - Registration form
3. **Body Donation (देहदान)** - Registration form

### 📱 Pages Created:
- `/donate` - Donation form with Razorpay integration
- `/donations` - Donor lists (existing page)

### 🔗 Navigation Updated:
- **"दान करें" button** in header → Goes to `/donate` (donation form)
- **"दान सूची" menu item** → Goes to `/donations` (donor lists)

## 📋 Step-by-Step Razorpay Setup

### Step 1: Create Razorpay Account

1. **Go to**: https://razorpay.com/
2. **Click**: "Sign Up" button
3. **Fill details**:
   - Business Name: एरोज्ञा पुस्तकालय एवं सेवा संस्था
   - Email: your-email@gmail.com
   - Phone: +91 96600 89144
4. **Verify** email and phone
5. **Complete KYC** (required for live payments)

### Step 2: Get API Keys

1. **Login** to Razorpay Dashboard
2. **Go to**: Settings → API Keys
3. **Generate Keys**:
   - Test Mode: For testing (use test cards)
   - Live Mode: For real payments (after KYC approval)
4. **Copy**:
   - Key ID: `rzp_test_XXXXXXXXXXXXX` (for test)
   - Key Secret: `XXXXXXXXXXXXXXXX` (keep secret!)

### Step 3: Configure in Your Project

1. **Create `.env.local` file** in project root:
   ```env
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
   RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET
   ```

2. **Replace** `YOUR_KEY_ID` with your actual Razorpay Key ID

3. **Restart** your development server:
   ```bash
   npm run dev
   ```

### Step 4: Test the Integration

#### Test Mode (Using Test Cards):

1. **Go to**: `http://localhost:3000/donate`
2. **Select**: आर्थिक सहायता (Money Donation)
3. **Fill form** with test data
4. **Click**: भुगतान करें
5. **Use test card**:
   - Card Number: `4111 1111 1111 1111`
   - CVV: Any 3 digits (e.g., `123`)
   - Expiry: Any future date (e.g., `12/25`)
   - Name: Any name

#### More Test Cards:
- **Success**: `4111 1111 1111 1111`
- **Failure**: `4111 1111 1111 1112`
- **UPI**: Use `success@razorpay` for testing

### Step 5: Go Live (Production)

1. **Complete KYC** in Razorpay Dashboard:
   - Business documents
   - Bank account details
   - PAN card
   - Address proof

2. **Get Live Keys**:
   - Go to Settings → API Keys
   - Switch to "Live Mode"
   - Generate live keys

3. **Update `.env.local`**:
   ```env
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY_ID
   RAZORPAY_KEY_SECRET=YOUR_LIVE_KEY_SECRET
   ```

4. **Deploy** to production (Vercel/Netlify)

## 🔧 Configuration Options

### Payment Settings in Razorpay Dashboard:

1. **Payment Methods**:
   - ✅ Credit/Debit Cards
   - ✅ Net Banking
   - ✅ UPI
   - ✅ Wallets (Paytm, PhonePe, etc.)

2. **Webhook Setup** (Optional):
   - URL: `https://your-domain.com/api/razorpay-webhook`
   - Events: payment.captured, payment.failed

3. **Settlement**:
   - Auto-settlement to bank account
   - T+2 days (2 days after payment)

## 💰 Transaction Fees

### Razorpay Charges:
- **Domestic Cards**: 2% + GST
- **International Cards**: 3% + GST
- **UPI**: 0% (free for first ₹50,000/month)
- **Net Banking**: 2% + GST
- **Wallets**: 2% + GST

### Example:
- Donation: ₹1,000
- Fee (2%): ₹20
- GST (18%): ₹3.60
- **You receive**: ₹976.40

## 🛠️ Troubleshooting

### Issue 1: "Razorpay SDK failed to load"
**Solution**: Check internet connection and firewall settings

### Issue 2: Payment not working
**Solutions**:
1. Verify API keys are correct
2. Check if test mode is enabled
3. Use test cards for testing
4. Check browser console for errors

### Issue 3: Payment successful but not saved
**Solutions**:
1. Check Firebase connection
2. Verify Firestore rules allow writes
3. Check browser console for errors

## 📊 Viewing Donations

### In Razorpay Dashboard:
1. **Go to**: Transactions → Payments
2. **View**: All successful payments
3. **Export**: Download reports

### In Your Website:
1. **Admin Panel**: `/admin/donations`
2. **Public Page**: `/donations` (donor lists)

## 🔐 Security Best Practices

1. **Never expose** Key Secret in frontend code
2. **Use environment variables** for sensitive data
3. **Enable webhook signature verification**
4. **Implement server-side validation**
5. **Use HTTPS** in production

## 📱 Mobile Responsiveness

The donation form is fully responsive and works on:
- ✅ Desktop computers
- ✅ Tablets
- ✅ Mobile phones
- ✅ All modern browsers

## 🎯 Features of Donation System

### Money Donation:
- ✅ Multiple payment methods
- ✅ Quick amount selection (₹100, ₹500, ₹1000, ₹5000)
- ✅ Custom amount input
- ✅ Optional message/purpose
- ✅ Automatic receipt generation
- ✅ Email notifications (if configured)
- ✅ Donor list display

### Blood Donation:
- ✅ Blood group selection
- ✅ Age validation (18-65 years)
- ✅ Last donation date tracking
- ✅ Automatic registration
- ✅ Searchable donor database

### Body Donation:
- ✅ Age calculation from DOB
- ✅ Medical history recording
- ✅ Registration confirmation
- ✅ Important information display

## 📞 Support

### Razorpay Support:
- **Email**: support@razorpay.com
- **Phone**: 1800-102-0480
- **Docs**: https://razorpay.com/docs/

### Your Organization:
- **Phone**: +91 96600 89144
- **Email**: arogyapustkalaya@gmail.com

## 🚀 Next Steps

1. ✅ Create Razorpay account
2. ✅ Get API keys
3. ✅ Configure `.env.local`
4. ✅ Test with test cards
5. ✅ Complete KYC
6. ✅ Get live keys
7. ✅ Deploy to production
8. ✅ Start accepting donations!

---

## 🎉 Success!

Once configured, your donation system will:
- ✅ Accept online payments securely
- ✅ Register blood and body donors
- ✅ Display donor lists publicly
- ✅ Send automatic confirmations
- ✅ Track all donations in Firebase
- ✅ Show donor appreciation

Your NGO is now ready to accept donations and make a bigger impact in society!
