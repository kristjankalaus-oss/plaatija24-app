'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/dashboard', label: 'Ülevaade', icon: '📊' },
  { href: '/dashboard/orders', label: 'Tellimused', icon: '📋' },
  { href: '/dashboard/clients', label: 'Kliendid', icon: '👥' },
  { href: '/dashboard/products', label: 'Tooted', icon: '🧱' },
  { href: '/dashboard/jobs', label: 'Tööd', icon: '🔨' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-100">
        <span className="text-2xl font-extrabold tracking-tight" style={{ color: 'var(--color-brand-500)' }}>Plaatija24</span>
        <span className="ml-1 text-xs text-gray-400 font-medium">& Mikrotsement</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              style={active ? { backgroundColor: 'var(--color-brand-50)', color: 'var(--color-brand-700)' } : {}}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                ${active ? 'font-semibold' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-100 text-xs text-gray-400">
        v0.1 · Plaatija24 OÜ
      </div>
    </aside>
  )
}
