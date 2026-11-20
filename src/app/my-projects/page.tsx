'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import { useAuth } from '@/lib/useAuth'
import { getProjects, getQuotesForProject, fetchProjectsFromSupabase } from '@/lib/data-store'
import { ProjectInquiry } from '@/types'
import { useTranslation } from '@/lib/i18n'

export default function MyProjectsPage() {
  const { t } = useTranslation()
  const { user, role, fullName, companyName, loading: authLoading } = useAuth()
  const [projects, setProjects] = useState<ProjectInquiry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const local = getProjects()
    setProjects(local)
    fetchProjectsFromSupabase().then((remote) => {
      if (remote && remote.length > 0) {
        setProjects(remote)
      }
      setLoading(false)
    })
  }, [])

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8 text-sm text-gray-500 font-semibold">
          ⏳ Laadin projekte...
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="card p-8 max-w-md w-full text-center border border-gray-200 space-y-4">
            <span className="text-5xl block">📋</span>
            <h1 className="text-xl font-extrabold text-gray-950">{t('myProjects.title')}</h1>
            <p className="text-sm text-gray-600">
              {t('myProjects.subtitle')}
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/login?redirect=/my-projects" className="btn-primary py-2.5 px-6 text-xs font-bold">
                {t('nav.login')} →
              </Link>
              <Link href="/request" className="btn-secondary py-2.5 px-6 text-xs font-bold">
                {t('myProjects.new')}
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  const isB2B = role === 'contractor_b2b'
  const myProjects =
    role === 'admin'
      ? projects
      : projects.filter(
          (p) =>
            p.clientEmail?.toLowerCase() === user.email?.toLowerCase() ||
            (isB2B && companyName && p.companyName?.toLowerCase() === companyName.toLowerCase())
        )

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 space-y-8">
        {/* Päise bänner */}
        <div className="bg-gray-950 text-white rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-gray-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-blue-600 text-white px-2.5 py-0.5 rounded-md">
                {isB2B ? '🏢 Peatöövõtja B2B Konto' : role === 'admin' ? '⚙️ Admin Vaade' : '🏠 Kliendi Konto'}
              </span>
              <span className="text-xs text-gray-400">
                {companyName ? `${companyName} · ` : ''}{fullName}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">
              {isB2B ? 'Minu avaldatud hanked & suurobjektid' : 'Minu esitatud hinnapäringud'}
            </h1>
            <p className="text-sm text-gray-300 mt-1 max-w-2xl">
              {isB2B
                ? 'Kõik teie ettevõtte poolt sisestatud plaatimis- ja mikrotsemendihanked koos laekunud B2B meistrite pakkumistega.'
                : 'Vaata oma päringute AI hinnaprognoose, võrdle meistrite pakkumisi ja suhtle otse kiirsõnumites.'}
            </p>
          </div>

          <Link
            href="/request"
            className="btn-primary py-3 px-6 text-xs font-bold whitespace-nowrap shadow-md"
          >
            {isB2B ? '+ Avalda uus B2B hange' : '+ Esita uus hinnapäring'}
          </Link>
        </div>

        {/* Projektide nimekiri */}
        {myProjects.length === 0 ? (
          <div className="card p-12 text-center border border-gray-200 max-w-xl mx-auto">
            <span className="text-5xl block mb-3">{isB2B ? '🏗️' : '📋'}</span>
            <h2 className="text-xl font-extrabold text-gray-900">
              {isB2B ? 'Ühtegi B2B hanget pole veel avaldatud' : 'Sul pole veel ühtegi päringut'}
            </h2>
            <p className="text-sm text-gray-500 mt-1 mb-6">
              {isB2B
                ? 'Sisesta esimene objekti hange koos mahutabelite ja joonistega — pakkumisi saavad teha ainult kontrollitud 49 € Äri PRO paketiga meistrid.'
                : 'Alusta uue päringuga, et saada sekundiga AI turuhinna prognoos ja meistrite pakkumised.'}
            </p>
            <Link href="/request" className="btn-primary py-2.5 px-6 text-xs font-bold">
              {isB2B ? '+ Avalda esimene hange →' : '+ Esita esimene päring →'}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myProjects.map((p) => {
              const quotesCount = getQuotesForProject(p.id).length
              const totalArea = (p.scope.floorArea || 0) + (p.scope.wallArea || 0)
              return (
                <div
                  key={p.id}
                  className="card p-6 border border-gray-200 hover:border-blue-400 transition-all shadow-xs hover:shadow-md flex flex-col justify-between space-y-4 bg-white"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      {p.isB2BProject ? (
                        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200">
                          💎 B2B Hange {p.companyName ? `· ${p.companyName}` : ''}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-gray-100 text-gray-700">
                          Eraisiku päring
                        </span>
                      )}
                      <span className="text-xs text-gray-400">
                        {new Date(p.createdAt).toLocaleDateString('et-EE')}
                      </span>
                    </div>

                    <h3 className="text-lg font-extrabold text-gray-900">{p.roomTypeLabel}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      📍 {p.city} · Maht kokku: <strong className="text-gray-800">{totalArea} m²</strong>
                    </p>
                    <p className="text-xs text-gray-600 mt-3 line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400 block">
                        AI Prognoos (KM-ga)
                      </span>
                      <span className="text-base font-black text-gray-900">
                        ~{p.aiEstimate.grossTotal.toLocaleString('et-EE')} €
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                        {quotesCount} {quotesCount === 1 ? 'pakkumine' : 'pakkumist'}
                      </span>
                      <Link
                        href={`/request/${p.id}`}
                        className="btn-primary py-2 px-4 text-xs font-bold"
                      >
                        Ava & võrdle →
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
