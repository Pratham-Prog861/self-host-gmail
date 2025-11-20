import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Email from '@/lib/models/email.model';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get folder counts
    const folders = [
      { name: 'inbox', label: 'Inbox' },
      { name: 'sent', label: 'Sent' },
      { name: 'drafts', label: 'Drafts' },
      { name: 'starred', label: 'Starred' },
    ];

    const folderCounts = await Promise.all(
      folders.map(async (folder) => {
        const count =
          folder.name === 'starred'
            ? await Email.countDocuments({ isStarred: true })
            : await Email.countDocuments({ folder: folder.name });

        return {
          name: folder.name,
          label: folder.label,
          count,
        };
      })
    );

    return NextResponse.json({
      success: true,
      folders: folderCounts,
    });
  } catch (error) {
    console.error('Error fetching folders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch folders' },
      { status: 500 }
    );
  }
}
