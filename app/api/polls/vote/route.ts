import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { polls, pollVotes } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('user_data');
    
    if (!userCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userData = JSON.parse(userCookie.value);
    const userId = userData.userId;

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { pollId, optionIndex } = body;

    if (!pollId || optionIndex === undefined || optionIndex === null) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // 1. Check if poll exists and is active
    const poll = await db.select().from(polls).where(eq(polls.id, pollId));
    
    if (poll.length === 0) {
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
    }

    if (!poll[0].isActive) {
        return NextResponse.json({ error: 'Poll is inactive' }, { status: 400 });
    }

    // 2. Check if user already voted
    const existingVote = await db.select().from(pollVotes).where(
        and(
            eq(pollVotes.pollId, pollId),
            eq(pollVotes.userId, userId)
        )
    );

    if (existingVote.length > 0) {
        return NextResponse.json({ error: 'You have already voted on this poll' }, { status: 409 });
    }
 // 3. Insert vote
    await db.insert(pollVotes).values({
        pollId: pollId,
        userId: userId,
        optionIndex: String(optionIndex)
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error voting:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}





