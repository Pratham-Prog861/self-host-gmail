import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Email from '@/lib/models/email.model';
import smtpService from '@/lib/services/smtp';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { to, subject, text, html } = body;

    if (!to || !subject) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send email via SMTP
    await smtpService.sendEmail({
      to,
      subject,
      text,
      html,
    });

    // Save to database in sent folder
    const email = await Email.create({
      from: process.env.GMAIL_USER || '',
      to,
      subject,
      body: text || '',
      htmlBody: html,
      folder: 'sent',
      isRead: true,
    });

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
      email,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
