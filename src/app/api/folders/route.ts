import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import connectDB from '@/lib/mongoose';
import Email from '@/lib/models/email.model';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const userId = session.user.email;

    const folders = [
      {
        name: 'inbox',
        label: 'Inbox',
        count: await Email.countDocuments({ userId, folder: 'inbox' }),
      },
      {
        name: 'sent',
        label: 'Sent',
        count: await Email.countDocuments({ userId, folder: 'sent' }),
      },
      {
        name: 'drafts',
        label: 'Drafts',
        count: await Email.countDocuments({ userId, folder: 'drafts' }),
      },
      {
        name: 'starred',
        label: 'Starred',
        count: await Email.countDocuments({ userId, isStarred: true }),
      },
    ];

    return NextResponse.json({ success: true, folders });
  } catch (error: any) {
    console.error('Error fetching folders:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch folders' },
      { status: 500 }
    );
  }
}
