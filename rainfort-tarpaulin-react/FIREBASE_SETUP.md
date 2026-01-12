# 🔥 Firebase Setup Guide for RainFort Tarpaulin

This guide will help you set up Firebase to store customer quote requests from your website.

---

## 📋 Prerequisites

- A Google account
- Node.js and npm installed (already done ✅)
- Firebase CLI (optional, for advanced users)

---

## 🚀 Step-by-Step Setup

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `rainfort-tarpaulin` (or any name you prefer)
4. Enable/Disable Google Analytics (optional - recommended to enable)
5. Click **"Create project"**
6. Wait for the project to be created, then click **"Continue"**

---

### Step 2: Register Your Web App

1. In the Firebase Console, click the **web icon** `</>` to add a web app
2. Enter app nickname: `RainFort Website` (or any name)
3. **Do NOT** check "Firebase Hosting" (unless you want to deploy on Firebase)
4. Click **"Register app"**
5. You'll see a configuration object - **KEEP THIS OPEN** (you'll need it in Step 4)

---

### Step 3: Enable Firestore Database

1. In the left sidebar, click **"Firestore Database"**
2. Click **"Create database"**
3. Select **"Start in test mode"** (for now - we'll secure it later)
4. Choose your database location (closest to your users):
   - For India: `asia-south1 (Mumbai)`
   - For US: `us-central1`
5. Click **"Enable"**

---

### Step 4: Configure Your Environment Variables

1. Open the file: `.env` in your project root
2. Copy the Firebase config values from Step 2 and paste them:

```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890abcdef
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

3. **IMPORTANT:** Restart your development server after updating `.env`:
   ```bash
   # Stop the server (Ctrl+C) and restart:
   npm run dev
   ```

---

### Step 5: Set Up Firestore Security Rules

**Important:** The default "test mode" rules allow anyone to read/write for 30 days. Let's secure it properly.

1. In Firebase Console, go to **"Firestore Database"** → **"Rules"** tab
2. Replace the existing rules with these **production-ready rules**:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Quotes collection - allow anyone to create, but not read/update/delete
    match /quotes/{quoteId} {
      // Allow anyone to submit quotes (create only)
      allow create: if request.resource.data.keys().hasAll(['name', 'phone', 'requirement'])
                    && request.resource.data.name is string
                    && request.resource.data.phone is string
                    && request.resource.data.requirement is string
                    && request.resource.data.name.size() > 0
                    && request.resource.data.phone.size() > 0
                    && request.resource.data.requirement.size() > 0;

      // Only authenticated admin users can read/update/delete
      // (You'll need to set up Firebase Auth for admin access)
      allow read, update, delete: if false; // Change this when you add admin authentication
    }
  }
}
```

3. Click **"Publish"**

---

### Step 6: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open your website in the browser

3. Click any **"Get Quote"** button

4. Fill out the form and submit

5. Check the browser console - you should see:
   ```
   ✅ Firebase initialized successfully
   ✅ Quote submitted to Firebase: {success: true, id: "..."}
   ```

6. Go back to Firebase Console → **Firestore Database** → **"Data"** tab

7. You should see a new collection called `quotes` with your submitted data! 🎉

---

## 📊 Viewing Quote Submissions

### In Firebase Console:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click **"Firestore Database"** in the left sidebar
4. Click on the **"quotes"** collection
5. You'll see all submitted quotes with:
   - Customer name
   - Phone number
   - Requirements
   - Product name
   - Timestamp
   - Status (new, contacted, quoted, etc.)

### Data Structure:

Each quote document contains:
```javascript
{
  name: "John Doe",
  phone: "+91 98765 43210",
  requirement: "Need 100 sq meters of waterproof tarpaulin...",
  product: "PVC Coated Tarpaulin",
  status: "new",
  source: "website",
  createdAt: Timestamp,
  updatedAt: Timestamp,
  userAgent: "...",
  referrer: "...",
  currentUrl: "..."
}
```

---

## 🔐 Security Best Practices

### Current Setup (After Step 5):
- ✅ Users can submit quotes (create only)
- ✅ Users cannot read other people's quotes
- ✅ Users cannot modify or delete quotes
- ❌ Admin access not configured yet

### For Admin Access (Future Setup):

If you want to build an admin dashboard to manage quotes:

1. **Enable Firebase Authentication:**
   - In Firebase Console → **Authentication** → **Get started**
   - Enable **"Email/Password"** sign-in method
   - Create admin user accounts

2. **Update Security Rules:**
   ```javascript
   // Allow authenticated admins to read/update quotes
   allow read, update: if request.auth != null
                      && request.auth.token.admin == true;
   ```

3. **Set Custom Claims for Admin:**
   - Use Firebase Admin SDK to set custom claims
   - Or use Firebase Console to manually set admin privileges

---

## 🎨 Email Notifications (Optional Enhancement)

To get email notifications when someone submits a quote:

### Option 1: Cloud Functions (Recommended)

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Initialize Cloud Functions:
   ```bash
   firebase init functions
   ```

3. Create a function to send emails on new quotes:
   ```javascript
   // functions/index.js
   const functions = require('firebase-functions');
   const nodemailer = require('nodemailer');

   exports.sendQuoteNotification = functions.firestore
     .document('quotes/{quoteId}')
     .onCreate(async (snap, context) => {
       const quoteData = snap.data();

       // Send email notification
       const transporter = nodemailer.createTransporter({
         service: 'gmail',
         auth: {
           user: 'your-email@gmail.com',
           pass: 'your-app-password'
         }
       });

       await transporter.sendMail({
         from: 'your-email@gmail.com',
         to: 'sales@rainfort.com',
         subject: `New Quote Request - ${quoteData.product}`,
         html: `
           <h2>New Quote Request</h2>
           <p><strong>Name:</strong> ${quoteData.name}</p>
           <p><strong>Phone:</strong> ${quoteData.phone}</p>
           <p><strong>Product:</strong> ${quoteData.product}</p>
           <p><strong>Requirements:</strong> ${quoteData.requirement}</p>
         `
       });
     });
   ```

4. Deploy:
   ```bash
   firebase deploy --only functions
   ```

### Option 2: Third-Party Services

Use services like:
- [Zapier](https://zapier.com/) - Connect Firebase to Gmail/Email
- [Make.com](https://www.make.com/) (formerly Integromat)
- [Pipedream](https://pipedream.com/)

---

## 📱 Mobile App Integration

The same Firebase project can be used for:
- Android app (add Android app in Firebase Console)
- iOS app (add iOS app in Firebase Console)
- Flutter app (supports both platforms)

---

## 💰 Pricing & Limits

### Firebase Free Tier (Spark Plan):
- ✅ **Firestore reads:** 50,000/day
- ✅ **Firestore writes:** 20,000/day
- ✅ **Firestore deletes:** 20,000/day
- ✅ **Storage:** 1 GB
- ✅ **Network egress:** 10 GB/month

**For your use case:** Even with 100 quote submissions per day, you'll stay well within the free tier! 🎉

---

## 🐛 Troubleshooting

### Issue: "Permission denied" error

**Solution:**
- Check that you've published the security rules from Step 5
- Make sure `.env` file has correct Firebase credentials
- Restart your dev server after updating `.env`

### Issue: Firebase config values showing as "undefined"

**Solution:**
- Verify all environment variables start with `VITE_` (required for Vite)
- Restart dev server: `Ctrl+C` then `npm run dev`
- Check browser console for initialization errors

### Issue: "Firebase app already exists"

**Solution:**
- This is normal if hot-reload happens during development
- The app checks for existing instance before initializing
- No action needed unless you see actual errors

### Issue: Cannot see submitted quotes in Firebase Console

**Solution:**
- Check browser console for submission errors
- Verify Firebase project ID in `.env` matches your console
- Check network tab for failed API calls
- Make sure Firestore is enabled (not Realtime Database)

---

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Pricing](https://firebase.google.com/pricing)
- [Cloud Functions Guide](https://firebase.google.com/docs/functions)

---

## ✅ Checklist

- [ ] Created Firebase project
- [ ] Registered web app
- [ ] Enabled Firestore Database
- [ ] Updated `.env` with Firebase credentials
- [ ] Published security rules
- [ ] Restarted development server
- [ ] Tested quote submission
- [ ] Verified data in Firebase Console

---

## 🎉 Next Steps

1. **Test thoroughly** - Submit multiple quotes and verify they appear in Firebase
2. **Set up email notifications** (optional) - Get notified when quotes arrive
3. **Build admin dashboard** (optional) - Manage and respond to quotes
4. **Enable Analytics** - Track user behavior and conversions
5. **Add phone authentication** - Verify customer phone numbers

---

## 📞 Need Help?

If you encounter any issues:
1. Check the troubleshooting section above
2. Review browser console for error messages
3. Check Firebase Console logs
4. Verify all steps were completed in order

---

**Last Updated:** January 2026
**Version:** 1.0.0
