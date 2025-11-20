import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Email from '@/lib/models/email.model';
import imapService from '@/lib/services/imap';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Fetch emails from Gmail IMAP
    const emails = await imapService.fetchEmails('INBOX', 50);

    // Save emails to MongoDB
    const savedEmails = [];
    for (const email of emails) {
      try {
        // Check if email already exists
        const existingEmail = email.messageId
          ? await Email.findOne({ messageId: email.messageId })
          : null;

        if (!existingEmail) {
          const newEmail = await Email.create({
            messageId: email.messageId,
            from: email.from,
            to: email.to,
            subject: email.subject,
            body: email.body,
            htmlBody: email.htmlBody,
            folder: 'inbox',
            hasAttachments: email.hasAttachments,
            createdAt: email.date,
          });
          savedEmails.push(newEmail);
        }
      } catch (error) {
        console.error('Error saving email:', error);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Synced ${savedEmails.length} new emails`,
      count: savedEmails.length,
    });
  } catch (error) {
    console.error('Error syncing emails:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to sync emails' },
      { status: 500 }
    );
  }
}
