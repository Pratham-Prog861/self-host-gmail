# Fix: Google OAuth "Access Blocked" Error

## Problem

You're seeing: **"Access blocked: Cloud-Sharing-Platform has not completed the Google verification process"**

This happens because your OAuth app is in **Testing mode** and you haven't added yourself as a test user.

## Quick Fix (2 Steps)

### Step 1: Add Yourself as Test User

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to **"APIs & Services"** → **"OAuth consent screen"**
4. Scroll down to **"Test users"** section
5. Click **"+ ADD USERS"**
6. Enter your email: `pratham8355@gmail.com`
7. Click **"Save"**

### Step 2: Try Logging In Again

1. Go back to your app: `http://localhost:3000`
2. Click **"Get Started"** → **"Continue with Google"**
3. You should now be able to login!

---

## Alternative: Publish Your App (For Production)

If you want anyone to use your app (not just test users):

1. Go to **"OAuth consent screen"**
2. Click **"PUBLISH APP"**
3. Click **"Confirm"**

**Note**: For Gmail API scopes, Google may require app verification (can take days/weeks). For testing, just add yourself as a test user (Step 1 above).

## After Adding Test User

You'll see a warning screen saying:

> "Google hasn't verified this app"

Click **"Continue"** (it's safe, it's your own app!)

Then you'll see the Gmail permissions screen - click **"Allow"**

---

**That's it!** Once you add yourself as a test user, you'll be able to login and use the app.
