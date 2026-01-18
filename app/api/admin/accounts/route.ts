import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { admins } from '@/db/schema';
import { desc } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
     const cookieStore = await cookies();
    if (cookieStore.get('admin_logged_in')?.value !== 'true') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const allAdmins = await db.select({
        id: admins.id,
        email: admins.email,
        createdAt: admins.createdAt
    }).from(admins).orderBy(desc(admins.createdAt));

    return NextResponse.json({ admins: allAdmins });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching admins' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get('admin_logged_in')?.value !== 'true') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email, password } = await req.json();

    if (!email || !password) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newId = `admin-${Date.now()}`; // Simple ID generation

    await db.insert(admins).values({
        id: newId,
        email,
        password: hashedPassword
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error creating admin' }, { status: 500 });
  }
}
