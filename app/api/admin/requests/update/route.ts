import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { requests, notifications } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const isLoggedIn = cookieStore.get('admin_logged_in')?.value;

    if (isLoggedIn !== 'true') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
    }

    // 1. Get the request first to find the userId
    const existingRequest = await db.select().from(requests).where(eq(requests.id, id));
    
    if (existingRequest.length === 0) {
        return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    const reqData = existingRequest[0];

    // 2. Update the status
    const updated = await db
      .update(requests)
      .set({ status, updatedAt: new Date() })
      .where(eq(requests.id, id))
      .returning();

    // 3. Create Notification
    await db.insert(notifications).values({
        userId: reqData.userId,
        title: 'Request Update',
        message: `Your request regarding "${reqData.type}" has been updated to: ${status}`,
        type: status === 'Completed' || status === 'Resolved' ? 'success' : 'info'
    });

    return NextResponse.json({ success: true, request: updated[0] });

  } catch (error) {
    console.error('Error updating request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
