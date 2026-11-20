'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import { getTilers, updateTilerProfile, addGalleryItem, SERVICE_CATEGORIES } from '@/lib/data-store'
import { TilerProfile, GalleryItem, ServiceType } from '@/types'
import { useAuth } from '@/lib/useAuth'

export default function ProProfilePage() {
  const { user, role, loading: authLoading } = useAuth()
  const [tilers, setTilers] = useState<TilerProfile[]>([])
  const [activeTilerId, setActiveTilerId] = useState<string>('tiler-1')
  const [tiler, setTiler] = useState<TilerProfile | null>(null)
  const [saveSuccess, setSaveSuccess] = useState('')

  // Uue galeriipildi vorm
  const [imgTitle, setImgTitle] = useState('')
  const [imgRoomType, setImgRoomType] = useState('Vannituba')
  const [imgService, setImgService] = useState<ServiceType>('plaat')
  const [imgUrl, setImgUrl] = useState('')
  const [imgDesc, setImgDesc] = useState('')
  const [imgYear, setImgYear] = useState('2024')
  const [galSuccess, setGalSuccess] = useState('')

  useEffect(() => {
    const list = getTilers()
    setTilers(list)
    if (list.length === 0) {
      setTiler({
        id: 'tiler-' + Date.now(),
        name: '',
        companyName: '',
        registryCode: '',
        avatarUrl: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=400&q=80',
        city: 'Tallinn',
        serviceRegions: ['Tallinn', 'Harjumaa'],
        services: ['plaat'],
        experienceYears: 5,
        phone: '',
        email: '',
        rating: 5.0,
        reviewsCount: 0,
        completedJobsCount: 0,
        bio: '',
        badges: [],
        verified: true,
        subscriptionTier: 'free',
        quotesUsedThisMonth: 0,
        quotesLimit: 3,
        gallery: []
      })
    } else {
      const current = list.find(t => t.id === activeTilerId) || list[0]
      setTiler(current)
    }
  }, [activeTilerId])

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!tiler) return
    updateTilerProfile(tiler)
    setSaveSuccess('✅ Profiili andmed on salvestatud!')
    setTimeout(() => setSaveSuccess(''), 3000)
  }

  const handleAddGalleryItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (!tiler) return

    const newItem: GalleryItem = {
      id: 'gal-' + Date.now(),
      tilerId: tiler.id,
      title: imgTitle || 'Tehtud töö',
      roomType: imgRoomType,
      serviceType: imgService,
      imageUrl: imgUrl || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80',
      description: imgDesc,
      completedYear: imgYear
    }

    addGalleryItem(tiler.id, newItem)

    // Uuenda kohalik vaade
    setTiler({
      ...tiler,
      gallery: [newItem, ...tiler.gallery]
    })

    setImgTitle('')
    setImgUrl('')
    setImgDesc('')
    setGalSuccess('✅ Uus foto on lisatud teie galeriisse ja klientidele nähtav!')
    setTimeout(() => setGalSuccess(''), 3500)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8 text-sm text-gray-500 font-semibold">
          ⏳ Kontrollin ligipääsu...
        </div>
      </div>
    )
  }

  if (!user || (role !== 'tiler' && role !== 'admin')) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="card p-8 max-w-md w-full text-center border border-gray-200 space-y-4">
            <span className="text-5xl block">🔒</span>
            <h1 className="text-xl font-extrabold text-gray-950">Meistri profiili haldus</h1>
            <p className="text-sm text-gray-600">
              Profiili loomiseks ja tehtud tööde galerii haldamiseks logi sisse meistri kontoga.
            </p>
            <div className="pt-2 flex justify-center">
              <Link href="/login?redirect=/pro/profile" className="btn-primary py-2.5 px-6 text-xs font-bold">
                Logi sisse / Registreeru meistrina →
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!tiler) return null

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">
        
        {/* Header & Meistri valik */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-800 bg-blue-100 border border-blue-200/80 px-2.5 py-0.5 rounded">
              Plaatija konto
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
              Profiili ja tehtud tööde haldus
            </h1>
            <p className="text-xs text-gray-500">
              Kliendid näevad teie profiili ja tehtud tööde galeriid pakkumiste võrdlemisel.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Vali profiil:</span>
            <select
              value={activeTilerId}
              onChange={(e) => setActiveTilerId(e.target.value)}
              className="input text-xs py-1.5 px-3 bg-white font-bold w-52"
            >
              {tilers.map(t => (
                <option key={t.id} value={t.id}>{t.companyName}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Vasak 7 veergu: Profiili andmete muutmine */}
          <div className="lg:col-span-7 space-y-6">
            <div className="card p-6 border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-1">Põhiandmed & Kontakt</h2>
              <p className="text-xs text-gray-500 mb-6">Ettevõtte info, mis kuvatakse avalikul profiilil</p>

              {saveSuccess && (
                <div className="mb-4 p-3 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-xl">
                  {saveSuccess}
                </div>
              )}

              <form onSubmit={handleProfileSave} className="space-y-4 text-xs">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Ettevõtte nimi
                    </label>
                    <input
                      type="text"
                      value={tiler.companyName}
                      onChange={(e) => setTiler({ ...tiler, companyName: e.target.value })}
                      className="input text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Meistri täisnimi
                    </label>
                    <input
                      type="text"
                      value={tiler.name}
                      onChange={(e) => setTiler({ ...tiler, name: e.target.value })}
                      className="input text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Telefoninumber
                    </label>
                    <input
                      type="text"
                      value={tiler.phone}
                      onChange={(e) => setTiler({ ...tiler, phone: e.target.value })}
                      className="input text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      E-posti aadress
                    </label>
                    <input
                      type="email"
                      value={tiler.email}
                      onChange={(e) => setTiler({ ...tiler, email: e.target.value })}
                      className="input text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Peamine asukoht
                    </label>
                    <input
                      type="text"
                      value={tiler.city}
                      onChange={(e) => setTiler({ ...tiler, city: e.target.value })}
                      className="input text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Kogemus (aastates)
                    </label>
                    <input
                      type="number"
                      value={tiler.experienceYears}
                      onChange={(e) => setTiler({ ...tiler, experienceYears: parseInt(e.target.value) || 0 })}
                      className="input text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Milliste tööde päringud mulle jõuavad? (Erialad) *
                  </label>
                  <p className="text-[11px] text-gray-500 mb-2">
                    Märgi kõik tööd, mida teostad — töölaud suunab sulle vastavad etapid automaatselt.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {SERVICE_CATEGORIES.filter(c => c.id !== 'mõlemad').map((cat) => {
                      const active = tiler.services.includes(cat.id)
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            const next = active
                              ? tiler.services.filter(s => s !== cat.id)
                              : [...tiler.services, cat.id]
                            if (next.length === 0) return
                            setTiler({ ...tiler, services: next })
                          }}
                          className={`p-2.5 rounded-xl border text-left flex items-center justify-between gap-2 transition-all ${
                            active
                              ? 'border-blue-600 bg-blue-50/70 text-blue-950 font-bold'
                              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                          }`}
                        >
                          <span className="flex items-center gap-2 text-xs">
                            <span>{cat.icon}</span>
                            <span>{cat.label}</span>
                          </span>
                          <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-black ${
                            active ? 'bg-blue-600 text-white' : 'bg-gray-100 text-transparent'
                          }`}>
                            ✓
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Tutvustus & oskused
                  </label>
                  <textarea
                    rows={4}
                    value={tiler.bio}
                    onChange={(e) => setTiler({ ...tiler, bio: e.target.value })}
                    className="input text-xs resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button type="submit" className="btn-primary py-2 px-6 text-xs font-bold">
                    Salvesta muudatused
                  </button>
                </div>

              </form>
            </div>
          </div>

          {/* Parem 5 veergu: Uue pildi lisamine galeriisse */}
          <div className="lg:col-span-5 space-y-6">
            <div className="card p-6 border-2 border-blue-200 bg-white shadow-xs">
              <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                <span>📸</span> Lisa uus foto galeriisse
              </h2>
              <p className="text-xs text-gray-500 mb-4">
                Laadi üles pilt tehtud tööst, et kliendid näeksid teie töö kvaliteeti
              </p>

              {galSuccess && (
                <div className="mb-4 p-3 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-xl">
                  {galSuccess}
                </div>
              )}

              <form onSubmit={handleAddGalleryItem} className="space-y-3.5 text-xs">
                
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Projekti pealkiri *
                  </label>
                  <input
                    type="text"
                    required
                    value={imgTitle}
                    onChange={(e) => setImgTitle(e.target.value)}
                    placeholder="nt 60x120 Calacatta plaat ja šampooninišš"
                    className="input text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Teenuse liik
                    </label>
                    <select
                      value={imgService}
                      onChange={(e) => setImgService(e.target.value as ServiceType)}
                      className="input text-xs font-semibold"
                    >
                      <option value="plaat">Plaatimine</option>
                      <option value="mikrotsement">Mikrotsement</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Ruumi tüüp
                    </label>
                    <select
                      value={imgRoomType}
                      onChange={(e) => setImgRoomType(e.target.value)}
                      className="input text-xs font-semibold"
                    >
                      <option value="Vannituba">Vannituba</option>
                      <option value="Duširuum">Duširuum</option>
                      <option value="Köök">Köök</option>
                      <option value="Esik">Esik</option>
                      <option value="Spaa">Spaa / Saun</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Pildi URL (või näidis) *
                  </label>
                  <input
                    type="url"
                    required
                    value={imgUrl}
                    onChange={(e) => setImgUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="input text-xs font-mono"
                  />
                  <div className="flex gap-1.5 mt-1.5">
                    <button
                      type="button"
                      onClick={() => setImgUrl('https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80')}
                      className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200"
                    >
                      Näidis 1 (Marmor)
                    </button>
                    <button
                      type="button"
                      onClick={() => setImgUrl('https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1000&q=80')}
                      className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200"
                    >
                      Näidis 2 (Mikrotsement)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Valmimise aasta
                    </label>
                    <input
                      type="text"
                      value={imgYear}
                      onChange={(e) => setImgYear(e.target.value)}
                      className="input text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Lühikirjeldus töö kohta
                  </label>
                  <textarea
                    rows={2}
                    value={imgDesc}
                    onChange={(e) => setImgDesc(e.target.value)}
                    placeholder="nt Täpne 45° jiiride lihvimine, Kiilto hüdroisolatsioon ja epoksiidvuuk."
                    className="input text-xs resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full justify-center py-2.5 text-xs font-bold"
                >
                  + Lisa foto galeriisse
                </button>

              </form>
            </div>
          </div>

        </div>

        {/* Olemasoleva galerii eelvaade */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Teie praegune fotogalerii ({tiler.gallery.length} fotot)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {tiler.gallery.map(item => (
              <div key={item.id} className="card p-0 overflow-hidden border border-gray-200 flex flex-col">
                <div className="h-44 bg-gray-100 relative">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    {item.serviceType} · {item.roomType}
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="font-bold text-gray-900 text-xs truncate">{item.title}</h4>
                  <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  )
}
