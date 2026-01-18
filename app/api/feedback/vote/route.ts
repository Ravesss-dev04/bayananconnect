import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { feedback, feedbackVotes, users } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('user_data');
    if (!userCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = JSON.parse(userCookie.value).userId;
    const body = await req.json();
    const { feedbackId, type } = body;

    if (!['like', 'dislike'].includes(type) || !feedbackId) {
        return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // Check existing vote
    const existingVote = await db.select().from(feedbackVotes).where(
        and(
            eq(feedbackVotes.feedbackId, feedbackId),
            eq(feedbackVotes.userId, userId)
        )
    );

    if (existingVote.length > 0) {
        if (existingVote[0].type === type) {
            // Remove vote if same type (toggle)
            await db.delete(feedbackVotes).where(eq(feedbackVotes.id, existingVote[0].id));
            return NextResponse.json({ status: 'removed' });
        } else {
            // Update vote if different
            await db.update(feedbackVotes)
                .set({ type: type })
                .where(eq(feedbackVotes.id, existingVote[0].id));
            return NextResponse.json({ status: 'updated' });
        }
    } else {
        // Insert new vote
        await db.insert(feedbackVotes).values({
            feedbackId,
            userId,
            type
        });
        return NextResponse.json({ status: 'added' });
    }
  } catch (error) {
    console.error('Error voting on feedback:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
