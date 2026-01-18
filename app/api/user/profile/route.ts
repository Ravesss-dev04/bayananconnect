import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const userCookie = cookieStore.get('user_data');

        if (!userCookie) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const sessionUser = JSON.parse(userCookie.value);
        
        const user = await db.select().from(users).where(eq(users.id, sessionUser.userId));

        if (user.length === 0) {
             return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        
        // Don't send password
        const { password, ...safeUser } = user[0];

        return NextResponse.json({ user: safeUser });

    } catch (error) {
        console.error('Error fetching profile:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const userCookie = cookieStore.get('user_data');

        if (!userCookie) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const sessionUser = JSON.parse(userCookie.value);
        const { fullName, profileImageUrl } = await req.json();

        if (!fullName) {
             return NextResponse.json({ error: 'Full name is required' }, { status: 400 });
        }

        await db.update(users)
            .set({ 
                fullName: fullName,
                profileImageUrl: profileImageUrl, // Can be null or a string
                updatedAt: new Date()
            })
            .where(eq(users.id, sessionUser.userId));

        // Return updated user
        const updatedUserRaw = await db.select().from(users).where(eq(users.id, sessionUser.userId));
        const { password, ...updatedUser } = updatedUserRaw[0];

        // We might want to update the cookie too, but for now let's just update DB. 
        // The cookie stores minimal info usually.

        return NextResponse.json({ user: updatedUser, message: 'Profile updated successfully' });

    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
