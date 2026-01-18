import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { feedback, users } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const isLoggedIn = cookieStore.get('admin_logged_in')?.value;
    if (isLoggedIn !== 'true') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const allFeedback = await db
      .select({
        id: feedback.id,
        content: feedback.content,
        rating: feedback.rating,
        createdAt: feedback.createdAt,
        userFullName: users.fullName,
        userEmail: users.email,
        adminResponse: feedback.adminResponse
      })
      .from(feedback)
      .leftJoin(users, eq(feedback.userId, users.id))
      .orderBy(desc(feedback.createdAt));

    return NextResponse.json({ feedback: allFeedback });
  } catch (error) {
    console.error('Error fetching admin feedback:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const isLoggedIn = cookieStore.get('admin_logged_in')?.value;
        if (isLoggedIn !== 'true') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const body = await req.json();
        const { id, response } = body;
        await db.update(feedback)
            .set({ adminResponse: response })
            .where(eq(feedback.id, id));
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: 'Error updating feedback' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const isLoggedIn = cookieStore.get('admin_logged_in')?.value;
        if (isLoggedIn !== 'true') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        await db.delete(feedback).where(eq(feedback.id, id));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting feedback:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}