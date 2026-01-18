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
        userMobile: users.mobileNumber,
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

export async function DELETE(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const isLoggedIn = cookieStore.get('admin_logged_in')?.value;

        if (isLoggedIn !== 'true') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        await db.delete(requests).where(eq(requests.id, id));

        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: 'Error deleting request' }, { status: 500 });
    }
}
