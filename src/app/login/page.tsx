'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import { supabase } from '@/lib/supabase'
import { UserRole } from '@/lib/useAuth'

function LoginFormContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect')

  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [role, setRole] = useState<UserRole>('tiler')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    setLoading(true)

    try {
      if (mode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })
        if (error) {
          setErrorMsg('Vale e-post või parool. Kontrolli andmeid.')
          setLoading(false)
          return
        }

        const userRole = data.user?.user_metadata?.role || 'client'
        if (redirectTo) {
          router.push(redirectTo)
        } else if (userRole === 'tiler') {
          router.push('/pro/requests')
        } else if (userRole === 'admin') {
          router.push('/admin')
        } else {
          router.push('/request')
        }
      } else {
        if (!fullName.trim()) {
          setErrorMsg('Palun sisesta oma nimi või ettevõtte nimi.')
          setLoading(false)
          return
        }
        if (password.length < 6) {
          setErrorMsg('Parool peab olema vähemalt 6 tähemärki pikk.')
          setLoading(false)
          return
        }

        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              role,
              full_name: fullName.trim(),
            },
          },
        })

        if (error) {
          setErrorMsg(error.message || 'Registreerimine ebaõnnestus.')
          setLoading(false)
          return
        }

        if (data.session) {
          if (redirectTo) {
            router.push(redirectTo)
          } else if (role === 'tiler') {
            router.push('/pro/profile')
          } else {
            router.push('/request')
          }
        } else {
          setSuccessMsg('✅ Konto loodud! Kontrolli oma e-posti kinnituslingi jaoks ja seejärel logi sisse.')
          setMode('login')
        }
      }
    } catch {
      setErrorMsg('Ühenduse viga. Proovi uuesti.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md card p-6 sm:p-8 border border-gray-200 shadow-lg bg-white">
          <div className="text-center mb-6">
            <span className="text-xs font-extrabold uppercase tracking-wider px-3 py-1 bg-blue-100 text-blue-900 rounded-full">
              Plaatija24 Konto
            </span>
            <h1 className="text-2xl font-black text-gray-950 mt-3">
              {mode === 'login' ? 'Logi sisse' : 'Loo uus konto'}
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              {mode === 'login'
                ? 'Sisene oma kliendi või meistri töölauale'
                : 'Vali roll ja alusta pakkumiste esitamist või küsimist'}
            </p>
          </div>

          {/* Režiimi vahetus */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-gray-100 rounded-xl mb-6 text-xs font-bold">
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMsg('') }}
              className={`py-2 rounded-lg transition-all ${
                mode === 'login' ? 'bg-white text-gray-950 shadow-xs' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Logi sisse
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setErrorMsg('') }}
              className={`py-2 rounded-lg transition-all ${
                mode === 'register' ? 'bg-white text-gray-950 shadow-xs' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Registreeru
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              ⚠️ {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Konto tüüp *
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setRole('tiler')}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        role === 'tiler'
                          ? 'border-blue-600 bg-blue-50/70'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-lg">🧱</div>
                      <div className="text-xs font-bold text-gray-900 mt-0.5">Meister / Firma</div>
                      <div className="text-[10px] text-gray-500">Pakun plaatimistöid</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole('client')}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        role === 'client'
                          ? 'border-blue-600 bg-blue-50/70'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-lg">🏠</div>
                      <div className="text-xs font-bold text-gray-900 mt-0.5">Tellija / Klient</div>
                      <div className="text-[10px] text-gray-500">Küsin pakkumisi</div>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {role === 'tiler' ? 'Nimi või ettevõtte nimi *' : 'Sinu nimi *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={role === 'tiler' ? 'nt OÜ Plaatimine / Jüri' : 'nt Kati Kask'}
                    className="input text-xs"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">E-posti aadress *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nimi@ettevote.ee"
                className="input text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Parool *</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Vähemalt 6 tähemärki"
                className="input text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-sm font-bold justify-center shadow-md"
            >
              {loading
                ? '⏳ Palun oota...'
                : mode === 'login'
                ? 'Logi sisse →'
                : 'Loo konto ja jätka →'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
            <Link href="/" className="hover:text-blue-600 font-semibold">
              ← Tagasi avalehele
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <LoginFormContent />
    </Suspense>
  )
}
