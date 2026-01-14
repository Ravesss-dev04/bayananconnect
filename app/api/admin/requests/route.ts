import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { requests, users } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const isLoggedIn = cookieStore.get('admin_logged_in')?.value;

    if (isLoggedIn !== 'true') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const allRequests = await db
      .select({
        id: requests.id,
        type: requests.type,
        description: requests.description,
        status: requests.status,
        latitude: requests.latitude,
        longitude: requests.longitude,
        imageUrl: requests.imageUrl,
        createdAt: requests.createdAt,
        userFullName: users.fullName,
        userEmail: users.email,
        userAddress: users.address,
      })
      .from(requests)
      .leftJoin(users, eq(requests.userId, users.id))
      .orderBy(desc(requests.createdAt));

    return NextResponse.json({ requests: allRequests });

  } catch (error) {
    console.error('Error fetching admin requests:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
