import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.get('admin_logged_in')?.value;
  const adminEmail = cookieStore.get('admin_email')?.value;
  
  return NextResponse.json({
    loggedIn: isLoggedIn === 'true',
    email: adminEmail || null
  });
}