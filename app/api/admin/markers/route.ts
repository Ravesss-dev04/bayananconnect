import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { mapMarkers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
    const data = await db.select().from(mapMarkers);
    return NextResponse.json({ markers: data });
  } catch (error) {
    console.error("Error fetching map markers", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const isLoggedIn = cookieStore.get('admin_logged_in')?.value;
    if (isLoggedIn !== 'true') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { type, title, description, latitude, longitude } = body;

    if (!title || !latitude || !longitude) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newMarker = await db.insert(mapMarkers).values({
        type: type || 'custom',
        title,
        description: description || '',
        latitude: String(latitude),
        longitude: String(longitude)
    }).returning();

    return NextResponse.json({ marker: newMarker[0] });
  } catch (error) {
    console.error("Error creating marker", error);
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

        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        await db.delete(mapMarkers).where(eq(mapMarkers.id, id));
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting marker", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
