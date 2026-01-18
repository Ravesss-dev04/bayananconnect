import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { polls, pollVotes, users } from '@/db/schema';
import { desc, eq, sql } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('user_data');
    let userId = null;
    if (userCookie) {
        userId = JSON.parse(userCookie.value).userId;
    }

    const activePolls = await db
      .select()
      .from(polls)
      .where(eq(polls.isActive, true))
      .orderBy(desc(polls.createdAt));
      
    // For each poll, get vote counts and if current user voted
    const pollsWithData = await Promise.all(activePolls.map(async (poll) => {
        // Get vote counts per option

        const votes = await db
            .select({
                optionIndex: pollVotes.optionIndex,
                count: sql<number>`count(*)`
            })
            .from(pollVotes)
            .where(eq(pollVotes.pollId, poll.id))
            .groupBy(pollVotes.optionIndex);
            
        // Map counts to options
        const results = poll.options.map((opt, index) => {
            const found = votes.find(v => v.optionIndex === String(index));
            return found ? Number(found.count) : 0;
        });

        // Check if user voted
        let userVotedOption = null;
        if (userId) {
            const existingVote = await db.select().from(pollVotes).where(
                sql`${pollVotes.pollId} = ${poll.id} AND ${pollVotes.userId} = ${userId}`
            );
            if (existingVote.length > 0) {
                userVotedOption = Number(existingVote[0].optionIndex);
            }
        }

        return {
            ...poll,
            results,
            userVotedOption
        };
    }));

    return NextResponse.json({ polls: pollsWithData });
  } catch (error) {
    console.error('Error fetching polls:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
    // Vote on a poll
    try {
        const cookieStore = await cookies();
        const userCookie = cookieStore.get('user_data');
        if (!userCookie) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const user = JSON.parse(userCookie.value);
        const { pollId, optionIndex } = await req.json();

        // Check availability
        const poll = await db.select().from(polls).where(eq(polls.id, pollId));
        if (!poll.length || !poll[0].isActive) {
            return NextResponse.json({ error: 'Poll not active' }, { status: 400 });
        }

        // Check already voted
        const existingVote = await db.select().from(pollVotes).where(
            sql`${pollVotes.pollId} = ${pollId} AND ${pollVotes.userId} = ${user.userId}`
        );
        
        if (existingVote.length > 0) {
            return NextResponse.json({ error: 'Already voted' }, { status: 400 });
        }

        await db.insert(pollVotes).values({
            pollId,
            userId: user.userId,
            optionIndex: String(optionIndex)
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Vote error:", error);
         return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
