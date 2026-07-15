import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Check if mahalla_uid cookie exists
  const uid = request.cookies.get('mahalla_uid')?.value

  if (!uid) {
    const newUid = crypto.randomUUID()
    response.cookies.set({
      name: 'mahalla_uid',
      value: newUid,
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/',
    })
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - image assets (svg, png, jpg, jpeg, gif, webp)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
