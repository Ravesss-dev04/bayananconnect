import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userData = cookieStore.get('user_data')?.value;
    
    if (!userData) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }
    
    const user = JSON.parse(userData);
    
    return NextResponse.json({
      authenticated: true,
      user
    }, { status: 200 });
    
  } catch (error) {
    return NextResponse.json(
      { authenticated: false, error: 'Authentication check failed' },
      { status: 500 }
    );
  }
}