import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  
  cookieStore.delete('admin_logged_in');
  cookieStore.delete('admin_email');

  return NextResponse.json({ 
    success: true, 
    redirectTo: '/admin/login'
  });
}