import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Email from '@/lib/models/email.model';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder') || 'inbox';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    // Build query
    const query: any = { folder };

    // Fetch emails with pagination
    const emails = await Email.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Email.countDocuments(query);

    return NextResponse.json({
      success: true,
      emails,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching emails:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch emails' },
      { status: 500 }
    );
  }
}
