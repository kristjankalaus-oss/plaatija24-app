'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import AdBanner from '@/components/ads/AdBanner'
import { useAuth } from '@/lib/useAuth'

export default function Navbar() {
  const pathname = usePathname()
  const { user, role, fullName, companyName, signOut } = useAuth()

  const links = [
    { href: '/', label: 'Avaleht' },
    { href: '/request', label: 'Küsi pakkumist (AI)', highlight: true },
    { href: '/tilers', label: 'Meistrid & Firmad' },
    { href: '/pricing', label: 'Meistrite paketid' },
    ...(role === 'contractor_b2b' || role === 'client' ? [{ href: '/my-projects', label: role === 'contractor_b2b' ? '🏢 Minu hanked' : '📋 Minu päringud' }] : []),
    ...(role === 'tiler' || role === 'admin' || !user ? [{ href: '/pro/requests', label: '🔨 Töölaud' }] : []),
    { href: '/feedback', label: '💬 Tagasiside' },
    ...(role === 'admin' ? [{ href: '/admin', label: '⚙️ Admin' }] : []),
  ]

  return (
    <div className="sticky top-0 z-50">
      {/* Sponsoreeritud brändi ülariba */}
      <AdBanner position="top_header" />

      {/* Põhiline Päis */}
      <header className="bg-white/85 backdrop-blur-xl border-b border-gray-200/70 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #0d5ed9 0%, #073377 100%)' }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <rect x="3" y="3" width="8" height="8" rx="1.5" className="fill-white/25" />
                <rect x="13" y="3" width="8" height="8" rx="1.5" />
                <rect x="3" y="13" width="8" height="8" rx="1.5" />
                <rect x="13" y="13" width="8" height="8" rx="1.5" className="fill-white/90" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-gray-950">
                Objekt<span style={{ color: 'var(--color-brand-500)' }}>24</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] font-bold text-blue-900 ml-1.5 px-2 py-0.5 bg-blue-50 border border-blue-100 rounded-md">
                Ehitus & Viimistlus
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-5 text-sm font-semibold">
            {links.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href))
              if (link.highlight) {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="btn-primary py-2 px-3.5 text-xs tracking-wide font-bold"
                  >
                    ✨ {link.label}
                  </Link>
                )
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors py-1 text-xs ${
                    isActive
                      ? 'font-extrabold text-gray-950 border-b-2'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  style={isActive ? { borderColor: 'var(--color-brand-500)' } : {}}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Parempoolsed kiirviited */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/request"
              className="text-xs font-bold px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50/70 text-blue-900 hover:bg-blue-100 transition-colors"
            >
              + Esita päring
            </Link>
            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href={role === 'tiler' ? '/pro/profile' : role === 'admin' ? '/admin' : '/my-projects'}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg bg-gray-100 text-gray-900 hover:bg-gray-200 transition-colors"
                >
                  {role === 'tiler' ? '🧱' : role === 'contractor_b2b' ? '🏢' : role === 'admin' ? '⚙️' : '🏠'} {companyName || fullName}
                </Link>
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="text-xs font-semibold px-2.5 py-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  Logi välja
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-flex text-xs font-bold px-3 py-1.5 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors"
              >
                Logi sisse
              </Link>
            )}
          </div>

        </div>
      </header>
    </div>
  )
}
