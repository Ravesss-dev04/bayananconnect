import { NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { requests } from '@/db/schema';
import { desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Fetch all requests to display on the public map
    // We select specific fields to keep payload light
    const mapData = await db.select({
      id: requests.id,
      type: requests.type,
      latitude: requests.latitude,
      longitude: requests.longitude,
      status: requests.status,
      description: requests.description,
      createdAt: requests.createdAt
    })
    .from(requests)
    .orderBy(desc(requests.createdAt))
    .limit(100); // Limit to last 100 for performance

    return NextResponse.json({ pins: mapData });

  } catch (error) {
    console.error('Error fetching map data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
