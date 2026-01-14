import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { requests } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
     const isLoggedIn = cookieStore.get('admin_logged_in')?.value;

    if (isLoggedIn !== 'true') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all requests - optimizing by selecting only needed fields for analytics
    const allRequests = await db
      .select({
        id: requests.id,
        type: requests.type,
        status: requests.status,
        createdAt: requests.createdAt,
      })
      .from(requests)
      .orderBy(desc(requests.createdAt));

    return NextResponse.json({ requests: allRequests });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
