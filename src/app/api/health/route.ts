import { NextResponse } from 'next/server';

export async function GET() {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: {
      MONGODB_URI: process.env.MONGODB_URI ? '✅ Set' : '❌ Missing',
      GMAIL_USER: process.env.GMAIL_USER ? '✅ Set' : '❌ Missing',
      GMAIL_APP_PASSWORD: process.env.GMAIL_APP_PASSWORD ? '✅ Set' : '❌ Missing',
      IMAP_HOST: process.env.IMAP_HOST || 'imap.gmail.com',
      SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
    },
    mongodb: {
      uri: process.env.MONGODB_URI || 'Not configured',
      status: 'Unknown - try connecting',
    },
  };

  // Try to connect to MongoDB
  try {
    const connectDB = (await import('@/lib/mongoose')).default;
    await connectDB();
    diagnostics.mongodb.status = '✅ Connected';
  } catch (error: any) {
    diagnostics.mongodb.status = `❌ Failed: ${error.message}`;
  }

  return NextResponse.json(diagnostics);
}
