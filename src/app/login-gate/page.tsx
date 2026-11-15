'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginGatePage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth-gate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })

      const data = await res.json()
      if (data.success) {
        router.push('/')
        router.refresh()
      } else {
        setError('Vale salasõna! Palun proovi uuesti.')
      }
    } catch {
      setError('Ühenduse viga, proovi uuesti.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-900/90 border border-gray-800 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-md">
        
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-6">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-md"
               style={{ backgroundColor: 'var(--color-brand-500)' }}>
            P
          </div>
          <span className="text-2xl font-black tracking-tight text-white">
            Plaatija<span style={{ color: 'var(--color-brand-500)' }}>24</span>
          </span>
        </div>

        <div className="text-center mb-8">
          <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full">
            🔒 Testkeskkond · Privaatne ligipääs
          </span>
          <h1 className="text-xl font-bold text-white mt-3">
            Sisesta salasõna
          </h1>
          <p className="text-xs text-gray-400 mt-1 leading-relaxed">
            See veebileht on hetkel arendus- ja testfaasis. Jätkamiseks sisesta palun ligipääsukood.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-950/70 border border-red-800 text-red-300 text-xs font-semibold rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
              Salasõna
            </label>
            <input
              type="password"
              required
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sisesta parool..."
              className="w-full px-4 py-3 bg-gray-950 border border-gray-700 focus:border-amber-500 rounded-xl text-white text-sm outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full btn-primary justify-center py-3.5 text-sm font-bold shadow-lg"
          >
            {loading ? 'Kontrollin...' : 'Sisene lehele →'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-800/80 text-center text-[11px] text-gray-500">
          © 2026 Plaatija24 & Mikrotsement · www.plaatija24.ee
        </div>

      </div>
    </div>
  )
}
