import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import connectDB from '@/lib/mongoose';
import Email from '@/lib/models/email.model';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder') || 'inbox';
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = parseInt(searchParams.get('skip') || '0');

    await connectDB();

    const query: any = {
      userId: session.user.email,
      folder,
    };

    const emails = await Email.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await Email.countDocuments(query);

    return NextResponse.json({
      success: true,
      emails,
      total,
      hasMore: skip + limit < total,
    });
  } catch (error: any) {
    console.error('Error fetching emails:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch emails' },
      { status: 500 }
    );
  }
}
