'use client'

import { useState, useRef, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ProjectInquiry,
  ServiceType,
  TileSpecs,
  MicrocementSpecs,
  ScopeOfWork,
  UploadedFile,
  SystemBrand,
  ClientType
} from '@/types'
import { calculateAIEstimate, SYSTEM_BRAND_INFO } from '@/lib/pricing-calculator'
import { getAIVisualizations } from '@/lib/ai-visualizer'
import { saveProject, ESTONIAN_REGIONS } from '@/lib/data-store'
import AdBanner from '@/components/ads/AdBanner'
import { useAuth } from '@/lib/useAuth'

const TILE_SIZES = [
  { id: 'standard_30x60', label: 'Standard 30x60 cm' },
  { id: 'standard_60x60', label: 'Ruutplaat 60x60 cm' },
  { id: 'large_60x120',   label: 'Suurformaat 60x120 cm' },
  { id: 'slab_large',     label: 'XL Keraamiline Slab (120x240cm+)' },
  { id: 'herringbone',    label: 'Kalasaba muster (Herringbone)' },
  { id: 'mosaic',         label: 'Mosaiik / Heksagon' },
]

const SYSTEM_BRANDS: { id: SystemBrand; label: string; flag: string; desc: string }[] = [
  { id: 'mira',    label: 'MIRA',    flag: '🇩🇰', desc: 'Mira 4400 multicoat & 3130 superfix' },
  { id: 'mapei',   label: 'MAPEI',   flag: '🇮🇹', desc: 'Mapelastic & Ultracolor Plus' },
  { id: 'weber',   label: 'Weber',   flag: '🇫🇷', desc: 'Saint-Gobain vetonit süsteem' },
  { id: 'kiilto',  label: 'Kiilto',  flag: '🇫🇮', desc: 'Kerafiber kiudtugevdatud süsteem' },
  { id: 'ceresit', label: 'Ceresit', flag: '🇩🇪', desc: 'CL51 & CM17 Super Flex' },
  { id: 'none',    label: 'Ei oma eelistust', flag: '⭐', desc: 'Meistri parim soovitus' },
]

