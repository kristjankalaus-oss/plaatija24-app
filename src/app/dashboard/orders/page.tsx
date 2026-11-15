import Topbar from '@/components/layout/Topbar'
import StatusBadge from '@/components/ui/StatusBadge'

const orders = [
  { id: 'T-001', client: 'Mati Mägi',  status: 'töös',       total: '1 240 €', date: '14.11.2026', items: 4 },
  { id: 'T-002', client: 'Kati Kask',  status: 'uus',        total: '580 €',   date: '14.11.2026', items: 2 },
  { id: 'T-003', client: 'OÜ Renova',  status: 'kinnitatud', total: '3 100 €', date: '13.11.2026', items: 7 },
  { id: 'T-004', client: 'Jüri Tamm',  status: 'valmis',     total: '920 €',   date: '12.11.2026', items: 3 },
  { id: 'T-005', client: 'Liis Lepp',  status: 'tarnitud',   total: '2 050 €', date: '10.11.2026', items: 5 },
  { id: 'T-006', client: 'Toomas Oja', status: 'tühistatud', total: '340 €',   date: '08.11.2026', items: 1 },
]

export default function OrdersPage() {
  return (
    <>
      <Topbar title="Tellimused" subtitle="Kõik ehitus- ja plaatimistöö tellimused" />
      <main className="flex-1 p-8">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              {['Kõik', 'Uus', 'Töös', 'Valmis', 'Tarnitud'].map((f) => (
                <button key={f} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${f === 'Kõik' ? 'bg-brand-500 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
                  {f}
                </button>
              ))}
            </div>
            <button className="btn-primary text-sm py-2">+ Uus tellimus</button>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="pb-3">Tellimus</th>
                <th className="pb-3">Klient</th>
                <th className="pb-3">Kuupäev</th>
                <th className="pb-3">Tooteid</th>
                <th className="pb-3">Staatus</th>
                <th className="pb-3 text-right">Summa</th>
                <th className="pb-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="py-3 font-mono text-gray-500 font-medium">{o.id}</td>
                  <td className="py-3 font-semibold text-gray-800">{o.client}</td>
                  <td className="py-3 text-gray-500">{o.date}</td>
                  <td className="py-3 text-gray-600">{o.items} tk</td>
                  <td className="py-3"><StatusBadge status={o.status} /></td>
                  <td className="py-3 text-right font-bold text-gray-900">{o.total}</td>
                  <td className="py-3 text-right">
                    <button className="opacity-0 group-hover:opacity-100 text-brand-600 hover:underline text-xs font-medium transition-opacity">
                      Vaata →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  )
}
