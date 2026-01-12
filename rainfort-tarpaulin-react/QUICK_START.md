# ⚡ Quick Start Guide

## 🔥 Firebase Setup (Required to Save Quotes)

### ⏱️ 5-Minute Setup

1. **Create Firebase Project**
   - Go to: https://console.firebase.google.com/
   - Click "Add project"
   - Name: `rainfort-tarpaulin`
   - Click "Create project"

2. **Add Web App**
   - Click the web icon `</>`
   - App nickname: `RainFort Website`
   - Click "Register app"
   - **Copy the config values** (you'll need them next)

3. **Enable Firestore**
   - Left sidebar → "Firestore Database"
   - Click "Create database"
   - Choose "Start in test mode"
   - Select location: `asia-south1 (Mumbai)` for India
   - Click "Enable"

4. **Update Environment Variables**
   - Open `.env` file in your project
   - Replace the dummy values with your Firebase config:
   ```env
   VITE_FIREBASE_API_KEY=your-api-key-here
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
   ```

5. **Set Security Rules**
   - In Firestore → "Rules" tab
   - Copy-paste these rules:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /quotes/{quoteId} {
         allow create: if request.resource.data.keys().hasAll(['name', 'phone', 'requirement'])
                       && request.resource.data.name is string
                       && request.resource.data.phone is string
                       && request.resource.data.requirement is string;
         allow read, update, delete: if false;
       }
     }
   }
   ```
   - Click "Publish"

6. **Restart Server**
   ```bash
   # Stop server (Ctrl+C), then:
   npm run dev
   ```

7. **Test It!**
   - Click "Get Quote" button
   - Fill form and submit
   - Check Firebase Console → Firestore → quotes collection
   - You should see your submission! 🎉

---

## 📖 Need More Details?

See `FIREBASE_SETUP.md` for:
- Detailed step-by-step instructions with screenshots
- Security best practices
- Email notification setup
- Admin dashboard setup
- Troubleshooting guide
- And much more!

---

## ✅ Quick Checklist

- [ ] Created Firebase project
- [ ] Added web app
- [ ] Enabled Firestore
- [ ] Updated `.env` file
- [ ] Published security rules
- [ ] Restarted dev server
- [ ] Tested quote submission

---

## 🆘 Having Issues?

### Error: "Permission denied"
→ Check that you published the security rules (Step 5)

### Error: Config values are "undefined"
→ Make sure all variables start with `VITE_`
→ Restart dev server after updating `.env`

### Quotes not showing in Firebase
→ Check browser console for errors
→ Verify project ID matches between `.env` and Firebase Console

---

## 🎯 What's Next?

After Firebase is set up, your website will automatically:
- ✅ Save all quote requests to Firebase
- ✅ Display success animation to users
- ✅ Show error messages if submission fails
- ✅ Include product context in submissions
- ✅ Track submission metadata (timestamp, referrer, etc.)

---

**Estimated Time:** 5-10 minutes
**Difficulty:** Easy 😊
**Cost:** Free (Firebase Spark Plan)

---

For detailed instructions, see: **`FIREBASE_SETUP.md`**
