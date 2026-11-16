'use client'

import { useEffect, useState } from 'react'
import Topbar from '@/components/layout/Topbar'
import StatCard from '@/components/ui/StatCard'
import StatusBadge from '@/components/ui/StatusBadge'
import Link from 'next/link'
import { getProjects, getTilers, fetchProjectsFromSupabase } from '@/lib/data-store'
import { ProjectInquiry, TilerProfile } from '@/types'

export default function DashboardPage() {
  const [projects, setProjects] = useState<ProjectInquiry[]>([])
  const [tilers, setTilers] = useState<TilerProfile[]>([])

  useEffect(() => {
    setProjects(getProjects())
    setTilers(getTilers())
    fetchProjectsFromSupabase().then(remote => {
      if (remote && remote.length > 0) setProjects(remote)
    })
  }, [])

  const totalNet = projects.reduce((sum, p) => sum + (p.aiEstimate?.grossTotal || 0), 0)

  const stats = [
    { title: 'Aktiivsed päringud', value: projects.length, icon: '📋', trend: projects.length === 0 ? 'Hetkel tühi' : 'Reaalajas', trendUp: projects.length > 0 },
    { title: 'Registreeritud meistrid', value: tilers.length, icon: '👥', trend: tilers.length === 0 ? 'Hetkel tühi' : 'Aktiivsed', trendUp: tilers.length > 0 },
    { title: 'Päringute kogumaht', value: `${totalNet.toLocaleString('et-EE')} €`, icon: '💶', trend: 'AI hinnang', trendUp: totalNet > 0 },
    { title: 'Laos tooted', value: 0, icon: '🧱', trend: '0 toodet', trendUp: false },
  ]

  return (
    <>
      <Topbar title="Ülevaade" subtitle="Reaalajas platvormi ülevaade" />
      <main className="flex-1 p-8 space-y-8">

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {stats.map((s) => (
            <StatCard key={s.title} {...s} />
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* Viimased päringud / tellimused */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-800">Viimased päringud</h2>
              <Link href="/pro/requests" className="text-sm text-brand-600 hover:underline font-medium">
                Kõik →
              </Link>
            </div>
            {projects.length === 0 ? (
              <div className="py-10 text-center text-gray-400 text-sm">
                <span className="text-3xl block mb-2">📋</span>
                Hetkel aktiivsed päringud ja tellimused puuduvad.
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                    <th className="pb-2">Projekt</th>
                    <th className="pb-2">Klient</th>
                    <th className="pb-2">Staatus</th>
                    <th className="pb-2 text-right">Hinnang</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {projects.slice(0, 5).map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-2.5 font-medium text-gray-800">
                        <Link href={`/request/${p.id}`} className="hover:text-blue-600">
                          {p.roomTypeLabel}
                        </Link>
                      </td>
                      <td className="py-2.5 text-gray-600">{p.clientName}</td>
                      <td className="py-2.5"><StatusBadge status={p.status} /></td>
                      <td className="py-2.5 text-right font-semibold text-gray-800">
                        {p.aiEstimate.grossTotal.toLocaleString('et-EE')} €
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Tulevased tööd */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-800">Planeeritud tööd</h2>
              <Link href="/dashboard/jobs" className="text-sm text-brand-600 hover:underline font-medium">
                Kõik →
              </Link>
            </div>
            <div className="py-10 text-center text-gray-400 text-sm">
              <span className="text-3xl block mb-2">🗓️</span>
              Hetkel planeeritud paigaldustööd puuduvad.
            </div>
          </div>
        </div>

      </main>
    </>
  )
}
