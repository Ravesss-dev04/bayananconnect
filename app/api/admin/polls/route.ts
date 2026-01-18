import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { polls, pollVotes } from '@/db/schema';
import { desc, eq, sql } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const isLoggedIn = cookieStore.get('admin_logged_in')?.value;
    if (isLoggedIn !== 'true') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const allPolls = await db
      .select()
      .from(polls)
      .orderBy(desc(polls.createdAt));

    // Get detailed results for each poll
    const pollsWithData = await Promise.all(allPolls.map(async (poll) => {
        const votes = await db
            .select({
                optionIndex: pollVotes.optionIndex,
                count: sql<number>`count(*)`
            })
            .from(pollVotes)
            .where(eq(pollVotes.pollId, poll.id))
            .groupBy(pollVotes.optionIndex);
            
        const results = poll.options.map((opt, index) => {
            const found = votes.find(v => v.optionIndex === String(index));
            return found ? Number(found.count) : 0;
        });

        const totalVotes = results.reduce((a, b) => a + b, 0);

        return {
            ...poll,
            results,
            totalVotes
        };
    }));

    return NextResponse.json({ polls: pollsWithData });
  } catch (error) {
    console.error('Error fetching admin polls:', error);
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
        const { question, options, dueDate } = body;

        if (!question || !options || !Array.isArray(options) || options.length < 2) {
            return NextResponse.json({ error: 'Invalid poll data' }, { status: 400 });
        }

        const newPoll = await db.insert(polls).values({
            question,
            options,
            dueDate: dueDate ? new Date(dueDate) : null,
            isActive: true
        }).returning();

        return NextResponse.json({ success: true, poll: newPoll[0] });

    } catch (error) {
        console.error('Error creating poll:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
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

        // Delete votes first (foreign key)
        await db.delete(pollVotes).where(eq(pollVotes.pollId, id));
        // Delete poll
        await db.delete(polls).where(eq(polls.id, id));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting poll:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}