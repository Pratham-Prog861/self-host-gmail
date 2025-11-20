# 📧 Self-Hosted Gmail Email Client

A modern, full-featured email client built with Next.js 15 that connects to your Gmail account via IMAP/SMTP. Store and manage your emails locally with MongoDB while maintaining full Gmail integration.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Local-green?style=flat-square&logo=mongodb)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

## ✨ Features

- 📥 **Fetch emails from Gmail** via IMAP (FREE - no API costs)
- 📤 **Send emails through Gmail** via SMTP (FREE - no API costs)
- 💾 **Local MongoDB storage** for offline access and privacy
- 🎨 **Modern Gmail-like UI** with responsive design
- ⭐ **Email management**: Star, read/unread, delete
- 📁 **Folder organization**: Inbox, Sent, Drafts, Starred
- 🔍 **Search functionality** (coming soon)
- 📱 **Responsive design** works on desktop and mobile
- 🎯 **TypeScript** for type safety
- 🎨 **Tailwind CSS** + **shadcn/ui** for beautiful components

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **MongoDB** running locally on `localhost:27017`
- **Gmail account** with 2-Factor Authentication enabled

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

   Choose one option:

   **Option A: MongoDB Community Edition**

   - Download from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
   - Install and start the MongoDB service

   **Option B: MongoDB Compass** (Recommended for beginners)

   - Download from [mongodb.com/try/download/compass](https://www.mongodb.com/try/download/compass)
   - Install and start a local MongoDB instance

4. **Generate Gmail App Password**

   > ⚠️ **Important**: You need an App Password, not your regular Gmail password

   - Enable 2FA: [myaccount.google.com/security](https://myaccount.google.com/security)
   - Generate App Password: [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and "Windows Computer" (or your OS)
   - Copy the 16-character password (remove spaces)

5. **Configure environment variables**

   Create/update `.env` file:

   ```env
   MONGODB_URI="mongodb://localhost:27017/emaildb"

   GMAIL_USER="your-email@gmail.com"
   GMAIL_APP_PASSWORD="your16charapppassword"
   IMAP_HOST="imap.gmail.com"
   IMAP_PORT=993
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT=587

   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

6. **Start the development server**

   ```bash
   npm run dev
   ```

7. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### Syncing Emails

1. Click the **"Sync"** button in the header
2. Emails will be fetched from Gmail IMAP and stored in MongoDB
3. You'll see a notification showing how many emails were synced

### Reading Emails

1. Select a folder from the sidebar (Inbox, Sent, Drafts, Starred)
2. Click on any email in the list to view it
3. Email will be automatically marked as read

### Composing Emails

1. Click the **"Compose"** button in the sidebar
2. Fill in recipient, subject, and message
3. Click **"Send"**
4. Email will be sent via Gmail SMTP and saved to your Sent folder

### Managing Emails

- **Star/Unstar**: Click the star icon on any email
- **Delete**: Open email detail view and click the trash icon
- **Mark as Read**: Automatically marked when opened

## 🏗️ Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Beautiful UI components
- **Lucide Icons** - Icon library

### Backend

- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - Local database storage
- **Mongoose** - MongoDB ODM with TypeScript support

### Email Services

- **ImapFlow** - IMAP client for receiving emails
- **Nodemailer** - SMTP client for sending emails
- **mailparser** - Email parsing library

## 📁 Project Structure

```bash
self-host-gmail/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── emails/
│   │   │   │   ├── [id]/route.ts      # Single email CRUD
│   │   │   │   ├── send/route.ts      # Send email
│   │   │   │   ├── sync/route.ts      # Sync from Gmail
│   │   │   │   └── route.ts           # List emails
│   │   │   ├── folders/route.ts       # Folder counts
│   │   │   └── health/route.ts        # Health check
│   │   ├── layout.tsx                 # Root layout
│   │   └── page.tsx                   # Main email client
│   ├── components/
│   │   ├── ui/                        # shadcn/ui components
│   │   ├── compose-email.tsx          # Email composer
│   │   ├── email-detail.tsx           # Email viewer
│   │   ├── email-list.tsx             # Email list
│   │   ├── header.tsx                 # App header
│   │   └── sidebar.tsx                # Navigation sidebar
│   └── lib/
│       ├── models/
│       │   ├── email.model.ts         # Email schema
│       │   └── folder.model.ts        # Folder schema
│       ├── services/
│       │   ├── imap.ts                # IMAP service
│       │   └── smtp.ts                # SMTP service
│       ├── mongoose.ts                # MongoDB connection
│       └── utils.ts                   # Utility functions
├── .env                               # Environment variables
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

- `emails` - All synced and sent emails
- `folders` - Folder metadata and counts

### Gmail IMAP/SMTP

**IMAP Settings** (Receiving emails):

- Host: `imap.gmail.com`
- Port: `993`
- Security: SSL/TLS

**SMTP Settings** (Sending emails):

- Host: `smtp.gmail.com`
- Port: `587`
- Security: STARTTLS

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

### Health Check

Visit [http://localhost:3000/api/health](http://localhost:3000/api/health) to check:

- Environment variable configuration
- MongoDB connection status

## 🐛 Troubleshooting

### MongoDB Connection Failed

**Error**: `Can't reach database server`

**Solution**:

- Ensure MongoDB is running on `localhost:27017`
- Check MongoDB Compass connection
- Verify `MONGODB_URI` in `.env`

### Gmail Authentication Failed

**Error**: `Application-specific password required`

**Solution**:

- You must use a Gmail App Password, not your regular password
- Enable 2FA on your Google account first
- Generate App Password at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
- Copy the 16-character password (remove spaces)

### IMAP Connection Issues

**Error**: `Can't reach IMAP server`

**Solution**:

- Verify `GMAIL_USER` and `GMAIL_APP_PASSWORD` in `.env`
- Check that IMAP is enabled in Gmail settings
- Ensure firewall allows outbound connections on port 993

### SMTP Send Failures

**Error**: `Invalid login` or `Authentication failed`

**Solution**:

- Double-check your App Password (16 characters, no spaces)
- Verify SMTP settings in `.env`
- Ensure "Less secure app access" is NOT needed (App Passwords bypass this)

## 🔐 Security & Privacy

- ✅ **Local storage**: All emails stored on your machine
- ✅ **No third-party services**: Direct Gmail connection only
- ✅ **App Passwords**: More secure than regular passwords
- ✅ **Environment variables**: Credentials never committed to git
- ⚠️ **`.env` is gitignored**: Never commit your `.env` file

## 📊 Database Schema

### Email Model

```typescript
{
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

### Folder Model

```typescript
{
  name: String (unique),
  count: Number,
  createdAt: Date
}
```

## 🚀 Deployment

### Local Production Build

```bash
npm run build
npm start
```

### Environment Variables for Production

Ensure all environment variables are set in your production environment.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [MongoDB](https://www.mongodb.com/) - Database
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [ImapFlow](https://github.com/postalsys/imapflow) - IMAP client
- [Nodemailer](https://nodemailer.com/) - SMTP client

---

**Built with ❤️ using Next.js 15, MongoDB, and Gmail**
