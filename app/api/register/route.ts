import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { 
      fullName, 
      address, 
      email, 
      mobileNumber, 
      password,
      residencyProofUrl 
    } = body;

    // Validate required fields
    if (!fullName || !address || !email || !mobileNumber || !password) {
      return NextResponse.json(
        { error: 'All fields are required except proof of residency' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        fullName,
        address,
        email,
        mobileNumber,
        password: hashedPassword,
        residencyProofUrl: residencyProofUrl || null,
      })
      .returning();

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      user: userWithoutPassword
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}