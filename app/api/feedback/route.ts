import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { feedback, users, feedbackVotes } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('user_data');
    let currentUserId = null;
    if (userCookie) {
        try {
            currentUserId = JSON.parse(userCookie.value).userId;
        } catch (e) {}
    }

    const allFeedback = await db
      .select({
        id: feedback.id,
        content: feedback.content,
        rating: feedback.rating,
        createdAt: feedback.createdAt,
        userFullName: users.fullName,
        adminResponse: feedback.adminResponse,
      })
      .from(feedback)
      .leftJoin(users, eq(feedback.userId, users.id))
      .where(eq(feedback.isPublic, true))
      .orderBy(desc(feedback.createdAt));

    const enhancedFeedback = await Promise.all(allFeedback.map(async (item) => {
        const votes = await db.select().from(feedbackVotes).where(eq(feedbackVotes.feedbackId, item.id));
        const likes = votes.filter(v => v.type === 'like').length;
        const dislikes = votes.filter(v => v.type === 'dislike').length;
        const userVote = currentUserId ? votes.find(v => v.userId === currentUserId)?.type || null : null;
        
        return { ...item, likes, dislikes, userVote };
    }));

    return NextResponse.json({ feedback: enhancedFeedback });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('user_data');
    if (!userCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = JSON.parse(userCookie.value);

    const body = await req.json();
    const { content, rating } = body;

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const newFeedback = await db.insert(feedback).values({
      userId: user.userId,
      content,
      rating: rating || null,
      isPublic: true,
    }).returning();

    return NextResponse.json({ success: true, feedback: newFeedback[0] });

  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
