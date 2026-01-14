import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { requests } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('user_data');

    if (!userCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessionUser = JSON.parse(userCookie.value);
    
    // Ensure we have a valid userId
    if (!sessionUser.userId) {
       return NextResponse.json({ error: 'User session invalid' }, { status: 401 });
    }

    const userRequests = await db
      .select()
      .from(requests)
      .where(eq(requests.userId, sessionUser.userId))
      .orderBy(desc(requests.createdAt));

    return NextResponse.json({ requests: userRequests });

  } catch (error) {
    console.error('Error fetching requests:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
