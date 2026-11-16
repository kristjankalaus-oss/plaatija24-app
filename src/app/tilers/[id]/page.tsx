'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import { getTilerById, SEED_TILERS } from '@/lib/data-store'
import { GalleryItem } from '@/types'

export default function TilerProfilePage() {
  const params = useParams()
  const tilerId = (params?.id as string) || 'tiler-1'
  const tiler = getTilerById(tilerId) || SEED_TILERS[0]

  const [activeFilter, setActiveFilter] = useState<'all' | 'plaat' | 'mikrotsement'>('all')
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null)

  const filteredGallery = tiler.gallery.filter(item => {
    if (activeFilter === 'all') return true
    return item.serviceType === activeFilter
  })

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-10">
        
        {/* Tagasiviide */}
        <div className="mb-6">
          <Link href="/tilers" className="text-xs font-bold text-gray-500 hover:text-gray-900 flex items-center gap-1">
            ← Tagasi kõigi paigaldajate juurde
          </Link>
        </div>

        {/* Profiili päis */}
        <div className="card p-8 border border-gray-200/80 shadow-xs mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            <div className="flex items-start gap-5">
              <img
                src={tiler.avatarUrl}
                alt={tiler.name}
                className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md"
              />
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{tiler.companyName}</h1>
                  {tiler.verified && (
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                      ✓ Sertifitseeritud
                    </span>
                  )}
                </div>

                <div className="text-sm text-gray-500 mt-1">
                  Meister: <span className="font-semibold text-gray-800">{tiler.name}</span> · 📍 {tiler.city}
                  {tiler.registryCode && <span className="ml-2 text-xs text-gray-400">(Reg. nr {tiler.registryCode})</span>}
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-3 text-xs">
                  <span className="font-extrabold text-blue-700 text-sm flex items-center gap-1">
                    ★ {tiler.rating}
                    <span className="text-gray-400 font-normal text-xs">({tiler.reviewsCount} arvustust)</span>
                  </span>
                  <span className="text-gray-300">|</span>
                  <span className="text-gray-700 font-semibold">{tiler.experienceYears} aastat kogemust</span>
                  <span className="text-gray-300">|</span>
                  <span className="text-gray-700 font-semibold">{tiler.completedJobsCount} valminud objekti</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
              <div className="p-3 bg-gray-50 rounded-xl text-xs space-y-1 text-gray-600">
                <div>📞 <span className="font-semibold text-gray-900">{tiler.phone}</span></div>
                <div>✉️ <span className="font-semibold text-gray-900">{tiler.email}</span></div>
              </div>
              <Link
                href="/request"
                className="btn-primary justify-center py-3 px-6 text-sm font-bold shadow-md"
              >
                Küsi meistrilt pakkumist →
              </Link>
            </div>

          </div>

          {/* Badges & Piirkonnad */}
          <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {tiler.badges.map((b, idx) => (
                <span
                  key={idx}
                  className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-900 border border-blue-200/70 rounded-lg"
                >
                  ✓ {b}
                </span>
              ))}
            </div>
            <div className="text-xs text-gray-500">
              Teeninduspiirkonnad: <span className="font-semibold text-gray-800">{tiler.serviceRegions.join(', ')}</span>
            </div>
          </div>

          {/* Tutvustus / Bio */}
          <div className="mt-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Meistri tutvustus</h3>
            <p className="text-sm text-gray-700 leading-relaxed max-w-4xl">
              {tiler.bio}
            </p>
          </div>
        </div>

        {/* TEHTUD TÖÖDE GALERII */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Tehtud tööde fotogalerii</h2>
              <p className="text-xs text-gray-500 mt-0.5">Vaata meistri poolt teostatud plaatimis- ja mikrotsemenditöid</p>
            </div>

            {/* Filtrid */}
            <div className="flex items-center gap-2">
              {[
                { id: 'all', label: `Kõik tööd (${tiler.gallery.length})` },
                { id: 'plaat', label: '🧱 Plaatimistööd' },
                { id: 'mikrotsement', label: '🎨 Mikrotsement' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id as typeof activeFilter)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeFilter === tab.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Fotode ruudustik */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGallery.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedPhoto(item)}
                className="card p-0 overflow-hidden border border-gray-200 hover:border-blue-400 transition-all shadow-xs hover:shadow-md cursor-pointer group flex flex-col"
              >
                <div className="relative h-64 overflow-hidden bg-gray-100">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                    {item.roomType} {item.completedYear && `· ${item.completedYear}`}
                  </div>
                  <div className="absolute top-3 right-3 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-xs">
                    {item.serviceType === 'plaat' ? 'Plaat' : 'Mikrotsement'}
                  </div>
                </div>

                <div className="p-4 bg-white flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm mb-1 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h4>
                    {item.description && (
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-blue-700 font-semibold">
                    <span>Vaata lähemalt</span>
                    <span>🔍 Suurenda</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Modal fotode suurendamiseks */}
        {selectedPhoto && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <div
              className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-96 sm:h-[450px] bg-black">
                <img
                  src={selectedPhoto.imageUrl}
                  alt={selectedPhoto.title}
                  className="w-full h-full object-contain"
                />
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white font-bold flex items-center justify-center hover:bg-black"
                >
                  ✕
                </button>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                    {selectedPhoto.serviceType} · {selectedPhoto.roomType}
                  </span>
                  {selectedPhoto.completedYear && (
                    <span className="text-xs text-gray-400">({selectedPhoto.completedYear})</span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedPhoto.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  {selectedPhoto.description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    Meister: <span className="font-semibold text-gray-900">{tiler.companyName}</span>
                  </div>
                  <Link
                    href="/request"
                    className="btn-primary py-2 px-5 text-xs font-bold"
                  >
                    Küsi analoogset tööd oma ruumile →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
