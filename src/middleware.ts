import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Kui lukustus on välja lülitatud, luba kõigil siseneda
  if (process.env.SITE_LOCKED === 'false') {
    return NextResponse.next()
  }

  const { pathname } = request.nextUrl

  // Lubatud avalikud teed (sisselogimise leht, API ja staatilised ressursid)
  const isStaticAsset = /\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|woff2?|txt|xml|json)$/i.test(pathname)
  if (
    pathname.startsWith('/login-gate') ||
    pathname.startsWith('/api/auth-gate') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    isStaticAsset
  ) {
    return NextResponse.next()
  }

  // Kontrollime küpsist
  const accessCookie = request.cookies.get('site_access')
  if (accessCookie?.value === 'granted') {
    return NextResponse.next()
  }

  // Suuname parooli sisestamise lehele
  const loginUrl = new URL('/login-gate', request.url)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
