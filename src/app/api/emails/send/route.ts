import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import connectDB from '@/lib/mongoose';
import Email from '@/lib/models/email.model';
import { GmailService } from '@/lib/services/gmail-api';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.accessToken || !session.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (session.error === 'RefreshAccessTokenError') {
      return NextResponse.json(
        { success: false, error: 'Token refresh failed. Please sign in again.' },
        { status: 401 }
      );
    }

    const { to, subject, text, html } = await request.json();

    if (!to || !subject) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectDB();

    const gmailService = new GmailService(session.accessToken);
    const messageId = await gmailService.sendMessage(to, subject, text, html);

    // Save to sent folder
    await Email.create({
      userId: session.user.email,
      messageId,
      from: session.user.email,
      to,
      subject,
      body: text,
      htmlBody: html,
      folder: 'sent',
      isRead: true,
      isStarred: false,
      hasAttachments: false,
    });

    return NextResponse.json({
      success: true,
      messageId,
      message: 'Email sent successfully',
    });
  } catch (error: any) {
    console.error('❌ Error sending email:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to send email' },
      { status: 500 }
    );
  }
}
