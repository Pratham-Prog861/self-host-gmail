import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import connectDB from '@/lib/mongoose';
import Email from '@/lib/models/email.model';
import { GmailService } from '@/lib/services/gmail-api';

export async function POST() {
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

    await connectDB();

    const gmailService = new GmailService(session.accessToken);
    const messageIds = await gmailService.listMessages(50);

    let newEmailsCount = 0;

    for (const messageId of messageIds) {
      // Check if email already exists for this user
      const existingEmail = await Email.findOne({
        userId: session.user.email,
        messageId,
      });

      if (existingEmail) {
        continue;
      }

      const emailData = await gmailService.getMessage(messageId);

      await Email.create({
        userId: session.user.email,
        messageId: emailData.messageId,
        from: emailData.from,
        to: emailData.to,
        subject: emailData.subject,
        body: emailData.body,
        htmlBody: emailData.htmlBody,
        folder: 'inbox',
        isRead: false,
        isStarred: false,
        hasAttachments: emailData.hasAttachments,
        createdAt: emailData.date,
      });

      newEmailsCount++;
    }

    return NextResponse.json({
      success: true,
      count: newEmailsCount,
      message: `Synced ${newEmailsCount} new emails`,
    });
  } catch (error: any) {
    console.error('Error syncing emails:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to sync emails' },
      { status: 500 }
    );
  }
}
