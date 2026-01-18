import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { systemSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
    const settings = await db.select().from(systemSettings).limit(1);
    
    // If no settings exist, create default
    if (settings.length === 0) {
        const newSettings = await db.insert(systemSettings).values({
            publicAlertsEnabled: false
        }).returning();
        return NextResponse.json({ settings: newSettings[0] });
    }

    return NextResponse.json({ settings: settings[0] });
  } catch (error) {
    console.error('Error fetching settings:', error);
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
    const { publicAlertsEnabled } = body;

    // Update the single settings row
    // We assume there's always one row due to the GET logic, but let's be safe
    const existing = await db.select().from(systemSettings).limit(1);

    if (existing.length === 0) {
        await db.insert(systemSettings).values({ publicAlertsEnabled });
    } else {
        await db.update(systemSettings)
            .set({ publicAlertsEnabled, updatedAt: new Date() })
            .where(eq(systemSettings.id, existing[0].id));
    }

    return NextResponse.json({ success: true, publicAlertsEnabled });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