export default function RequestForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 1. Tellija staatus
  const [clientType, setClientType] = useState<ClientType>('private')
  const [companyName, setCompanyName] = useState('')

  // 2. Teenus & Kirjeldus & Failid (juba 1. sammus!)
  const [serviceType, setServiceType] = useState<ServiceType>('plaat')
  const [description, setDescription] = useState('')
  const [files, setFiles] = useState<UploadedFile[]>([])

  // 3. Mõõdud & Mahud
  const [floorArea, setFloorArea] = useState<number>(6)
  const [wallArea, setWallArea] = useState<number>(18)
  const [wallHeight, setWallHeight] = useState<number>(2.5)
  const [perimeter, setPerimeter] = useState<number>(10)

  // Eraldi pinnakatete jaotused (kui osa on plaat ja osa mikrotsement)
  const [tileFloorArea, setTileFloorArea] = useState<number>(6)
  const [microFloorArea, setMicroFloorArea] = useState<number>(0)
  const [tileWallArea, setTileWallArea] = useState<number>(18)
  const [microWallArea, setMicroWallArea] = useState<number>(0)

  const handleSelectServiceType = (t: ServiceType) => {
    setServiceType(t)
    if (t === 'plaat') {
      setTileFloorArea(floorArea)
      setMicroFloorArea(0)
      setTileWallArea(wallArea)
      setMicroWallArea(0)
    } else if (t === 'mikrotsement') {
      setTileFloorArea(0)
      setMicroFloorArea(floorArea)
      setTileWallArea(0)
      setMicroWallArea(wallArea)
    } else if (t === 'mõlemad') {
      const showerWall = Math.min(6, wallArea)
      setTileWallArea(showerWall)
      setMicroWallArea(Math.max(0, wallArea - showerWall))
      setTileFloorArea(floorArea)
      setMicroFloorArea(0)
    }
  }

  const handleUpdateTileWall = (val: number) => {
    const v = Math.max(0, val)
    setTileWallArea(v)
    const newTotal = v + microWallArea
    setWallArea(newTotal)
    if (v > 0 && microWallArea > 0 && serviceType !== 'mõlemad') {
      setServiceType('mõlemad')
    }
  }

  const handleUpdateMicroWall = (val: number) => {
    const v = Math.max(0, val)
    setMicroWallArea(v)
    const newTotal = tileWallArea + v
    setWallArea(newTotal)
    if (tileWallArea > 0 && v > 0 && serviceType !== 'mõlemad') {
      setServiceType('mõlemad')
    }
  }

  const handleUpdateTileFloor = (val: number) => {
    const v = Math.max(0, val)
    setTileFloorArea(v)
    const newTotal = v + microFloorArea
    setFloorArea(newTotal)
    if (v > 0 && microFloorArea > 0 && serviceType !== 'mõlemad') {
      setServiceType('mõlemad')
    }
  }

  const handleUpdateMicroFloor = (val: number) => {
    const v = Math.max(0, val)
    setMicroFloorArea(v)
    const newTotal = tileFloorArea + v
    setFloorArea(newTotal)
    if (tileFloorArea > 0 && v > 0 && serviceType !== 'mõlemad') {
      setServiceType('mõlemad')
    }
  }

  const handleUpdateTotalWall = (val: number) => {
    const v = Math.max(0, val)
    setWallArea(v)
    if (serviceType === 'plaat') {
      setTileWallArea(v)
      setMicroWallArea(0)
    } else if (serviceType === 'mikrotsement') {
      setTileWallArea(0)
      setMicroWallArea(v)
    } else {
      const tWall = Math.min(tileWallArea, v)
      setTileWallArea(tWall)
      setMicroWallArea(v - tWall)
    }
  }

  const handleUpdateTotalFloor = (val: number) => {
    const v = Math.max(0, val)
    setFloorArea(v)
    if (serviceType === 'plaat') {
      setTileFloorArea(v)
      setMicroFloorArea(0)
    } else if (serviceType === 'mikrotsement') {
      setTileFloorArea(0)
      setMicroFloorArea(v)
    } else {
      const tFloor = Math.min(tileFloorArea, v)
      setTileFloorArea(tFloor)
      setMicroFloorArea(v - tFloor)
    }
  }

  // 4. Süsteemi valik & Töölõigud (2. samm)
  const [systemBrand, setSystemBrand] = useState<SystemBrand>('none')
  const [levelingRequired, setLevelingRequired] = useState(true)
  const [demolitionRequired, setDemolitionRequired] = useState(false)
  const [waterproofingArea, setWaterproofingArea] = useState<number>(24)
  const [corners45degCount, setCorners45degCount] = useState<number>(6)
  const [nichesCount, setNichesCount] = useState<number>(1)
  const [drainsCount, setDrainsCount] = useState<number>(1)
  const [siliconeLength, setSiliconeLength] = useState<number>(15)

  // 5. Plaatide andmed (3. samm)
  const [tileSize, setTileSize] = useState<TileSpecs['size']>('large_60x120')
  const [tileMaterial, setTileMaterial] = useState<TileSpecs['material']>('portselan')
  const [tileFinish, setTileFinish] = useState<TileSpecs['finish']>('matt')
  const [tileColorStyle, setTileColorStyle] = useState('Valge Carrara marmor helehallide soontega')
  const [jointType, setJointType] = useState<'cement' | 'epoxy'>('epoxy')
  const [tileBrand, setTileBrand] = useState('')

  // 6. Mikrotsemendi andmed
  const [microSystem, setMicroSystem] = useState<MicrocementSpecs['system']>('shower_waterproof')
  const [microFinish, setMicroFinish] = useState<MicrocementSpecs['finish']>('siidjas')
  const [microColorTone, setMicroColorTone] = useState('Soe liivakarva beež')
  const [microTexture, setMicroTexture] = useState<MicrocementSpecs['texture']>('peenike_sile')

  // 7. Kontakt (4. samm)
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [city, setCity] = useState('Tallinn ja Harjumaa')
  const [address, setAddress] = useState('')
  const [timeline, setTimeline] = useState<'urgent_1_month' | 'planned_1_3_months' | 'just_browsing'>('urgent_1_month')
  const [budgetConfirmed, setBudgetConfirmed] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [browsingSummaryOpen, setBrowsingSummaryOpen] = useState(false)

  const { user, role, fullName, companyName: authCompany } = useAuth()

  useEffect(() => {
    if (!user) return
    if (role === 'contractor_b2b') {
      setClientType('contractor_b2b')
      if (authCompany && !companyName) setCompanyName(authCompany)
    }
    if (fullName && !clientName) setClientName(fullName)
    if (user.email && !clientEmail) setClientEmail(user.email)
  }, [user, role, fullName, authCompany])

  // Reaalajas koostatav Scope
  const currentScope: ScopeOfWork = useMemo(() => ({
    floorArea: Number(floorArea) || 0,
    wallArea: Number(wallArea) || 0,
    wallHeight: Number(wallHeight) || 2.5,
    perimeter: Number(perimeter) || 0,
    tileFloorArea: Number(tileFloorArea) || 0,
    microFloorArea: Number(microFloorArea) || 0,
    tileWallArea: Number(tileWallArea) || 0,
    microWallArea: Number(microWallArea) || 0,
    levelingRequired,
    waterproofingArea: Number(waterproofingArea) || 0,
    corners45degCount: Number(corners45degCount) || 0,
    nichesCount: Number(nichesCount) || 0,
    drainsCount: Number(drainsCount) || 0,
    siliconeLength: Number(siliconeLength) || 0,
    demolitionRequired,
    extras: []
  }), [
    floorArea, wallArea, wallHeight, perimeter,
    tileFloorArea, microFloorArea, tileWallArea, microWallArea,
    levelingRequired, waterproofingArea, corners45degCount, nichesCount,
    drainsCount, siliconeLength, demolitionRequired
  ])

  const currentTileSpecs: TileSpecs = useMemo(() => ({
    size: tileSize,
    sizeLabel: TILE_SIZES.find(s => s.id === tileSize)?.label || tileSize,
    material: tileMaterial,
    finish: tileFinish,
    colorStyle: tileColorStyle,
    jointType,
    tileBrand: tileBrand || undefined
  }), [tileSize, tileMaterial, tileFinish, tileColorStyle, jointType, tileBrand])

  const currentMicroSpecs: MicrocementSpecs = useMemo(() => ({
    system: microSystem,
    systemLabel: microSystem === 'shower_waterproof' ? 'Veekindel dušisüsteem' : 'Standard 2-kihiline',
    finish: microFinish,
    colorTone: microColorTone,
    texture: microTexture
  }), [microSystem, microFinish, microColorTone, microTexture])

  // Reaalajas letihinna kalkulatsioon
  const liveEstimate = useMemo(() => {
    return calculateAIEstimate(serviceType, currentScope, currentTileSpecs, currentMicroSpecs, systemBrand)
  }, [serviceType, currentScope, currentTileSpecs, currentMicroSpecs, systemBrand])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const newFiles: UploadedFile[] = Array.from(e.target.files).map(f => ({
      name: f.name,
      size: f.size,
      type: f.type
    }))
    setFiles(prev => [...prev, ...newFiles])
  }

  const handleSubmit = async () => {
    setSubmitError('')

    if (timeline === 'just_browsing') {
      setBrowsingSummaryOpen(true)
      return
    }

    if (!clientPhone || clientPhone.trim().length < 6) {
      setSubmitError('Palun sisesta kehtiv telefoninumber, et meistrid saaksid objekti ülevaatuse kokku leppida.')
      return
    }

    if (!budgetConfirmed) {
      setSubmitError('Palun kinnita enne saatmist, et oled tutvunud orienteeruva turuhinnaga.')
      return
    }

    setLoading(true)

    const finalEstimate = calculateAIEstimate(serviceType, currentScope, currentTileSpecs, currentMicroSpecs, systemBrand)
    const visualUrls = getAIVisualizations(serviceType, currentTileSpecs, currentMicroSpecs)

    const isB2B = clientType === 'contractor_b2b'
    const projectId = 'proj-' + Date.now()

    const projectTitle = isB2B
      ? `B2B Hange: ${companyName || 'Ehitusobjekt'}`
      : `Viimistlusobjekt (${serviceType === 'mõlemad' ? 'Plaat + Mikrotsement' : serviceType})`

    const newProject: ProjectInquiry = {
      id: projectId,
      createdAt: new Date().toISOString(),
      status: 'pakkumised_avatud',
      clientType,
      companyName: isB2B ? (companyName || 'Peatöövõtja / Arendaja') : undefined,
      isB2BProject: isB2B,
      minTierRequired: isB2B ? 'vip_b2b_2500' : 'free',
      clientName: clientName || (isB2B ? 'B2B Projektijuht' : 'Tellija'),
      clientEmail: clientEmail || 'klient@plaatija24.ee',
      clientPhone: clientPhone || '+372 500 0000',
      city: city || 'Tallinn',
      address,
      roomType: 'objekt',
      roomTypeLabel: projectTitle,
      serviceType,
      timeline,
      systemBrand,
      systemBrandLabel: SYSTEM_BRAND_INFO[systemBrand]?.name || 'Sertifitseeritud süsteem',
      scope: currentScope,
      tileSpecs: (serviceType === 'plaat' || serviceType === 'mõlemad') ? currentTileSpecs : undefined,
      microcementSpecs: (serviceType === 'mikrotsement' || serviceType === 'mõlemad') ? currentMicroSpecs : undefined,
      description: description || `Plaatimis- ja viimistlustööd mahus ${Number(floorArea) + Number(wallArea)} m² (${systemBrand.toUpperCase()} süsteem).`,
      files,
      aiEstimate: finalEstimate,
      aiVisualizations: visualUrls,
      quotesCount: 0
    }

    saveProject(newProject)

    // Saadame taustal e-posti teavituse
    fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'new_inquiry',
        projectId: newProject.id,
        projectTitle: newProject.roomTypeLabel,
        city: newProject.city,
        clientName: newProject.clientName,
        clientEmail: newProject.clientEmail,
        estimatedTotal: newProject.aiEstimate.grossTotal,
      }),
    }).catch(() => {})

    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    router.push(`/request/${projectId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Reklaamibänner päises */}
        <div className="mb-6">
          <AdBanner position="inline" specificBrand={systemBrand !== 'none' ? systemBrand : undefined} />
        </div>

        {/* Pealkiri */}
        <div className="text-center mb-8">
          <span className="text-xs uppercase font-extrabold tracking-wider px-3.5 py-1 bg-blue-100 text-blue-900 border border-blue-200/80 rounded-full">
            Kliendile 100% Tasuta · Kohustusi pole
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-950 mt-3">
            Kirjelda objekti & koosta esialgne AI pakkumine
          </h1>
          <p className="text-gray-500 text-sm mt-1 max-w-xl mx-auto">
            Laadi üles fotod, joonised või mahutabel ning kirjelda tehtavaid töid vabas vormis. AI koostab turuhindadel põhineva esialgse eelarve.
          </p>
        </div>

        {/* Sammude indikaator */}
        <div className="flex items-center justify-between mb-8 max-w-2xl mx-auto">
          {[
            { s: 1, label: 'Objekt, Kirjeldus & Failid' },
            { s: 2, label: 'Süsteem & Töölõigud' },
            { s: 3, label: 'Plaadid & Viimistlus' },
            { s: 4, label: 'Kontakt & Kinnitus' },
          ].map((item) => (
            <div key={item.s} className="flex flex-col items-center flex-1">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  step >= item.s
                    ? 'text-white shadow-md'
                    : 'bg-gray-200 text-gray-400'
                }`}
                style={step >= item.s ? { backgroundColor: 'var(--color-brand-500)' } : {}}
              >
                {step > item.s ? '✓' : item.s}
              </div>
              <span className={`text-[11px] font-semibold mt-1.5 text-center ${
                step >= item.s ? 'text-gray-900' : 'text-gray-400'
              }`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Peamine paigutus kahe veeruga */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-6">
            <div className="card shadow-sm border border-gray-100 p-6 sm:p-7">
              
              {/* SAMM 1: Teenus, Kirjeldus vabas vormis & Failide üleslaadimine */}
              {step === 1 && (
                <div className="space-y-6">
                  
                  {/* Tellija staatus */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      Tellija staatus
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setClientType('private')}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          clientType === 'private'
                            ? 'border-blue-600 bg-blue-50/70 shadow-xs'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="text-xl mb-1">🏠</div>
                        <div className="text-xs font-bold text-gray-900">Eraisik (Erakodu)</div>
                        <div className="text-[11px] text-gray-500 mt-0.5">Korter, eramu, vannituba jms</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setClientType('contractor_b2b')}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          clientType === 'contractor_b2b'
                            ? 'border-gray-950 bg-gray-950 text-white shadow-xs'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="text-xl mb-1">🏢</div>
                        <div className={`text-xs font-bold flex items-center gap-1 ${clientType === 'contractor_b2b' ? 'text-white' : 'text-gray-900'}`}>
                          Peatöövõtja / Arendaja <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.2 rounded font-bold">B2B</span>
                        </div>
                        <div className={`text-[11px] mt-0.5 ${clientType === 'contractor_b2b' ? 'text-gray-300' : 'text-gray-500'}`}>Korterelamud, äripinnad, allhanked</div>
                      </button>
                    </div>

                    {clientType === 'contractor_b2b' && (
                      <div className="mt-3 p-3 bg-blue-50/60 border border-blue-200 rounded-xl">
                        <label className="block text-[11px] font-bold text-blue-900 mb-1">Ettevõtte / Peatöövõtja nimi</label>
                        <input
                          type="text"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="nt Merko Ehitus, Nordecon, YIT jne"
                          className="input bg-white text-xs font-semibold"
                        />
                      </div>
                    )}
                  </div>

                  {/* Teenuse liik */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Teenuse liik</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'plaat', label: 'Plaatimine', icon: '🧱', desc: 'Keraamika, portselan, marmor' },
                        { id: 'mikrotsement', label: 'Mikrotsement', icon: '🎨', desc: 'Sujuv vuugivaba viimistlus' },
                        { id: 'mõlemad', label: 'Mõlemad', icon: '✨', desc: 'Kombineeritud lahendus' },
                      ].map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => handleSelectServiceType(t.id as ServiceType)}
                          className={`p-3.5 rounded-xl border-2 text-left transition-all ${
                            serviceType === t.id
                              ? 'border-blue-600 bg-blue-50/70 shadow-xs'
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                        >
                          <div className="text-2xl mb-1">{t.icon}</div>
                          <div className="text-xs font-bold text-gray-900">{t.label}</div>
                          <div className="text-[10px] text-gray-500 mt-0.5">{t.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* FOTOD, JOONISED & MAHUTABELID (Juba kohe 1. sammus!) */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                        📁 Laadi üles fotod, joonised ja mahutabelid
                      </label>
                      <span className="text-[11px] text-blue-700 font-semibold">JPG, PNG, PDF, Excel</span>
                    </div>

                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDragOver(false);
                        if (e.dataTransfer.files) {
                          const dropped: UploadedFile[] = Array.from(e.dataTransfer.files).map(f => ({
                            name: f.name,
                            size: f.size,
                            type: f.type
                          }))
                          setFiles(prev => [...prev, ...dropped])
                        }
                      }}
                      className={`border-2 border-dashed rounded-2xl p-7 text-center cursor-pointer transition-all ${
                        dragOver ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-blue-500 bg-gray-50/60'
                      }`}
                    >
                      <div className="text-3xl mb-2">📸 📄 📊</div>
                      <p className="text-sm font-bold text-gray-900">
                        Lohista failid siia või <span style={{ color: 'var(--color-brand-600)' }} className="underline">kliki valimiseks</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
                        Lisa fotod olemasolevast ruumist, arhitekti joonised (PDF) või Exceli mahutabelid.
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*,.pdf,.xlsx,.xls,.dwg"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>

                    {files.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {files.map((file, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-xs bg-white border border-gray-200 px-3 py-1.5 rounded-xl shadow-2xs">
                            <span>📎</span>
                            <span className="font-semibold text-gray-800">{file.name}</span>
                            <span className="text-[10px] text-gray-400">({Math.round(file.size / 1024)} KB)</span>
                            <button
                              type="button"
                              onClick={() => setFiles(files.filter((_, i) => i !== idx))}
                              className="text-gray-400 hover:text-red-500 ml-1.5 font-bold text-sm"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* OBJEKTI JA TEHTAVATE TÖÖDE KIRJELDUS VABAS VORMIS */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Objekti ja tehtavate tööde kirjeldus vabas vormis *
                    </label>
                    <textarea
                      rows={5}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Kirjelda vabas vormis oma objekti: nt vannitoa või terve korteri renoveerimine, ruumide mõõdud, aluspinna seisukord (nt betoon, kips), soovitud plaadid, kallete tegemine, trapid, eritööd või eelistatud algusaeg..."
                      className="input text-xs sm:text-sm resize-none leading-relaxed"
                    />
                    <div className="flex items-center justify-between text-[11px] text-gray-400 mt-1">
                      <span>Mida põhjalikumalt kirjeldad, seda täpsema pakkumise meistrid teevad</span>
                      <span>{description.length} tähemärki</span>
                    </div>
                  </div>

                  {/* Esialgsed pinnad ja mõõdud */}
                  <div className="p-4 sm:p-5 bg-gray-50/70 rounded-2xl border border-gray-200 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider">
                        Pinnad ja esialgsed mahud (kui on teada)
                      </label>
                      <span className="text-[11px] text-gray-500 font-medium">
                        Kogu ruumi mõõdud ja viimistlusmaterjalide jaotus
                      </span>
                    </div>

                    {/* Kogumahud */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <span className="text-xs text-gray-600 block mb-1 font-medium">Põranda kogupind (m²)</span>
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          value={floorArea}
                          onChange={(e) => handleUpdateTotalFloor(parseFloat(e.target.value) || 0)}
                          className="input font-bold text-gray-900 bg-white"
                        />
                      </div>
                      <div>
                        <span className="text-xs text-gray-600 block mb-1 font-medium">Seinte kogupind (m²)</span>
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          value={wallArea}
                          onChange={(e) => handleUpdateTotalWall(parseFloat(e.target.value) || 0)}
                          className="input font-bold text-gray-900 bg-white"
                        />
                      </div>
                      <div>
                        <span className="text-xs text-gray-600 block mb-1 font-medium">Ruumi kõrgus (m)</span>
                        <input
                          type="number"
                          step="0.1"
                          min="1"
                          value={wallHeight}
                          onChange={(e) => setWallHeight(parseFloat(e.target.value) || 2.5)}
                          className="input font-bold text-gray-900 bg-white"
                        />
                      </div>
                      <div>
                        <span className="text-xs text-gray-600 block mb-1 font-medium">Perimeeter (jm)</span>
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          value={perimeter}
                          onChange={(e) => setPerimeter(parseFloat(e.target.value) || 0)}
                          className="input font-bold text-gray-900 bg-white"
                        />
                      </div>
                    </div>

                    {/* ERALDI JAOTUS: SEINAD JA PÕRAND (PLAAT VS MIKROTSEMENT) */}
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                        <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5 uppercase tracking-wider">
                          <span>🔀</span>
                          <span>Pinnakatete jaotus: Plaatimine vs Mikrotsement</span>
                        </span>
                        {((tileWallArea > 0 && microWallArea > 0) || (tileFloorArea > 0 && microFloorArea > 0)) && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 self-start sm:self-auto">
                            ✨ Kombineeritud lahendus aktiivne
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 mb-3">
                        Täida need väljad, kui ruumis kombineeritakse plaati ja mikrotsementi (nt märgala / dušinurk plaaditud, ülejäänud seinad mikrotsement).
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {/* SEINAD */}
                        <div className="p-3.5 bg-white rounded-xl border border-gray-200 shadow-2xs space-y-2.5">
                          <div className="flex items-center justify-between pb-1 border-b border-gray-100">
                            <span className="text-xs font-bold text-gray-900 flex items-center gap-1">
                              <span>🧱</span>
                              <span>Seinte viimistlusjaotus</span>
                            </span>
                            <span className="text-[11px] font-mono font-semibold text-gray-500">
                              Kokku: {wallArea} m²
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2.5">
                            <div className="bg-blue-50/40 p-2.5 rounded-lg border border-blue-100">
                              <span className="text-[11px] font-bold text-blue-950 block mb-1">
                                Seinad: plaatimine
                              </span>
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  step="0.5"
                                  min="0"
                                  value={tileWallArea}
                                  onChange={(e) => handleUpdateTileWall(parseFloat(e.target.value) || 0)}
                                  className="w-full px-2 py-1.5 border border-gray-300 rounded font-bold text-sm text-right text-gray-900 bg-white focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="text-xs font-semibold text-gray-500">m²</span>
                              </div>
                              <span className="text-[10px] text-gray-500 block mt-1">nt dušinurk / märgala</span>
                            </div>

                            <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                              <span className="text-[11px] font-bold text-gray-900 block mb-1">
                                Seinad: mikrotsement
                              </span>
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  step="0.5"
                                  min="0"
                                  value={microWallArea}
                                  onChange={(e) => handleUpdateMicroWall(parseFloat(e.target.value) || 0)}
                                  className="w-full px-2 py-1.5 border border-gray-300 rounded font-bold text-sm text-right text-gray-900 bg-white focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="text-xs font-semibold text-gray-500">m²</span>
                              </div>
                              <span className="text-[10px] text-gray-500 block mt-1">nt kuivemad seinapinnad</span>
                            </div>
                          </div>
                        </div>

                        {/* PÕRAND */}
                        <div className="p-3.5 bg-white rounded-xl border border-gray-200 shadow-2xs space-y-2.5">
                          <div className="flex items-center justify-between pb-1 border-b border-gray-100">
                            <span className="text-xs font-bold text-gray-900 flex items-center gap-1">
                              <span>🎨</span>
                              <span>Põranda viimistlusjaotus</span>
                            </span>
                            <span className="text-[11px] font-mono font-semibold text-gray-500">
                              Kokku: {floorArea} m²
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2.5">
                            <div className="bg-blue-50/40 p-2.5 rounded-lg border border-blue-100">
                              <span className="text-[11px] font-bold text-blue-950 block mb-1">
                                Põrand: plaatimine
                              </span>
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  step="0.5"
                                  min="0"
                                  value={tileFloorArea}
                                  onChange={(e) => handleUpdateTileFloor(parseFloat(e.target.value) || 0)}
                                  className="w-full px-2 py-1.5 border border-gray-300 rounded font-bold text-sm text-right text-gray-900 bg-white focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="text-xs font-semibold text-gray-500">m²</span>
                              </div>
                              <span className="text-[10px] text-gray-500 block mt-1">nt keraamiline plaat</span>
                            </div>

                            <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                              <span className="text-[11px] font-bold text-gray-900 block mb-1">
                                Põrand: mikrotsement
                              </span>
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  step="0.5"
                                  min="0"
                                  value={microFloorArea}
                                  onChange={(e) => handleUpdateMicroFloor(parseFloat(e.target.value) || 0)}
                                  className="w-full px-2 py-1.5 border border-gray-300 rounded font-bold text-sm text-right text-gray-900 bg-white focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="text-xs font-semibold text-gray-500">m²</span>
                              </div>
                              <span className="text-[10px] text-gray-500 block mt-1">nt vuugivaba põrand</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="btn-primary py-3 px-8 text-sm font-bold shadow-md"
                    >
                      Edasi: Süsteem & Töölõigud →
                    </button>
                  </div>

                </div>
              )}

              {/* SAMM 2: Süsteem & Mahutabel */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">2. Süsteemi valik & Töölõigud</h2>
                    <p className="text-xs text-gray-500">Vali eelistatud ehitussüsteem või jäta valik meistrile</p>
                  </div>

                  {/* SÜSTEEMI VALIK */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      Ehitussüsteemi / Tootja eelistus
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {SYSTEM_BRANDS.map(b => (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => setSystemBrand(b.id)}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            systemBrand === b.id
                              ? 'border-blue-600 bg-blue-50/80 shadow-xs ring-1 ring-blue-500'
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-lg">{b.flag}</span>
                            <span className={`text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                              systemBrand === b.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {b.label}
                            </span>
                          </div>
                          <div className="text-[11px] text-gray-500 leading-tight mt-1">
                            {b.desc}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Ettevalmistus */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={levelingRequired}
                        onChange={(e) => setLevelingRequired(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <div>
                        <div className="text-xs font-bold text-gray-900">Aluspinna tasandus & kruntimine</div>
                        <div className="text-[11px] text-gray-500">Süvanakkekrunt + kiirkõvenev tasandussegu</div>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={demolitionRequired}
                        onChange={(e) => setDemolitionRequired(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <div>
                        <div className="text-xs font-bold text-gray-900">Vana katte lammutus / eemaldus</div>
                        <div className="text-[11px] text-gray-500">Plaatide piikamine ja utiliseerimine</div>
                      </div>
                    </label>
                  </div>

                  {/* Täpsemad töölõigud */}
                  <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Detailne mahutabel
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between text-xs text-gray-700 mb-1">
                          <span className="font-semibold">Hüdroisolatsiooni maht:</span>
                          <span className="font-bold text-blue-700">{waterproofingArea} m²</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="60"
                          value={waterproofingArea}
                          onChange={(e) => setWaterproofingArea(parseInt(e.target.value) || 0)}
                          className="w-full accent-blue-600"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs text-gray-700 mb-1">
                          <span className="font-semibold">45° välisnurgad (jiirid):</span>
                          <span className="font-bold text-blue-700">{corners45degCount} jm</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="20"
                          value={corners45degCount}
                          onChange={(e) => setCorners45degCount(parseInt(e.target.value) || 0)}
                          className="w-full accent-blue-600"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs text-gray-700 mb-1">
                          <span className="font-semibold">Seinanišid ja riiulid:</span>
                          <span className="font-bold text-blue-700">{nichesCount} tk</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="6"
                          value={nichesCount}
                          onChange={(e) => setNichesCount(parseInt(e.target.value) || 0)}
                          className="w-full accent-blue-600"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs text-gray-700 mb-1">
                          <span className="font-semibold">Trapikraed ja rennid:</span>
                          <span className="font-bold text-blue-700">{drainsCount} tk</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="4"
                          value={drainsCount}
                          onChange={(e) => setDrainsCount(parseInt(e.target.value) || 0)}
                          className="w-full accent-blue-600"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="btn-secondary py-2 px-5 text-sm"
                    >
                      ← Tagasi
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="btn-primary py-2.5 px-6 text-sm"
                    >
                      Edasi: Plaadid & Viimistlus →
                    </button>
                  </div>
                </div>
              )}

              {/* SAMM 3: Plaadid & Viimistlus */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">3. Plaatide & Mikrotsemendi spetsifikatsioon</h2>
                    <p className="text-xs text-gray-500">Täpsed plaadi andmed võimaldavad AI-l luua fotorealistlikud pildid</p>
                  </div>

                  {(serviceType === 'plaat' || serviceType === 'mõlemad') && (
                    <div className="space-y-4 p-4 rounded-xl bg-orange-50/40 border border-orange-200/60">
                      <div className="text-xs font-bold text-orange-950 uppercase tracking-wider flex items-center gap-1.5">
                        <span>🧱</span> Plaatide andmed
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Plaadi formaat</label>
                          <select
                            value={tileSize}
                            onChange={(e) => setTileSize(e.target.value as TileSpecs['size'])}
                            className="input bg-white text-xs font-semibold"
                          >
                            {TILE_SIZES.map(s => (
                              <option key={s.id} value={s.id}>{s.label}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Pinnaviimistlus</label>
                          <select
                            value={tileFinish}
                            onChange={(e) => setTileFinish(e.target.value as TileSpecs['finish'])}
                            className="input bg-white text-xs"
                          >
                            <option value="matt">Matt (libisemiskindel)</option>
                            <option value="läikiv">Kõrgläige</option>
                            <option value="poolmatt">Poolmatt / Satin</option>
                            <option value="struktureeritud">Struktuurne kiviimitatsioon</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Plaadi stiil / toon / muster</label>
                        <input
                          type="text"
                          value={tileColorStyle}
                          onChange={(e) => setTileColorStyle(e.target.value)}
                          placeholder="nt Valge Carrara marmor või Tumehall kiltkivi"
                          className="input bg-white text-xs"
                        />
                      </div>
                    </div>
                  )}

                  {(serviceType === 'mikrotsement' || serviceType === 'mõlemad') && (
                    <div className="space-y-4 p-4 rounded-xl bg-blue-50/50 border border-blue-200/70">
                      <div className="text-xs font-bold text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
                        <span>🎨</span> Mikrotsemendi spetsifikatsioon
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Mikrotsemendi toon</label>
                          <input
                            type="text"
                            value={microColorTone}
                            onChange={(e) => setMicroColorTone(e.target.value)}
                            placeholder="nt Soe liivakarva beež või Helehall"
                            className="input bg-white text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Kaitsekiht & läige</label>
                          <select
                            value={microFinish}
                            onChange={(e) => setMicroFinish(e.target.value as MicrocementSpecs['finish'])}
                            className="input bg-white text-xs"
                          >
                            <option value="siidjas">Siidjasmatt (Soovitatav)</option>
                            <option value="matt">Sügavmatt</option>
                            <option value="läikiv">Läikiv 2K PU lakk</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="btn-secondary py-2 px-5 text-sm"
                    >
                      ← Tagasi
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(4)}
                      className="btn-primary py-2.5 px-6 text-sm"
                    >
                      Edasi: Kontakt & Kinnitus →
                    </button>
                  </div>
                </div>
              )}

              {/* SAMM 4: Kontakt ja kinnitus */}
              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">4. Kontaktandmed ja kinnitus</h2>
                    <p className="text-xs text-gray-500">Pakkumised ja plaatijate sõnumid saadetakse teie kontaktidele</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Teie nimi *</label>
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="nt Martin Kukk"
                        className="input text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">E-post *</label>
                      <input
                        type="email"
                        required
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        placeholder="nt martin@kodu.ee"
                        className="input text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Telefoninumber {timeline !== 'just_browsing' && '*'}
                      </label>
                      <input
                        type="tel"
                        required={timeline !== 'just_browsing'}
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        placeholder="+372 5xx xxxxx"
                        className="input text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Piirkond / Maakond *</label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="input text-xs font-semibold bg-white"
                      >
                        {ESTONIAN_REGIONS.map(r => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Tööde algusaeg ja valmisoleku filter */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Millal plaanite töödega alustada? *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {[
                        { id: 'urgent_1_month', label: '🔥 Kohe / 1 kuu jooksul', desc: 'Saadetakse meistritele eelisjärjekorras' },
                        { id: 'planned_1_3_months', label: '📅 1–3 kuu jooksul', desc: 'Planeeritud ehitus, ootan pakkumisi' },
                        { id: 'just_browsing', label: '👀 Alles uurin hindu', desc: 'Vaatan vaid AI hinnakalkulatsiooni' },
                      ].map(opt => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setTimeline(opt.id as typeof timeline)
                            setBrowsingSummaryOpen(false)
                            setSubmitError('')
                          }}
                          className={`p-3 rounded-xl border-2 text-left transition-all ${
                            timeline === opt.id
                              ? 'border-blue-600 bg-blue-50/70'
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                        >
                          <div className="text-xs font-bold text-gray-900">{opt.label}</div>
                          <div className="text-[10px] text-gray-500 mt-0.5">{opt.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2 text-xs">
                    <div className="font-bold text-gray-900 text-sm">📋 Objekti kokkuvõte:</div>
                    <div className="grid grid-cols-2 gap-2 text-gray-600">
                      <div>🏠 Tellija: <span className="font-semibold text-gray-800">{clientType === 'contractor_b2b' ? `Peatöövõtja (${companyName || 'B2B'})` : 'Eraisik'}</span></div>
                      <div>🧱 Süsteem: <span className="font-bold text-blue-700">{SYSTEM_BRAND_INFO[systemBrand]?.name}</span></div>
                      <div>📏 Pindala: <span className="font-semibold text-gray-800">{Number(floorArea) + Number(wallArea)} m²</span></div>
                      <div>📎 Lisatud faile: <span className="font-semibold text-gray-800">{files.length} tk</span></div>
                    </div>
                  </div>

                  {timeline !== 'just_browsing' && (
                    <label className="flex items-start gap-2.5 p-3.5 rounded-xl bg-blue-50/50 border border-blue-200 cursor-pointer text-xs text-gray-800">
                      <input
                        type="checkbox"
                        checked={budgetConfirmed}
                        onChange={(e) => setBudgetConfirmed(e.target.checked)}
                        className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span>
                        Kinnitan, et olen tutvunud orienteeruva turuhinnaga (<strong>~{liveEstimate.grossTotal.toLocaleString('et-EE')} €</strong> KM-ga) ja soovin saada sellele tööle reaalseid hinnapakkumisi.
                      </span>
                    </label>
                  )}

                  {submitError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
                      ⚠️ {submitError}
                    </div>
                  )}

                  {browsingSummaryOpen && (
                    <div className="p-5 rounded-2xl bg-blue-50 border-2 border-blue-400 space-y-3">
                      <div className="font-extrabold text-blue-950 text-sm">
                        📊 Sinu AI hinnaprognoos on valmis (meistrite töölauale ei saadetud)
                      </div>
                      <p className="text-xs text-blue-900">
                        Orienteeruv eelarve on <strong>{liveEstimate.priceRange.min.toLocaleString('et-EE')} – {liveEstimate.priceRange.max.toLocaleString('et-EE')} €</strong> (töö ~{liveEstimate.laborSubtotal.toLocaleString('et-EE')} €, materjal ~{liveEstimate.materialSubtotal.toLocaleString('et-EE')} €, kestus u {liveEstimate.estimatedDays} tööpäeva).
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setTimeline('planned_1_3_months')
                          setBrowsingSummaryOpen(false)
                        }}
                        className="btn-primary py-2 px-5 text-xs font-bold"
                      >
                        Soovin siiski meistritelt pakkumisi saada →
                      </button>
                    </div>
                  )}

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="btn-secondary py-2 px-5 text-sm"
                    >
                      ← Tagasi
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={loading}
                      className="btn-primary py-3 px-8 text-sm font-bold shadow-md"
                    >
                      {loading
                        ? '⏳ Koostan AI pakkumist ja pilte...'
                        : timeline === 'just_browsing'
                        ? '📊 Kuva täpne AI hinnaprognoos'
                        : '🤖 Avalda päring ja saa pakkumised →'}
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Parempoolne külgriba */}
          <div className="space-y-4">
            <div className="card border border-blue-200/80 bg-gradient-to-b from-blue-50/40 via-white to-white p-5 sticky top-24">
              
              <div className="flex items-center justify-between pb-3 border-b border-blue-100">
                <span className="text-xs font-extrabold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                  <span>⚡</span> AI Hinnaprognoos
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                  {SYSTEM_BRAND_INFO[systemBrand]?.name.split(' ')[0]}
                </span>
              </div>

              <div className="py-4">
                <div className="text-xs text-gray-500">Esialgne eeldatav kogumaksumus:</div>
                <div className="text-2xl font-black text-gray-900 mt-1">
                  ~{liveEstimate.grossTotal.toLocaleString('et-EE')} €
                  <span className="text-xs font-normal text-gray-400 ml-1">(KM-ga)</span>
                </div>
                <div className="text-[11px] font-medium text-blue-700 mt-1">
                  Vahemik: {liveEstimate.priceRange.min.toLocaleString('et-EE')} – {liveEstimate.priceRange.max.toLocaleString('et-EE')} €
                </div>
              </div>

              <div className="space-y-2 py-3 border-t border-gray-100 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Tööde turuhind:</span>
                  <span className="font-semibold text-gray-900">{liveEstimate.laborSubtotal.toLocaleString('et-EE')} €</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Süsteemi materjalid:</span>
                  <span className="font-semibold text-gray-900">{liveEstimate.materialSubtotal.toLocaleString('et-EE')} €</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tööde kestus:</span>
                  <span className="font-semibold text-gray-900">~{liveEstimate.estimatedDays} tööpäeva</span>
                </div>
              </div>

              {/* Eelvaade pildist */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <span>🖼️</span> AI visualiseerimise näidis:
                </div>
                <div className="rounded-lg overflow-hidden border border-gray-200 relative h-36 bg-gray-100">
                  <img
                    src={getAIVisualizations(serviceType, currentTileSpecs, currentMicroSpecs)[0]}
                    alt="AI Visualiseering"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2.5">
                    <span className="text-white text-[11px] font-medium leading-tight line-clamp-2">
                      {tileColorStyle || microColorTone}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
