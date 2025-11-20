import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import connectDB from '@/lib/mongoose';
import Email from '@/lib/models/email.model';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    await connectDB();

    const email = await Email.findOne({
      _id: id,
      userId: session.user.email,
    }).lean();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, email });
  } catch (error: any) {
    console.error('Error fetching email:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch email' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    await connectDB();

    const email = await Email.findOneAndUpdate(
      { _id: id, userId: session.user.email },
      body,
      { new: true }
    );

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, email });
  } catch (error: any) {
    console.error('Error updating email:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update email' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    await connectDB();

    const email = await Email.findOneAndDelete({
      _id: id,
      userId: session.user.email,
    });

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Email deleted' });
  } catch (error: any) {
    console.error('Error deleting email:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete email' },
      { status: 500 }
    );
  }
}
