import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { password } = await request.json()
    const validPassword = process.env.SITE_PASSWORD || 'plaatija2026'

    if (password === validPassword) {
      const response = NextResponse.json({ success: true })
      // Seame küpsise 30 päevaks
      response.cookies.set('site_access', 'granted', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 päeva
        path: '/'
      })
      return response
    }

    return NextResponse.json({ success: false, error: 'Vale parool' }, { status: 401 })
  } catch {
    return NextResponse.json({ success: false, error: 'Serveri viga' }, { status: 500 })
  }
}
