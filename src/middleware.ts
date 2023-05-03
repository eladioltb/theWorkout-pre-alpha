// middleware.ts
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {

  const session = await getToken({req, secret: process.env.NEXTAUTH_SECRET});

  if(!session){
    const url = req.nextUrl.clone()
    url.pathname = '/auth/'

    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/routines', 
    '/routines/:path*', 
    '/exercises', 
    '/exercises/:path*', 
    '/settings', 
    '/settings/:path*', 
    '/workout', 
    '/workout/:path*', 
    '/progress',
    '/progress/:path*',
    '/profile',
    '/profile/:path*',
  ],
};