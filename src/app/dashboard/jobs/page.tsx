import Topbar from '@/components/layout/Topbar'
import StatusBadge from '@/components/ui/StatusBadge'

const jobs: { id: number; title: string; address: string; date: string; client: string; status: string; order: string }[] = []

export default function JobsPage() {
  return (
    <>
      <Topbar title="Paigaldustööd" subtitle="Planeeritud ja käimasolevad plaatimistööd" />
      <main className="flex-1 p-8">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              {['Kõik', 'Planeeritud', 'Käimas', 'Valmis'].map((f) => (
                <button key={f} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${f === 'Kõik' ? 'bg-brand-500 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
                  {f}
                </button>
              ))}
            </div>
            <button className="btn-primary text-sm py-2">+ Lisa töö</button>
          </div>

          <div className="space-y-3">
            {jobs.map((j) => (
              <div key={j.id} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group">
                <div className="min-w-[64px] text-center bg-white rounded-xl p-2 shadow-sm">
                  <span className="block text-xs text-gray-400">{j.date.split('.')[1] === '11' ? 'nov' : 'dets'}</span>
                  <span className="block text-xl font-bold text-brand-600">{j.date.split('.')[0]}</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{j.title}</p>
                  <p className="text-sm text-gray-500 mt-0.5">📍 {j.address}</p>
                  <p className="text-xs text-gray-400 mt-0.5">👤 {j.client} · {j.order}</p>
                </div>
                <StatusBadge status={j.status} />
                <button className="opacity-0 group-hover:opacity-100 text-brand-600 hover:underline text-sm font-medium transition-opacity ml-4">
                  Vaata →
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
