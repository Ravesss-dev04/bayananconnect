import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { notifications, systemSettings } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('user_data');
    if (!userCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = JSON.parse(userCookie.value).userId;

    // Check system settings for public alerts
    const settings = await db.select().from(systemSettings).limit(1);
    const publicAlertsEnabled = settings.length > 0 ? settings[0].publicAlertsEnabled : false; 
    // Default to false if no settings found, or true? Usually default true for notifications might be better, 
    // but the prompt says "when you turn it off... notifications will stop", implies explicit control.
    // If table is empty, we should probably assume enabled or disabled? 
    // In my settings route I defaulted to creating one if missing.
    // Let's assume if the row exists we use it. If not, maybe default to true?
    // However, the prompt says "enable/disable". Let's stick to the DB value.
    
    if (!publicAlertsEnabled) {
       return NextResponse.json({ notifications: [] });
    }

    const notifs = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(20);

    return NextResponse.json({ notifications: notifs });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
    try {
        const cookieStore = await cookies();
    const userCookie = cookieStore.get('user_data');
    if (!userCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = JSON.parse(userCookie.value).userId;

    const body = await req.json();
    const { id } = body;

    // Mark specific notification as read
    if (id) {
        await db.update(notifications)
            .set({ isRead: true })
            .where(eq(notifications.id, id));
    } else {
        // Mark all as read for user
        await db.update(notifications)
            .set({ isRead: true })
            .where(eq(notifications.userId, userId));
    }

    return NextResponse.json({ success: true });

    } catch (e) {
        return NextResponse.json({ error: 'Error updating notifications' }, { status: 500 });
    }
}
