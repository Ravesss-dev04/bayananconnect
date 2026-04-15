import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { passwordResets } from '@/db/schema';
import { eq, and, lt } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    // Find valid OTP
    const [reset] = await db
      .select()
      .from(passwordResets)
      .where(
        and(
          eq(passwordResets.email, email),
          eq(passwordResets.otp, otp),
          eq(passwordResets.isUsed, false)
        )
      )
      .limit(1);

    if (!reset) {
      return NextResponse.json(
        { error: 'Invalid OTP' },
        { status: 400 }
      );
    }

    // Check if OTP expired
    if (new Date() > reset.expiresAt) {
      await db.delete(passwordResets).where(eq(passwordResets.id, reset.id));
      return NextResponse.json(
        { error: 'OTP has expired' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully'
    });

  } catch (error: any) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { error: 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}