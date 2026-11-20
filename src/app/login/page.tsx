'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import { supabase } from '@/lib/supabase'
import { UserRole } from '@/lib/useAuth'
import { useTranslation } from '@/lib/i18n'

function LoginFormContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect')
  const { t } = useTranslation()

  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [role, setRole] = useState<UserRole>('tiler')
  const [fullName, setFullName] = useState('')
  const [companyName, setCompanyName] = useState('')
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
          setErrorMsg(t('login.err.credentials'))
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
          router.push('/my-projects')
        }
      } else {
        if (!fullName.trim()) {
          setErrorMsg(t('login.err.name'))
          setLoading(false)
          return
        }
        if (role === 'contractor_b2b' && !companyName.trim()) {
          setErrorMsg(t('login.err.company'))
          setLoading(false)
          return
        }
        if (password.length < 6) {
          setErrorMsg(t('login.err.passwordLen'))
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
              company_name: companyName.trim() || undefined,
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
            router.push('/my-projects')
          }
        } else {
          setSuccessMsg(t('login.success.created'))
          setMode('login')
        }
      }
    } catch {
      setErrorMsg(t('login.err.network'))
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
              {t('login.badge')}
            </span>
            <h1 className="text-2xl font-black text-gray-950 mt-3">
              {mode === 'login' ? t('login.title.login') : t('login.title.register')}
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              {mode === 'login'
                ? t('login.sub.login')
                : t('login.sub.register')}
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
              {t('login.tab.login')}
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setErrorMsg('') }}
              className={`py-2 rounded-lg transition-all ${
                mode === 'register' ? 'bg-white text-gray-950 shadow-xs' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {t('login.tab.register')}
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
                    {t('login.role.label')} *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
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
                      <div className="text-xs font-bold text-gray-900 mt-0.5">{t('login.role.tiler')}</div>
                      <div className="text-[10px] text-gray-500">{t('login.role.tilerDesc')}</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole('contractor_b2b')}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        role === 'contractor_b2b'
                          ? 'border-blue-600 bg-blue-50/70'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-lg">🏢</div>
                      <div className="text-xs font-bold text-gray-900 mt-0.5">{t('login.role.b2b')}</div>
                      <div className="text-[10px] text-gray-500">{t('login.role.b2bDesc')}</div>
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
                      <div className="text-xs font-bold text-gray-900 mt-0.5">{t('login.role.client')}</div>
                      <div className="text-[10px] text-gray-500">{t('login.role.clientDesc')}</div>
                    </button>
                  </div>
                </div>

                {role === 'contractor_b2b' && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      {t('login.companyName')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Ehitus OÜ"
                      className="input text-xs"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {t('login.fullName')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t('login.fullName')}
                    className="input text-xs"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">{t('login.email')} *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.ee"
                className="input text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">{t('login.password')} *</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="input text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-sm font-bold justify-center shadow-md"
            >
              {loading
                ? `⏳ ${t('login.loading')}`
                : mode === 'login'
                ? `${t('login.submit.login')} →`
                : `${t('login.submit.register')} →`}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
            <Link href="/" className="hover:text-blue-600 font-semibold">
              {t('login.backHome')}
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
