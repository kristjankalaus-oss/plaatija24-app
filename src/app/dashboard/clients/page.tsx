import Topbar from '@/components/layout/Topbar'

const clients = [
  { id: 1, name: 'Mati Mägi',  email: 'mati@example.com', phone: '+372 5123 4567', address: 'Tartu mnt 12, Tallinn', orders: 3 },
  { id: 2, name: 'Kati Kask',  email: 'kati@example.com', phone: '+372 5234 5678', address: 'Pärnu mnt 88, Tallinn', orders: 1 },
  { id: 3, name: 'OÜ Renova',  email: 'info@renova.ee',   phone: '+372 6123 456',  address: 'Viru 5, Tallinn',       orders: 7 },
  { id: 4, name: 'Jüri Tamm',  email: 'jyri@example.com', phone: '+372 5345 6789', address: 'Narva mnt 3, Tallinn',  orders: 2 },
  { id: 5, name: 'Liis Lepp',  email: 'liis@example.com', phone: '+372 5456 7890', address: 'Mustamäe tee 50, Tallinn', orders: 4 },
]

export default function ClientsPage() {
  return (
    <>
      <Topbar title="Kliendid" subtitle="Kõik kliendid ja kontaktid" />
      <main className="flex-1 p-8">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <input
              type="search"
              placeholder="Otsi klienti..."
              className="input max-w-xs text-sm"
            />
            <button className="btn-primary text-sm py-2">+ Lisa klient</button>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="pb-3">Nimi</th>
                <th className="pb-3">E-post</th>
                <th className="pb-3">Telefon</th>
                <th className="pb-3">Aadress</th>
                <th className="pb-3 text-center">Tellimused</th>
                <th className="pb-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {clients.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="py-3 font-semibold text-gray-800">{c.name}</td>
                  <td className="py-3 text-gray-500">{c.email}</td>
                  <td className="py-3 text-gray-500">{c.phone}</td>
                  <td className="py-3 text-gray-500 text-xs">{c.address}</td>
                  <td className="py-3 text-center">
                    <span className="bg-brand-50 text-brand-700 font-semibold text-xs px-2 py-0.5 rounded-full">{c.orders}</span>
                  </td>
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
