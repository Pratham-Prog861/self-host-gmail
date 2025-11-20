import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Email from '@/lib/models/email.model';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const email = await Email.findById(id);

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, email });
  } catch (error) {
    console.error('Error fetching email:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch email' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const email = await Email.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    );

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, email });
  } catch (error) {
    console.error('Error updating email:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update email' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const email = await Email.findByIdAndDelete(id);

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Email deleted' });
  } catch (error) {
    console.error('Error deleting email:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete email' },
      { status: 500 }
    );
  }
}
