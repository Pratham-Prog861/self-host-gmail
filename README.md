# 📧 Self-Hosted Gmail Email Client

A modern, multi-user email client built with Next.js 15 that connects to Gmail via OAuth. Each user accesses their own Gmail account with full privacy and local storage.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Local-green?style=flat-square&logo=mongodb)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

## ✨ Features

- 🔐 **Google OAuth Authentication** - Secure login with your Google account
- 👥 **Multi-User Support** - Each user sees only their own emails
- 📥 **Gmail API Integration** - Fetch emails via OAuth (no App Passwords needed)
- 📤 **Send Emails** - Send emails through Gmail API
- 💾 **Local MongoDB Storage** - Offline access and privacy
- 🎨 **Modern Gmail-like UI** - Full-width email list, individual email pages
- 🔍 **Real-time Search** - Search by sender, subject, or content
- ⭐ **Email Management** - Star, read/unread, delete
- 📁 **Folder Organization** - Inbox, Sent, Drafts, Starred
- 📱 **Responsive Design** - Works on desktop and mobile
- 🎯 **TypeScript** - Full type safety
- 🎨 **Tailwind CSS + shadcn/ui** - Beautiful, modern components

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **MongoDB** running locally on `localhost:27017`
- **Google Cloud Project** with OAuth configured

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/pratham-prog861/self-host-gmail.git
   cd self-host-gmail
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up MongoDB**

   **Option A: MongoDB Community Edition**

   - Download from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
   - Install and start the MongoDB service

   **Option B: MongoDB Compass** (Recommended)

   - Download from [mongodb.com/try/download/compass](https://www.mongodb.com/try/download/compass)
   - Install and start a local MongoDB instance

4. **Configure Google OAuth**

   Follow the detailed guide: [FIX_OAUTH_ERROR.md](./FIX_OAUTH_ERROR.md)

   **Quick Steps:**

   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project
   - Enable Gmail API
   - Configure OAuth consent screen
   - Create OAuth 2.0 credentials
   - Add yourself as a test user
   - Copy Client ID and Client Secret

5. **Configure environment variables**

   Create `.env` file:

   ```env
   # MongoDB
   MONGODB_URI="mongodb://localhost:27017/emaildb"

   # Google OAuth
   GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
   GOOGLE_CLIENT_SECRET="your-client-secret"

   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

   # App URL
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

   **Generate NEXTAUTH_SECRET:**

   ```powershell
   # Windows PowerShell
   [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))

   # Linux/Mac
   openssl rand -base64 32
   ```

6. **Start the development server**

   ```bash
   npm run dev
   ```

7. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### First Time Setup

1. Visit the landing page
2. Click **"Get Started"**
3. Login with your Google account
4. Grant Gmail permissions
5. You'll be redirected to the dashboard

### Syncing Emails

1. Click the **"Sync"** button in the header
2. Emails will be fetched from your Gmail account
3. You'll see a notification showing how many emails were synced

### Reading Emails

1. Select a folder from the sidebar (Inbox, Sent, Drafts, Starred)
2. Click on any email to open it in a new page
3. Email will be automatically marked as read
4. Click **"Back to Inbox"** to return to the list

### Searching Emails

1. Type in the search box in the header
2. Emails are filtered in real-time by:
   - Sender name/email
   - Subject line
   - Email content

### Composing Emails

1. Click the **"Compose"** button in the sidebar
2. Fill in recipient, subject, and message
3. Click **"Send"**
4. Email will be sent via Gmail API and saved to your Sent folder

### Managing Emails

- **Star/Unstar**: Click the star icon on any email
- **Delete**: Open email and click the trash icon
- **Mark as Read**: Automatically marked when opened

## 🏗️ Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Beautiful UI components
- **NextAuth** - Authentication
- **Lucide Icons** - Icon library

### Backend

- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - Local database storage
- **Mongoose** - MongoDB ODM with TypeScript support

### Email Services

- **Gmail API** - OAuth-based email access
- **googleapis** - Google APIs client library
- **mailparser** - Email parsing library

## 📁 Project Structure

```bash
self-host-gmail/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/  # NextAuth endpoints
│   │   │   ├── emails/
│   │   │   │   ├── [id]/route.ts    # Single email CRUD
│   │   │   │   ├── send/route.ts    # Send email
│   │   │   │   ├── sync/route.ts    # Sync from Gmail
│   │   │   │   └── route.ts         # List emails
│   │   │   └── folders/route.ts     # Folder counts
│   │   ├── dashboard/
│   │   │   ├── email/[id]/page.tsx  # Individual email page
│   │   │   └── page.tsx             # Email list page
│   │   ├── login/page.tsx           # Login page
│   │   ├── layout.tsx               # Root layout
│   │   └── page.tsx                 # Landing page
│   ├── components/
│   │   ├── ui/                      # shadcn/ui components
│   │   ├── compose-email.tsx        # Email composer
│   │   ├── email-list.tsx           # Email list
│   │   ├── header.tsx               # App header with search
│   │   ├── sidebar.tsx              # Navigation sidebar
│   │   └── providers.tsx            # Session provider
│   ├── lib/
│   │   ├── models/
│   │   │   └── email.model.ts       # Email schema (with userId)
│   │   ├── services/
│   │   │   └── gmail-api.ts         # Gmail API service
│   │   ├── auth.config.ts           # NextAuth configuration
│   │   ├── mongoose.ts              # MongoDB connection
│   │   └── utils.ts                 # Utility functions
│   └── types/
│       └── next-auth.d.ts           # NextAuth type extensions
├── .env                             # Environment variables
├── FIX_OAUTH_ERROR.md               # OAuth setup guide
├── package.json
└── README.md
```

## 🔧 Configuration

### MongoDB

The application uses MongoDB for local storage. Default connection:

```
mongodb://localhost:27017/emaildb
```

**Collections:**

- `emails` - All synced and sent emails (with userId)

### Gmail API

**OAuth Scopes:**

- `https://www.googleapis.com/auth/gmail.readonly` - Read emails
- `https://www.googleapis.com/auth/gmail.send` - Send emails
- `https://www.googleapis.com/auth/gmail.modify` - Modify emails (mark read, delete)

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## 🐛 Troubleshooting

