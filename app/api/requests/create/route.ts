import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { requests } from '@/db/schema';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('user_data');

    if (!userCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = JSON.parse(userCookie.value);
    const body = await req.json();
    const { type, description, latitude, longitude, imageUrl } = body;

    // Validate inputs
    if (!type || !description) {
      return NextResponse.json({ error: 'Type and description are required' }, { status: 400 });
    }

    // Ensure we have a valid userId
    if (!user.userId) {
       console.error("User ID missing from session cookie:", user);
       return NextResponse.json({ error: 'User session invalid' }, { status: 401 });
    }

    const newRequest = await db.insert(requests).values({
      userId: user.userId,
      type, 
      description,
      latitude: String(latitude),
      longitude: String(longitude),
      imageUrl: imageUrl || null,
      status: 'Pending'
    }).returning();

    return NextResponse.json({ success: true, request: newRequest[0] });

  } catch (error) {
    console.error('Error creating request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
