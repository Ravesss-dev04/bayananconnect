import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { requests } from '@/db/schema';
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

    const updated = await db
      .update(requests)
      .set({ status, updatedAt: new Date() })
      .where(eq(requests.id, id))
      .returning();

    return NextResponse.json({ success: true, request: updated[0] });

  } catch (error) {
    console.error('Error updating request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
