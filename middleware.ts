import { NextRequest, NextResponse } from 'next/server';
import { verifyTokenEdge } from './lib/edge-auth';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = req.cookies.get('admin_token')?.value;
    if (!token || !(await verifyTokenEdge(token))) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
