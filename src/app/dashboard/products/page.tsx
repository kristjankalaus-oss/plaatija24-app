import Topbar from '@/components/layout/Topbar'

const products: { id: number; name: string; category: string; unit: string; price: number; stock: number; lowStock: boolean }[] = []

const categoryColors: Record<string, string> = {
  plaat:        'bg-blue-100 text-blue-700',
  mikrotsement: 'bg-purple-100 text-purple-700',
  liim:         'bg-orange-100 text-orange-700',
  vuugimass:    'bg-teal-100 text-teal-700',
  tööriist:     'bg-gray-100 text-gray-700',
  muu:          'bg-pink-100 text-pink-700',
}

export default function ProductsPage() {
  return (
    <>
      <Topbar title="Tooted & Materjalid" subtitle="Lao haldus ja hinnakirja haldus" />
      <main className="flex-1 p-8">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              <input type="search" placeholder="Otsi toodet..." className="input max-w-xs text-sm" />
            </div>
            <button className="btn-primary text-sm py-2">+ Lisa toode</button>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="pb-3">Nimi</th>
                <th className="pb-3">Kategooria</th>
                <th className="pb-3 text-center">Ühik</th>
                <th className="pb-3 text-right">Hind</th>
                <th className="pb-3 text-center">Laoseis</th>
                <th className="pb-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400 text-sm">
                    Hetkel laos tooted puuduvad.
                  </td>
                </tr>
              ) : products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="py-3 font-semibold text-gray-800">{p.name}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${categoryColors[p.category] ?? 'bg-gray-100 text-gray-600'}`}>
                      {p.category}
                    </span>
                  </td>
                  <td className="py-3 text-center text-gray-500">{p.unit}</td>
                  <td className="py-3 text-right font-semibold text-gray-800">{p.price.toFixed(2)} €</td>
                  <td className="py-3 text-center">
                    <span className={`font-semibold ${p.lowStock ? 'text-red-600' : 'text-green-700'}`}>
                      {p.stock} {p.lowStock && '⚠️'}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button className="opacity-0 group-hover:opacity-100 text-brand-600 hover:underline text-xs font-medium transition-opacity">
                      Muuda →
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
