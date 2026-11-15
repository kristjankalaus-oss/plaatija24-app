import Navbar from '@/components/layout/Navbar'
import RequestForm from '@/components/request/RequestForm'

export const metadata = {
  title: 'Küsi pakkumist – Plaatija24 & Mikrotsement',
  description: 'Sisesta ruumi andmed, mahutabelid ja fotod. AI koostab esialgse pakkumise ja visualiseeringud.'
}

export default function RequestPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <RequestForm />
      </main>
    </div>
  )
}
