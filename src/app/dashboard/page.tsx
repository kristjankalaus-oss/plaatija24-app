import Topbar from '@/components/layout/Topbar'
import StatCard from '@/components/ui/StatCard'
import StatusBadge from '@/components/ui/StatusBadge'
import Link from 'next/link'

// Näidisandmed (asendatakse Supabase'iga)
const stats = [
  { title: 'Aktiivsed tellimused', value: 12, icon: '📋', trend: '+3 sel kuul', trendUp: true },
  { title: 'Kliendid', value: 48, icon: '👥', trend: '+5 sel kuul', trendUp: true },
  { title: 'Tulu (nov)', value: '8 450 €', icon: '💶', trend: '+12%', trendUp: true },
  { title: 'Laos tooted', value: 34, icon: '🧱', trend: '2 lõppemas', trendUp: false },
]

const recentOrders = [
  { id: 'T-001', client: 'Mati Mägi', status: 'töös',       total: '1 240 €', date: '14.11.2026' },
  { id: 'T-002', client: 'Kati Kask', status: 'uus',        total: '580 €',   date: '14.11.2026' },
  { id: 'T-003', client: 'OÜ Renova', status: 'kinnitatud', total: '3 100 €', date: '13.11.2026' },
  { id: 'T-004', client: 'Jüri Tamm', status: 'valmis',     total: '920 €',   date: '12.11.2026' },
]

const upcomingJobs = [
  { title: 'Vannitoa plaatimine',    address: 'Tartu mnt 12, Tallinn',  date: '16.11', status: 'planeeritud' },
  { title: 'Mikrotsement köögis',    address: 'Pärnu mnt 88, Tallinn',  date: '17.11', status: 'planeeritud' },
  { title: 'Põrandaplaat büroos',    address: 'Viru 5, Tallinn',        date: '18.11', status: 'planeeritud' },
]

export default function DashboardPage() {
  return (
    <>
      <Topbar title="Ülevaade" subtitle="Tere tulemast tagasi 👋" />
      <main className="flex-1 p-8 space-y-8">

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {stats.map((s) => (
            <StatCard key={s.title} {...s} />
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* Viimased tellimused */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-800">Viimased tellimused</h2>
              <Link href="/dashboard/orders" className="text-sm text-brand-600 hover:underline font-medium">
                Kõik →
              </Link>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                  <th className="pb-2">Nr</th>
                  <th className="pb-2">Klient</th>
                  <th className="pb-2">Staatus</th>
                  <th className="pb-2 text-right">Summa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-2.5 font-mono text-gray-500">{o.id}</td>
                    <td className="py-2.5 font-medium text-gray-800">{o.client}</td>
                    <td className="py-2.5"><StatusBadge status={o.status} /></td>
                    <td className="py-2.5 text-right font-semibold text-gray-800">{o.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tulevased tööd */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-800">Tulevased tööd</h2>
              <Link href="/dashboard/jobs" className="text-sm text-brand-600 hover:underline font-medium">
                Kõik →
              </Link>
            </div>
            <div className="space-y-3">
              {upcomingJobs.map((j, i) => (
                <div key={i} className="flex items-start gap-4 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="min-w-[48px] text-center">
                    <span className="block text-xs text-gray-400">nov</span>
                    <span className="block text-lg font-bold text-brand-600">{j.date.split('.')[0]}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-sm">{j.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{j.address}</p>
                  </div>
                  <StatusBadge status={j.status} />
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
    </>
  )
}
