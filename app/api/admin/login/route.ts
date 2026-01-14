import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { admins } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Accept ANY email and password for first login
    // This will auto-create the admin account
    
    // First, check if any admin exists
    const existingAdmins = await db.select().from(admins).limit(1);
    
    if (existingAdmins.length === 0) {
      // NO ADMIN EXISTS - CREATE ONE WITH THE PROVIDED CREDENTIALS
      console.log('No admin found, creating with:', email);
      
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create admin account
      await db.insert(admins).values({
        id: 'admin-001',
        email: email,
        password: hashedPassword,
      });
      
      console.log('✅ Admin account created!');
    } else {
      // ADMIN EXISTS - CHECK CREDENTIALS
      console.log('Admin exists, checking credentials...');
      
      const [admin] = await db
        .select()
        .from(admins)
        .where(eq(admins.email, email))
        .limit(1);

      if (admin) {
        // Verify password
        const isValidPassword = await bcrypt.compare(password, admin.password);
        
        if (!isValidPassword) {
          return NextResponse.json(
            { error: 'Invalid email or password' },
            { status: 401 }
          );
        }
      } else {
        return NextResponse.json(
          { error: 'Admin account not found' },
          { status: 401 }
        );
      }
    }

    // SET COOKIES FOR ALL CASES (Successful creation or valid login)
    const cookieStore = await cookies();
    
    cookieStore.set('admin_logged_in', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    cookieStore.set('admin_email', email, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return NextResponse.json({
      success: true,
      message: 'Login successful!',
      redirectTo: '/admin'
    });

  } catch (error: any) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}