import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { users } from '@/db/schema';
import { count } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const isLoggedIn = cookieStore.get('admin_logged_in')?.value;

    if (isLoggedIn !== 'true') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get total users count
    // Using simple array length fetch if count() gives trouble or simply:
    // const [result] = await db.select({ count: count() }).from(users);
    
    // Fallback/Simple method guaranteed to work with Drizzle versions:
    const allUsers = await db.select({ id: users.id }).from(users);
    const totalUsers = allUsers.length;

    return NextResponse.json({ totalUsers });

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
