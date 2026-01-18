import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { requests, users } from '@/db/schema';
import { eq, asc, desc } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
     const cookieStore = await cookies();
    if (cookieStore.get('admin_logged_in')?.value !== 'true') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch requests sorted by user name
    const archiveData = await db
      .select({
        id: requests.id,
        type: requests.type,
        description: requests.description,
        status: requests.status,
        createdAt: requests.createdAt,
        userFullName: users.fullName,
        userEmail: users.email
      })
      .from(requests)
      .leftJoin(users, eq(requests.userId, users.id))
      .orderBy(asc(users.fullName), desc(requests.createdAt)); // Sort by Name, then Date

    return NextResponse.json({ requests: archiveData });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching archive' }, { status: 500 });
  }
}
