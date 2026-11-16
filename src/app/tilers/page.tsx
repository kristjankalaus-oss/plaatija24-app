'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import { getTilers } from '@/lib/data-store'
import { ServiceType } from '@/types'

export default function TilersPage() {
  const tilers = getTilers()
  const [selectedService, setSelectedService] = useState<'all' | ServiceType>('all')
  const [selectedRegion, setSelectedRegion] = useState('all')

  const filtered = tilers.filter(t => {
    if (selectedService !== 'all' && !t.services.includes(selectedService)) {
      return false
    }
    if (selectedRegion !== 'all') {
      const match = t.serviceRegions.some(r => r.toLowerCase().includes(selectedRegion.toLowerCase())) ||
                    t.city.toLowerCase().includes(selectedRegion.toLowerCase())
      if (!match) return false
    }
    return true
  })

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase font-extrabold tracking-wider px-3.5 py-1 bg-blue-100 text-blue-900 border border-blue-200/80 rounded-full">
            Eesti Parimad Meistrid
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3">
            Registreeritud plaatijad ja mikrotsemendi paigaldajad
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Tutvu meistrite tehtud tööde galeriide, hinnangute ja spetsialiseerumisega. Küsi pakkumist või võta otse ühendust.
          </p>
        </div>

        {/* Filtrid */}
        <div className="card p-4 border border-gray-200 mb-8 flex flex-wrap items-center justify-between gap-4">
          
          {/* Eriala filtrid */}
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-1">Eriala:</span>
            {[
              { id: 'all', label: 'Kõik meistrid' },
              { id: 'plaat', label: '🧱 Plaatimine' },
              { id: 'mikrotsement', label: '🎨 Mikrotsement' },
            ].map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedService(f.id as typeof selectedService)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedService === f.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Piirkonna filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Piirkond:</span>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="input text-xs py-1.5 px-3 bg-white w-44 font-semibold"
            >
              <option value="all">Kõik piirkonnad</option>
              <option value="Tallinn">Tallinn & Harjumaa</option>
              <option value="Tartu">Tartu & Lõuna-Eesti</option>
              <option value="Pärnu">Pärnu & Saaremaa</option>
            </select>
          </div>

        </div>

        {/* Paigaldajate nimekiri */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filtered.map(tiler => (
            <div
              key={tiler.id}
              className="card p-6 border border-gray-200 hover:border-blue-400 transition-all shadow-xs hover:shadow-md flex flex-col justify-between"
            >
              <div>
                {/* Päis: pilt + nimi + reiting */}
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={tiler.avatarUrl}
                    alt={tiler.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-sm"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-extrabold text-gray-900">{tiler.companyName}</h3>
                      {tiler.verified && (
                        <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                          ✓ Kinnitatud
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 font-medium mt-0.5">
                      {tiler.name} · 📍 {tiler.city}
                    </div>

                    <div className="flex items-center gap-3 mt-2 text-xs">
                      <span className="font-extrabold text-blue-700 flex items-center gap-1">
                        ★ {tiler.rating}
                        <span className="text-gray-400 font-normal">({tiler.reviewsCount} arvustust)</span>
                      </span>
                      <span className="text-gray-300">|</span>
                      <span className="text-gray-600 font-semibold">{tiler.experienceYears} a kogemust</span>
                      <span className="text-gray-300">|</span>
                      <span className="text-gray-600 font-semibold">{tiler.completedJobsCount} tööd</span>
                    </div>
                  </div>
                </div>

                {/* Märgid / Badges */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {tiler.badges.map((b, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gray-100 text-gray-700"
                    >
                      {b}
                    </span>
                  ))}
                </div>

                {/* Tutvustus */}
                <p className="text-xs text-gray-600 leading-relaxed mb-4 line-clamp-2">
                  {tiler.bio}
                </p>

                {/* Galerii eelvaade (3 fotot) */}
                <div className="mb-4">
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Tehtud tööd ({tiler.gallery.length}):
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {tiler.gallery.slice(0, 3).map((item) => (
                      <div key={item.id} className="relative rounded-lg overflow-hidden h-20 bg-gray-100 group">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1">
                          <span className="text-white text-[9px] font-medium leading-none truncate">
                            {item.title}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Jalus & nupud */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                <div className="text-xs text-gray-500">
                  📞 {tiler.phone}
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/tilers/${tiler.id}`}
                    className="btn-secondary py-1.5 px-3.5 text-xs font-bold"
                  >
                    Vaata profiili & galeriid →
                  </Link>
                  <Link
                    href="/request"
                    className="btn-primary py-1.5 px-3.5 text-xs font-bold"
                  >
                    Küsi pakkumist
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>

      </main>
    </div>
  )
}
