# Routing Debug Guide - एरोग्या पुस्तकालय

## Issue Analysis
You're getting a 404 error when accessing `localhost:3002/login`. Here's how to fix it:

## Step 1: Check Server Status
1. **Stop any running server** (Ctrl+C in terminal)
2. **Clear cache**: Delete `.next` folder if it exists
3. **Start fresh server**:
   ```bash
   npm run dev
   ```
4. **Default port should be 3000**, not 3002

## Step 2: Correct URLs to Test

### ✅ These URLs should work:
- `http://localhost:3000/` - Home page
- `http://localhost:3000/admin` - Auto-redirects to login/dashboard
- `http://localhost:3000/admin/login` - Admin login page
- `http://localhost:3000/login` - Redirects to admin login

### ❌ URLs that won't work:
- `localhost:3002/*` - Wrong port
- Routes without proper server running

## Step 3: Files Created for Route Fixes

### New Route Files:
1. **`src/app/login/page.tsx`** - Redirects `/login` → `/admin/login`
2. **`src/app/admin/page.tsx`** - Handles `/admin` → `/admin/dashboard` or `/admin/login`

### Route Structure:
```
src/app/
├── page.tsx                 # / (Home)
├── login/
│   └── page.tsx            # /login → /admin/login
├── admin/
│   ├── page.tsx            # /admin → /admin/dashboard or /admin/login
│   ├── login/
│   │   └── page.tsx        # /admin/login (Admin Login)
│   ├── dashboard/
│   │   └── page.tsx        # /admin/dashboard
│   └── members/
│       └── page.tsx        # /admin/members
```

## Step 4: Test Authentication Flow

### Test Sequence:
1. **Start server**: `npm run dev`
2. **Access**: `http://localhost:3000/admin/dashboard`
3. **Should redirect to**: `http://localhost:3000/admin/login?redirect=%2Fadmin%2Fdashboard`
4. **Login with**: `admin@arogyabmr.org`
5. **Should redirect back to**: `http://localhost:3000/admin/dashboard`

## Step 5: Common Issues & Solutions

### Issue: Port 3002 instead of 3000
**Solution**: Make sure no other process is using port 3000
```bash
# Kill any process on port 3000
npx kill-port 3000
# Start fresh
npm run dev
```

### Issue: 404 on any route
**Solution**: 
1. Delete `.next` folder
2. Delete `node_modules` and reinstall:
   ```bash
   rm -rf node_modules .next
   npm install
   npm run dev
   ```

### Issue: Changes not reflecting
**Solution**: Hard refresh browser (Ctrl+F5) or clear browser cache

## Step 6: Environment Check

### Required Environment Variables:
Create `.env.local` file in project root:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Step 7: Testing Commands

```bash
# Clean start
npm run dev

# Build test
npm run build

# Production test
npm run start
```

## Expected Behavior

### When you access `/admin/*`:
1. **Not logged in** → Redirect to `/admin/login?redirect=original_url`
2. **Logged in as admin** → Access granted
3. **Logged in as non-admin** → Access denied, redirect to login

### When you access `/login`:
→ Auto-redirect to `/admin/login`

### When you access `/admin`:
→ Auto-redirect to `/admin/dashboard` (if logged in) or `/admin/login` (if not)

## Debugging Steps if Still Not Working

1. **Check terminal for errors** when running `npm run dev`
2. **Check browser console** for JavaScript errors
3. **Verify file structure** matches the above
4. **Check if environment variables** are set correctly
5. **Try incognito mode** to rule out cache issues

---

## Quick Fix Summary

1. **Stop server** (Ctrl+C)
2. **Delete `.next` folder** (if exists)
3. **Run `npm run dev`**
4. **Access `http://localhost:3000/admin`** (note: port 3000, not 3002)
5. **Should redirect to login page**

**Status**: 🔧 Ready for Testing