### OAuth "Access Blocked" Error

**Error**: "Access blocked: Cloud-Sharing-Platform has not completed the Google verification process"

**Solution**: See [FIX_OAUTH_ERROR.md](./FIX_OAUTH_ERROR.md)

Quick fix:

1. Go to Google Cloud Console → OAuth consent screen
2. Scroll to "Test users" section
3. Click "+ ADD USERS"
4. Add your email address
5. Try logging in again

### MongoDB Connection Failed

**Error**: `Can't reach database server`

**Solution**:

- Ensure MongoDB is running on `localhost:27017`
- Check MongoDB Compass connection
- Verify `MONGODB_URI` in `.env`

### Token Refresh Error

**Error**: `Error refreshing access token: invalid_grant`

**Solution**:

- Logout and login again
- This happens when OAuth tokens expire or are revoked
- Re-authenticate to get new tokens

### Missing Sidebar Text

**Solution**: Refresh the page after starting the server

### Search Not Working

**Solution**: Make sure you're logged in and have synced emails

## 🔐 Security & Privacy

- ✅ **OAuth Authentication** - Secure Google login
- ✅ **Per-User Isolation** - Each user sees only their emails
- ✅ **Local Storage** - All emails stored on your machine
- ✅ **No Third-Party Services** - Direct Gmail API connection
- ✅ **Token Refresh** - Automatic OAuth token renewal
- ✅ **Environment Variables** - Credentials never committed to git
- ⚠️ **`.env` is gitignored** - Never commit your `.env` file

## 📊 Database Schema

### Email Model

```typescript
{
  userId: String (user's email),
  messageId: String (unique),
  from: String,
  to: String,
  subject: String,
  body: String,
  htmlBody: String,
  folder: String (inbox/sent/drafts),
  isRead: Boolean,
  isStarred: Boolean,
  hasAttachments: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**

- `{ userId: 1, folder: 1, createdAt: -1 }` - User-specific folder queries
- `{ userId: 1, isStarred: 1 }` - Starred emails

## 🚀 Deployment

### Local Production Build

```bash
npm run build
npm start
```

### Production Environment Variables

Update these for production:

- `NEXTAUTH_URL` - Your production URL
- `NEXT_PUBLIC_APP_URL` - Your public URL
- Add production domain to Google OAuth authorized origins/redirects

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [MongoDB](https://www.mongodb.com/) - Database
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [NextAuth](https://next-auth.js.org/) - Authentication
- [Gmail API](https://developers.google.com/gmail/api) - Email integration

---

**Built with ❤️ using Next.js 15, MongoDB, Gmail API, and OAuth**
