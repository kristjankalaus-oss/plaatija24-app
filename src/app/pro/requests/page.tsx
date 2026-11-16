'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import { getProjects, getTilers, addQuote, getQuotesForProject, fetchProjectsFromSupabase } from '@/lib/data-store'
import { ProjectInquiry, ContractorQuote, TilerProfile } from '@/types'
import { useAuth } from '@/lib/useAuth'

export default function ProRequestsPage() {
  const { user, role, loading: authLoading } = useAuth()
  const [projects, setProjects] = useState<ProjectInquiry[]>([])
  const [tilers, setTilers] = useState<TilerProfile[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<string>('')
  const [activeTilerId, setActiveTilerId] = useState<string>('tiler-1')

  // Pakkumise vormi olek
  const [laborPrice, setLaborPrice] = useState<number>(2800)
  const [materialPrice, setMaterialPrice] = useState<number>(1500)
  const [materialsIncluded, setMaterialsIncluded] = useState<boolean>(true)
  const [startDate, setStartDate] = useState<string>('2 nädala pärast')
  const [duration, setDuration] = useState<string>('5-7 tööpäeva')
  const [warrantyYears, setWarrantyYears] = useState<number>(3)
  const [comment, setComment] = useState<string>('')
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [successMsg, setSuccessMsg] = useState<string>('')
  const [errorMsg, setErrorMsg] = useState<string>('')

  const refreshData = () => {
    const pList = getProjects()
    setProjects(pList)

    const tList = getTilers()
    setTilers(tList)

    fetchProjectsFromSupabase().then(remoteProjects => {
      if (remoteProjects && remoteProjects.length > 0) setProjects(remoteProjects)
    })
  }

  useEffect(() => {
    const pList = getProjects()
    setProjects(pList)
    if (pList.length > 0) {
      setSelectedProjectId(pList[0].id)
      setLaborPrice(pList[0].aiEstimate.laborSubtotal)
      setMaterialPrice(pList[0].aiEstimate.materialSubtotal)
    }

    const tList = getTilers()
    setTilers(tList)

    fetchProjectsFromSupabase().then(remoteProjects => {
      if (remoteProjects && remoteProjects.length > 0) {
        setProjects(remoteProjects)
      }
    })
  }, [])

  const currentProject = projects.find(p => p.id === selectedProjectId) || projects[0]
  const currentTiler = tilers.find(t => t.id === activeTilerId) || tilers[0]
  const existingQuotes = currentProject ? getQuotesForProject(currentProject.id) : []

  // Kontrollime õigusi
  const isFreeTier = currentTiler?.subscriptionTier === 'free'
  const isFreeLimitReached = isFreeTier && (currentTiler?.quotesUsedThisMonth || 0) >= 3
  const isB2BLocked = currentProject?.isB2BProject && currentTiler?.subscriptionTier !== 'vip_b2b_2500'

  const handleSelectProject = (p: ProjectInquiry) => {
    setSelectedProjectId(p.id)
    setLaborPrice(p.aiEstimate.laborSubtotal)
    setMaterialPrice(p.aiEstimate.materialSubtotal)
    setSuccessMsg('')
    setErrorMsg('')
  }

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentProject || !currentTiler) return

    if (isB2BLocked) {
      setErrorMsg('See on Peatöövõtja B2B päring. Pakkumise saatmiseks liitu 49 €/kuus paketiga!')
      return
    }

    if (isFreeLimitReached) {
      setErrorMsg('Tasuta konto 3 pakkumise limiit on täis. Liitu 12.90 €/kuus paketiga!')
      return
    }

    setSubmitting(true)
    setErrorMsg('')

    const newQuote: ContractorQuote = {
      id: 'quote-' + Date.now(),
      projectId: currentProject.id,
      tilerId: currentTiler.id,
      tilerName: currentTiler.name,
      tilerCompany: currentTiler.companyName,
      tilerAvatar: currentTiler.avatarUrl,
      tilerRating: currentTiler.rating,
      tilerCity: currentTiler.city,
      tilerTier: currentTiler.subscriptionTier,
      laborPrice: Number(laborPrice),
      materialPrice: Number(materialPrice),
      totalPrice: Number(laborPrice) + (materialsIncluded ? Number(materialPrice) : 0),
      materialsIncluded,
      estimatedStartDate: startDate,
      estimatedDuration: duration,
      warrantyYears: Number(warrantyYears),
      comment: comment || `Tere! Vaatasin objekti üle ning pakun teostust ${startDate}. Kasutame sertifitseeritud süsteemi tooteid.`,
      status: 'esitatud',
      createdAt: new Date().toISOString()
    }

    const res = addQuote(newQuote)
    if (!res.success) {
      setSubmitting(false)
      setErrorMsg(res.error || 'Pakkumise saatmine ebaõnnestus.')
      return
    }

    refreshData()

    // Saadame taustal e-posti teavituse
    fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'new_quote',
        projectId: currentProject.id,
        projectTitle: currentProject.roomTypeLabel,
        clientEmail: currentProject.clientEmail,
        tilerName: currentTiler.name,
        tilerCompany: currentTiler.companyName,
        quoteTotal: newQuote.totalPrice,
      }),
    }).catch(() => {})

    setTimeout(() => {
      setSubmitting(false)
      setSuccessMsg('✅ Teie pakkumine on edukalt kliendile saadetud!')
    }, 600)
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
            <h1 className="text-xl font-extrabold text-gray-950">Meistrite töölaua ligipääs</h1>
            <p className="text-sm text-gray-600">
              Avatud päringute vaatamine ja pakkumiste esitamine on mõeldud ainult registreeritud meistritele ja paigaldusettevõtetele.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/login?redirect=/pro/requests" className="btn-primary py-2.5 px-6 text-xs font-bold">
                Logi sisse / Registreeru meistrina →
              </Link>
              <Link href="/request" className="btn-secondary py-2.5 px-6 text-xs font-bold">
                Olen klient (esitan päringu)
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        
        {/* Töölaud Header koos Meistri Paketiga */}
        <div className="bg-gray-950 text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-gray-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-blue-600 text-white px-2.5 py-0.5 rounded-md">
                Plaatija Töölaud
              </span>
              <span className="text-xs text-gray-400">Päringute vaatamine ja hinnastamine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">Avatud päringud & pakkumiste haldus</h1>
            <p className="text-sm text-gray-300 mt-1 max-w-2xl">
              Vaata klientide ja peatöövõtjate mahutabeleid, fotosid ja AI hinnaprognoosi. Kohanda oma hindu ja saada pakkumised.
            </p>
          </div>

          {/* Aktiivse meistri paketi ja konto staatus */}
          <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 text-xs space-y-2 min-w-[260px]">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Valitud konto:</span>
              <select
                value={activeTilerId}
                onChange={(e) => setActiveTilerId(e.target.value)}
                className="bg-gray-950 border border-gray-700 text-white font-bold rounded px-2 py-1 text-xs outline-none"
              >
                {tilers.map(t => (
                  <option key={t.id} value={t.id}>{t.companyName}</option>
                ))}
              </select>
            </div>

            <div className="pt-2 border-t border-gray-800 flex items-center justify-between">
              <span className="text-gray-400">Pakett:</span>
              <span className={`font-black uppercase text-[10px] px-2 py-0.5 rounded ${
                currentTiler?.subscriptionTier === 'vip_b2b_2500'
                  ? 'bg-blue-600 text-white'
                  : currentTiler?.subscriptionTier === 'pro_1290'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300'
              }`}>
                {currentTiler?.subscriptionTier === 'vip_b2b_2500' ? 'B2B Äri PRO (49€)' : currentTiler?.subscriptionTier === 'pro_1290' ? 'Meister PRO (12.90€)' : 'Tasuta (3/kuu)'}
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px]">
              <span className="text-gray-400">Pakkumisi tehtud sel kuul:</span>
              <span className="font-bold text-blue-400">
                {currentTiler?.quotesUsedThisMonth} {currentTiler?.subscriptionTier === 'free' ? '/ 3' : '(Piiramatu)'}
              </span>
            </div>

            <Link
              href="/pricing"
              className="block text-center w-full py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-blue-400 hover:text-blue-300 font-bold transition-colors text-[11px]"
            >
              Muuda paketti →
            </Link>
          </div>
        </div>

        {/* Päringute nimekiri ja detailid */}
        {projects.length === 0 ? (
          <div className="card p-12 text-center border border-gray-200 max-w-xl mx-auto my-8">
            <span className="text-5xl block mb-3">📋</span>
            <h2 className="text-xl font-extrabold text-gray-900">Hetkel aktiivsed päringud puuduvad</h2>
            <p className="text-sm text-gray-500 mt-1 mb-6">
              Niipea kui klient esitab uue plaatimis- või mikrotsemendipäringu, ilmub see siia koos täpse mahutabeli ja AI hinnanguga.
            </p>
            <Link href="/request" className="btn-primary py-2.5 px-6 text-xs font-bold">
              + Esita päring kliendina
            </Link>
          </div>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Vasak veerg: Päringute nimekiri (4 veergu) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-gray-400 px-1">
              Saadaval päringud ({projects.length})
            </div>

            {projects.map((p) => {
              const isSelected = p.id === currentProject?.id
              const isB2B = p.isB2BProject
              const requiresVip = isB2B && currentTiler?.subscriptionTier !== 'vip_b2b_2500'

              return (
                <div
                  key={p.id}
                  onClick={() => handleSelectProject(p)}
                  className={`card p-4 border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/40 shadow-xs ring-1 ring-blue-500'
                      : isB2B
                      ? 'border-blue-300 bg-blue-50/20 hover:border-blue-400'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  {isB2B && (
                    <div className="mb-2">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200">
                        💎 Peatöövõtja B2B Hange (49€ pakett)
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-bold text-blue-800 uppercase">
                      {p.serviceType === 'mõlemad' ? 'Plaat + Mikrotsement' : p.serviceType}
                    </span>
                    <span className="text-gray-400">{new Date(p.createdAt).toLocaleDateString('et-EE')}</span>
                  </div>

                  <h3 className="font-bold text-gray-900 text-sm">
                    {p.roomTypeLabel} · {p.city}
                  </h3>

                  <div className="text-xs text-gray-500 mt-1">
                    Süsteem: <span className="font-bold text-gray-700">{p.systemBrandLabel}</span>
                  </div>

                  <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-gray-500">AI Turuhind:</span>
                    <span className="font-black text-gray-900">~{p.aiEstimate.grossTotal.toLocaleString('et-EE')} €</span>
                  </div>

                  {requiresVip && (
                    <div className="mt-2 text-[10px] text-blue-800 font-semibold flex items-center gap-1">
                      <span>🔒</span> Pakkumise esitamiseks nõutav B2B pakett
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Parem veerg: Detail ja pakkumise vorm (8 veergu) */}
          {currentProject && (
            <div className="lg:col-span-8 space-y-6">
              
              {/* Projekti andmed */}
              <div className="card p-6 border border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                  <div>
                    {currentProject.isB2BProject ? (
                      <span className="text-xs font-black uppercase tracking-wider text-blue-800 bg-blue-100 px-2.5 py-1 rounded inline-block mb-1">
                        💎 Peatöövõtja B2B Suurobjekt
                      </span>
                    ) : (
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-800 bg-blue-100 px-2 py-0.5 rounded inline-block mb-1">
                        Eraisiku päring
                      </span>
                    )}

                    <h2 className="text-xl font-extrabold text-gray-900">
                      {currentProject.roomTypeLabel} – {currentProject.city}
                    </h2>
                    <p className="text-xs text-gray-500">
                      Tellija: <span className="font-semibold text-gray-800">{currentProject.clientName}</span> {currentProject.companyName && `(${currentProject.companyName})`} · Tel: {currentProject.clientPhone}
                    </p>
                  </div>

                  <Link
                    href={`/request/${currentProject.id}`}
                    target="_blank"
                    className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1"
                  >
                    Ava kliendi vaade ↗
                  </Link>
                </div>

                {/* Mahutabel */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 text-xs">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-400 block text-[10px]">Põranda maht:</span>
                    <span className="font-extrabold text-gray-900 text-sm">{currentProject.scope.floorArea} m²</span>
                    {currentProject.scope.tileFloorArea !== undefined && currentProject.scope.microFloorArea !== undefined && (currentProject.scope.tileFloorArea > 0 && currentProject.scope.microFloorArea > 0) && (
                      <span className="text-[10px] text-blue-700 block font-medium mt-0.5">{currentProject.scope.tileFloorArea}m² pl / {currentProject.scope.microFloorArea}m² mikro</span>
                    )}
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-400 block text-[10px]">Seinte maht:</span>
                    <span className="font-extrabold text-gray-900 text-sm">{currentProject.scope.wallArea} m²</span>
                    {currentProject.scope.tileWallArea !== undefined && currentProject.scope.microWallArea !== undefined && (currentProject.scope.tileWallArea > 0 && currentProject.scope.microWallArea > 0) && (
                      <span className="text-[10px] text-blue-700 block font-medium mt-0.5">{currentProject.scope.tileWallArea}m² pl / {currentProject.scope.microWallArea}m² mikro</span>
                    )}
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-400 block text-[10px]">Eelistatud süsteem:</span>
                    <span className="font-extrabold text-blue-900 text-xs">{currentProject.systemBrandLabel}</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-400 block text-[10px]">Hüdroisolatsioon:</span>
                    <span className="font-extrabold text-gray-900 text-sm">{currentProject.scope.waterproofingArea} m²</span>
                  </div>
                </div>

                {/* Kirjeldus */}
                <div className="text-xs text-gray-700 bg-blue-50/30 p-3.5 rounded-xl border border-blue-100 mb-4">
                  <span className="font-bold text-blue-950 block mb-1">Objekti kirjeldus:</span>
                  <p className="leading-relaxed">{currentProject.description}</p>
                </div>

                {/* AI Letihinnad võrdluseks */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-gray-500 block text-[11px]">AI koostatud hinnaprognoos kliendile:</span>
                    <span className="text-lg font-black text-gray-900">
                      {currentProject.aiEstimate.grossTotal.toLocaleString('et-EE')} € (KM-ga)
                    </span>
                  </div>
                  <div className="text-right text-[11px] text-gray-500">
                    <div>Tööde turuhind: {currentProject.aiEstimate.laborSubtotal.toLocaleString('et-EE')} €</div>
                    <div>Materjalid: {currentProject.aiEstimate.materialSubtotal.toLocaleString('et-EE')} €</div>
                  </div>
                </div>
              </div>

              {/* PAKKUMISE KOHANDAMINE & SAATMINE */}
              <div className="card p-6 border-2 border-blue-500 bg-white shadow-md relative overflow-hidden">
                
                {/* LUKUSTUS 1: B2B Peatöövõtja päring, nõutav 49€ pakett */}
                {isB2BLocked ? (
                  <div className="p-8 text-center bg-blue-50/90 border-2 border-blue-400 rounded-2xl">
                    <span className="text-4xl">🔒</span>
                    <h3 className="text-lg font-black text-blue-950 mt-2">
                      See on PEATÖÖVÕTJA B2B päring
                    </h3>
                    <p className="text-xs text-blue-800 max-w-md mx-auto mt-1 mb-4 leading-relaxed">
                      Sellele hankele pääsevad pakkumisi tegema ja peatöövõtjaga suhtlema ainult <strong>Peatöövõtjad & Äri PRO (49.00 €/kuu)</strong> paketiga meistrid.
                    </p>
                    <Link
                      href="/pricing"
                      className="btn-primary py-2.5 px-6 text-xs font-bold shadow-md bg-blue-600 hover:bg-blue-700"
                    >
                      Liitu B2B Äripaketiga (49 € / kuu) →
                    </Link>
                  </div>
                ) : isFreeLimitReached ? (
                  /* LUKUSTUS 2: Tasuta konto 3 pakkumist kuus on täis */
                  <div className="p-8 text-center bg-blue-50/90 border-2 border-blue-400 rounded-2xl">
                    <span className="text-4xl">⚠️</span>
                    <h3 className="text-lg font-black text-blue-950 mt-2">
                      Tasuta konto 3 pakkumise limiit on täis!
                    </h3>
                    <p className="text-xs text-blue-800 max-w-md mx-auto mt-1 mb-4 leading-relaxed">
                      Oled sellel kuul kasutanud ära oma 3 tasuta pakkumist. Vali <strong>Aktiivne Meister PRO (12.90 €/kuu)</strong>, et vastata piiramatult kõigile erapäringutele.
                    </p>
                    <Link
                      href="/pricing"
                      className="btn-primary py-2.5 px-6 text-xs font-bold shadow-md"
                    >
                      Uuenda PRO paketile (12.90 € / kuu) →
                    </Link>
                  </div>
                ) : (
                  /* VORM KUI LIGIPÄÄS ON OLEMAS */
                  <div>
                    <div className="mb-4">
                      <h3 className="text-lg font-extrabold text-gray-900">
                        Kohanda hindu ja esita ametlik pakkumine
                      </h3>
                      <p className="text-xs text-gray-500">
                        Kliendile saadetakse teavitus ning ta saab sinuga koheselt vestlust alustada.
                      </p>
                    </div>

                    {successMsg && (
                      <div className="mb-4 p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold rounded-xl">
                        {successMsg}
                      </div>
                    )}
                    {errorMsg && (
                      <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-900 text-xs font-bold rounded-xl">
                        {errorMsg}
                      </div>
                    )}

                    <form onSubmit={handleSubmitQuote} className="space-y-4 text-xs">
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                            Tööraha (€)
                          </label>
                          <input
                            type="number"
                            required
                            value={laborPrice}
                            onChange={(e) => setLaborPrice(parseFloat(e.target.value) || 0)}
                            className="input font-extrabold text-sm"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                            Materjalide kulu (€)
                          </label>
                          <input
                            type="number"
                            required
                            value={materialPrice}
                            onChange={(e) => setMaterialPrice(parseFloat(e.target.value) || 0)}
                            className="input font-extrabold text-sm"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                        <input
                          type="checkbox"
                          id="matInc"
                          checked={materialsIncluded}
                          onChange={(e) => setMaterialsIncluded(e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <label htmlFor="matInc" className="font-semibold text-gray-800 cursor-pointer">
                          Materjalid (hüdroisolatsioon, liimid, vuugid) sisalduvad minu esitatud pakkumise koguhinnas
                        </label>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                            Võimalik algusaeg
                          </label>
                          <input
                            type="text"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            placeholder="nt 2 nädala pärast"
                            className="input text-xs"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                            Tööde kestus
                          </label>
                          <input
                            type="text"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            placeholder="nt 6 tööpäeva"
                            className="input text-xs"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                            Garantii (aastates)
                          </label>
                          <select
                            value={warrantyYears}
                            onChange={(e) => setWarrantyYears(parseInt(e.target.value) || 2)}
                            className="input text-xs font-semibold"
                          >
                            <option value="2">2 aastat</option>
                            <option value="3">3 aastat</option>
                            <option value="5">5 aastat (Ekspertgarantii)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                          Kommentaar ja lisatingimused kliendile
                        </label>
                        <textarea
                          rows={3}
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Selgita kliendile oma töövõtteid, materjale või paku tasuta objekti ülevaatust..."
                          className="input text-xs resize-none"
                        />
                      </div>

                      <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-200 flex items-center justify-between">
                        <div>
                          <span className="text-[11px] text-blue-900 block font-medium">Kliendile kuvatav kogusumma:</span>
                          <span className="text-2xl font-black text-gray-900">
                            {(Number(laborPrice) + (materialsIncluded ? Number(materialPrice) : 0)).toLocaleString('et-EE')} €
                          </span>
                        </div>

                        <button
                          type="submit"
                          disabled={submitting}
                          className="btn-primary py-3 px-8 text-sm font-bold shadow-md"
                        >
                          {submitting ? '⏳ Saadan...' : '🚀 Saada pakkumine kliendile'}
                        </button>
                      </div>

                    </form>
                  </div>
                )}

              </div>

            </div>
          )}

        </div>
        )}

      </main>
    </div>
  )
}
