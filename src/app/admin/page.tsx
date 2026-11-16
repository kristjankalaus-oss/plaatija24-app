'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import {
  getAdminProducts,
  saveAdminProducts,
  getAds,
  saveAds,
  getPricingPlans,
  savePricingPlans,
  getTilers,
  updateTilerProfile,
  getProjects,
  getPricingRules,
  savePricingRules,
  resetPricingRules,
  getFeedbacks,
  resolveFeedback
} from '@/lib/data-store'
import {
  AdminProduct,
  AdBanner,
  PricingPlan,
  TilerProfile,
  ProjectInquiry,
  SystemBrand,
  SubscriptionTier,
  WorkPricingRule,
  PlatformFeedback
} from '@/types'
import { calculateAIEstimate } from '@/lib/pricing-calculator'
import { useAuth } from '@/lib/useAuth'

export default function AdminPage() {
  const { role, loading: authLoading } = useAuth()
  const [adminUnlocked, setAdminUnlocked] = useState(false)
  const [adminPass, setAdminPass] = useState('')
  const [adminAuthError, setAdminAuthError] = useState('')

  const [activeTab, setActiveTab] = useState<'overview' | 'pricing' | 'products' | 'clients' | 'plans' | 'ads' | 'feedback'>('overview')

  // Andmed
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [ads, setAds] = useState<AdBanner[]>([])
  const [plans, setPlans] = useState<PricingPlan[]>([])
  const [tilers, setTilers] = useState<TilerProfile[]>([])
  const [projects, setProjects] = useState<ProjectInquiry[]>([])
  const [pricingRules, setPricingRules] = useState<WorkPricingRule[]>([])
  const [feedbacks, setFeedbacks] = useState<PlatformFeedback[]>([])
  const [notice, setNotice] = useState<string>('')

  // Simulaatori state
  const [simService, setSimService] = useState<'plaat' | 'mikrotsement' | 'mõlemad'>('plaat')
  const [simTileSize, setSimTileSize] = useState<'standard_60x60' | 'large_60x120' | 'mosaic' | 'herringbone' | 'slab_large'>('standard_60x60')
  const [simFloorArea, setSimFloorArea] = useState<number>(5)
  const [simWallArea, setSimWallArea] = useState<number>(18)
  const [simHydro, setSimHydro] = useState<boolean>(true)
  const [simDemo, setSimDemo] = useState<boolean>(true)
  const [simCorners, setSimCorners] = useState<number>(4)
  const [simNiches, setSimNiches] = useState<number>(1)
  const [simDrains, setSimDrains] = useState<number>(1)

  // Uue toote vorm
  const [newProdBrand, setNewProdBrand] = useState<SystemBrand>('mira')
  const [newProdCategory, setNewProdCategory] = useState<AdminProduct['category']>('plaadiliim')
  const [newProdName, setNewProdName] = useState('')
  const [newProdUnit, setNewProdUnit] = useState<AdminProduct['unit']>('kott')
  const [newProdPrice, setNewProdPrice] = useState<number>(24.50)
  const [newProdDesc, setNewProdDesc] = useState('')

  // Uue kliendi vorm
  const [newClientName, setNewClientName] = useState('')
  const [newClientCompany, setNewClientCompany] = useState('')
  const [newClientEmail, setNewClientEmail] = useState('')
  const [newClientPhone, setNewClientPhone] = useState('')
  const [newClientCity, setNewClientCity] = useState('Tallinn')
  const [newClientType, setNewClientType] = useState<'private' | 'contractor_b2b'>('contractor_b2b')

  // Uue reklaami vorm
  const [newAdBrand, setNewAdBrand] = useState('')
  const [newAdTitle, setNewAdTitle] = useState('')
  const [newAdSubtitle, setNewAdSubtitle] = useState('')
  const [newAdUrl, setNewAdUrl] = useState('')
  const [newAdColor, setNewAdColor] = useState('#d97706')

  const refreshAll = () => {
    setProducts(getAdminProducts())
    setAds(getAds())
    setPlans(getPricingPlans())
    setTilers(getTilers())
    setProjects(getProjects())
    setPricingRules(getPricingRules())
    setFeedbacks(getFeedbacks())
  }

  useEffect(() => {
    refreshAll()
  }, [])

  const flashNotice = (msg: string) => {
    setNotice(msg)
    setTimeout(() => setNotice(''), 3500)
  }

  // Turu hinnakirja reeglite haldus
  const handleUpdateRuleLabor = (id: string, val: number) => {
    const updated = pricingRules.map(r => r.id === id ? { ...r, laborPrice: val } : r)
    setPricingRules(updated)
  }

  const handleUpdateRuleMaterial = (id: string, val: number) => {
    const updated = pricingRules.map(r => r.id === id ? { ...r, materialPrice: val } : r)
    setPricingRules(updated)
  }

  const handleUpdateRuleMinFee = (id: string, val: number) => {
    const updated = pricingRules.map(r => r.id === id ? { ...r, minProjectFee: val } : r)
    setPricingRules(updated)
  }

  const handleSaveAllPricingRules = () => {
    savePricingRules(pricingRules)
    flashNotice('✅ 2026 turu hinnakirja reeglid salvestatud ja sünkroonitud!')
  }

  const handleResetPricingRules = () => {
    if (confirm('Kas soovid kindlasti taastada ametlikud 2026. aasta turuhinnad (Topciment Tallinn, Remondisemu, Remonditurg)?')) {
      const reset = resetPricingRules()
      setPricingRules([...reset])
      flashNotice('↺ 2026. aasta turu baashinnad taastatud!')
    }
  }

  // Simulaatori reaalajas arvutus
  const simEstimate = calculateAIEstimate(
    simService,
    {
      floorArea: Number(simFloorArea) || 0,
      wallArea: Number(simWallArea) || 0,
      wallHeight: 2.5,
      perimeter: 9,
      levelingRequired: true,
      waterproofingArea: simHydro ? ((Number(simFloorArea) || 0) + (Number(simWallArea) || 0)) : 0,
      corners45degCount: Number(simCorners) || 0,
      nichesCount: Number(simNiches) || 0,
      drainsCount: Number(simDrains) || 0,
      siliconeLength: 12,
      demolitionRequired: simDemo,
      extras: []
    },
    {
      size: simTileSize,
      sizeLabel: 'Standard 60x60',
      material: 'keraamiline',
      finish: 'matt',
      colorStyle: 'Helesinine marmor',
      jointType: 'cement'
    },
    {
      system: 'shower_waterproof',
      systemLabel: 'Topciment duširuumi süsteem',
      finish: 'matt',
      colorTone: 'Helehall betoon',
      texture: 'peenike_sile'
    },
    'none',
    pricingRules
  )

  // Toote hinna muutmine
  const handleUpdateProductPrice = (id: string, newPrice: number) => {
    const updated = products.map(p => p.id === id ? { ...p, retailPrice: newPrice } : p)
    setProducts(updated)
    saveAdminProducts(updated)
    flashNotice('✅ Toote baashind edukalt uuendatud!')
  }

  // Uue toote lisamine
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProdName) return

    const newProd: AdminProduct = {
      id: 'prod-' + Date.now(),
      brand: newProdBrand,
      category: newProdCategory,
      name: newProdName,
      unit: newProdUnit,
      retailPrice: Number(newProdPrice),
      description: newProdDesc || 'Kvaliteetne ehitustoode',
      inStock: true
    }

    const updated = [newProd, ...products]
    setProducts(updated)
    saveAdminProducts(updated)
    setNewProdName('')
    setNewProdDesc('')
    flashNotice(`✅ Toode "${newProd.name}" lisatud toodete andmebaasi!`)
  }

  // Paketi hinna muutmine
  const handleUpdatePlanPrice = (planId: SubscriptionTier, newPrice: number) => {
    const updated = plans.map(p => p.id === planId ? { ...p, priceMonthly: newPrice } : p)
    setPlans(updated)
    savePricingPlans(updated)
    flashNotice('✅ Tellimuspaketi kuutasu uuendatud!')
  }

  // Meistri paketi muutmine admini poolt
  const handleUpdateTilerTier = (tilerId: string, newTier: SubscriptionTier) => {
    const t = tilers.find(x => x.id === tilerId)
    if (t) {
      t.subscriptionTier = newTier
      t.quotesLimit = newTier === 'free' ? 3 : -1
      updateTilerProfile(t)
      refreshAll()
      flashNotice(`✅ Meistri "${t.companyName}" paketiks määratud: ${newTier}!`)
    }
  }

  // Reklaami toggle
  const handleToggleAd = (id: string) => {
    const updated = ads.map(a => a.id === id ? { ...a, active: !a.active } : a)
    setAds(updated)
    saveAds(updated)
    flashNotice('✅ Reklaamibänneri staatus muudetud!')
  }

  // Uue reklaami lisamine
  const handleAddAd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAdTitle) return

    const newAd: AdBanner = {
      id: 'ad-' + Date.now(),
      brand: newAdBrand,
      title: newAdTitle,
      subtitle: newAdSubtitle || 'Ametlik süsteemipartner',
      tagline: 'Sertifitseeritud lahendused',
      ctaText: 'Vaata lähemalt →',
      targetUrl: newAdUrl || 'https://ehitusmaterjalid.ee',
      imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
      position: 'inline',
      active: true,
      accentColor: newAdColor
    }

    const updated = [newAd, ...ads]
    setAds(updated)
    saveAds(updated)
    setNewAdTitle('')
    setNewAdSubtitle('')
    flashNotice(`✅ Reklaamipartneri "${newAd.brand}" bänner lisatud!`)
  }

  // Statistika
  const proTilersCount = tilers.filter(t => t.subscriptionTier === 'pro_1290').length
  const b2bTilersCount = tilers.filter(t => t.subscriptionTier === 'vip_b2b_2500').length
  const freeTilersCount = tilers.filter(t => t.subscriptionTier === 'free').length
  const monthlySubscriptionRevenue = (proTilersCount * 12.90) + (b2bTilersCount * 49.00)
  const totalVolumeEstimate = projects.reduce((sum, p) => sum + (p.aiEstimate?.grossTotal || 0), 0)

  const handleAdminUnlock = async (e: React.FormEvent) => {
    e.preventDefault()
    setAdminAuthError('')
    try {
      const res = await fetch('/api/auth-gate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPass }),
      })
      if (res.ok) {
        setAdminUnlocked(true)
      } else {
        setAdminAuthError('Vale administraatori parool.')
      }
    } catch {
      setAdminAuthError('Ühenduse viga.')
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8 text-sm text-gray-500 font-semibold">
          ⏳ Kontrollin administraatori ligipääsu...
        </div>
      </div>
    )
  }

  if (role !== 'admin' && !adminUnlocked) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="card p-8 max-w-md w-full border border-gray-200 shadow-lg bg-white space-y-5">
            <div className="text-center">
              <span className="text-4xl block mb-2">🛡️</span>
              <h1 className="text-xl font-black text-gray-950">Administraatori ligipääs</h1>
              <p className="text-xs text-gray-500 mt-1">
                See leht on kaitstud. Logi sisse administraatori kontoga või sisesta haldusparool.
              </p>
            </div>

            {adminAuthError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
                ⚠️ {adminAuthError}
              </div>
            )}

            <form onSubmit={handleAdminUnlock} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Administraatori parool</label>
                <input
                  type="password"
                  required
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  placeholder="Sisesta parool"
                  className="input text-xs"
                />
              </div>
              <button type="submit" className="btn-primary w-full py-2.5 text-xs font-bold justify-center">
                Ava Admin Paneel →
              </button>
            </form>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        
        {/* Admin Header */}
        <div className="bg-gray-950 text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-black uppercase tracking-wider bg-blue-600 text-white px-2.5 py-0.5 rounded-md">
                Administraatori Juhtpaneel
              </span>
              <span className="text-xs text-gray-400">Plaatija24 & Mikrotsement Ärijuhtimine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">Portaali haldus, tooted & tulud</h1>
            <p className="text-xs sm:text-sm text-gray-300 mt-1">
              Muuda baashindu, halda tellimuspakette (12.90 € / 49 €), lisa kliente ja halda reklaamibännereid.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('products')}
              className="px-3.5 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-xs font-bold transition-all border border-gray-700"
            >
              + Lisa toode
            </button>
            <button
              onClick={() => setActiveTab('plans')}
              className="btn-primary py-2 px-4 text-xs font-bold"
            >
              💰 Paketid & Hinnad
            </button>
          </div>
        </div>

        {notice && (
          <div className="mb-6 p-4 bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-bold rounded-xl shadow-xs">
            {notice}
          </div>
        )}

        {/* Tabid */}
        <div className="flex border-b border-gray-200 mb-8 overflow-x-auto text-sm font-semibold">
          {[
            { id: 'overview', label: '📊 Ülevaade & Tulud' },
            { id: 'pricing', label: `🎯 Turu Hinnakiri & AI (${pricingRules.length})` },
            { id: 'products', label: `📦 Tooted & Letihinnad (${products.length})` },
            { id: 'plans', label: '💰 Paketid & Hinnastus (12.90€ / 49€)' },
            { id: 'clients', label: `👥 Meistrid & Peatöövõtjad (${tilers.length})` },
            { id: 'ads', label: `📢 Reklaamibännerid (${ads.length})` },
            { id: 'feedback', label: `💬 Tagasiside & Raportid (${feedbacks.length})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`py-3 px-5 border-b-2 whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'border-blue-600 text-gray-950 font-bold bg-white rounded-t-lg'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: ÜLEVAADE & TULUD */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* KPI Kaardid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="card p-5 border border-emerald-200 bg-emerald-50/40">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                  Kuu korduvtellimuste tulu (MRR)
                </span>
                <div className="text-3xl font-black text-gray-900 mt-2">
                  {monthlySubscriptionRevenue.toFixed(2)} €
                </div>
                <div className="text-[11px] text-emerald-700 mt-1">
                  {proTilersCount} PRO (12.90€) + {b2bTilersCount} B2B (49€)
                </div>
              </div>

              <div className="card p-5 border border-blue-200 bg-blue-50/40">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-900">
                  Aktiivsed Päringud
                </span>
                <div className="text-3xl font-black text-gray-900 mt-2">
                  {projects.length} tk
                </div>
                <div className="text-[11px] text-blue-700 mt-1">
                  Erapäringud ja B2B allhanked
                </div>
              </div>

              <div className="card p-5 border border-blue-200 bg-blue-50/40">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800">
                  Vahendatud objektide maht
                </span>
                <div className="text-3xl font-black text-gray-900 mt-2">
                  ~{Math.round(totalVolumeEstimate).toLocaleString('et-EE')} €
                </div>
                <div className="text-[11px] text-blue-700 mt-1">
                  AI hinnaprognooside koguväärtus
                </div>
              </div>

              <div className="card p-5 border border-purple-200 bg-purple-50/40">
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-800">
                  Reklaamipartnerid
                </span>
                <div className="text-3xl font-black text-gray-900 mt-2">
                  {ads.filter(a => a.active).length} aktiivset
                </div>
                <div className="text-[11px] text-purple-700 mt-1">
                  MIRA, Mapei, Weber jne
                </div>
              </div>
            </div>

            {/* Tulude soovitused ja lisavõimalused */}
            <div className="card p-6 border-2 border-blue-200 bg-gradient-to-r from-blue-50/60 via-white to-slate-50/40">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">💡</span>
                <h3 className="text-lg font-black text-gray-900">
                  Eksperdi soovitused: Kuidas Plaatija24 portaaliga veelgi rohkem teenida
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-700 mt-4">
                <div className="p-4 bg-white rounded-xl border border-blue-200 shadow-2xs space-y-1.5">
                  <span className="font-extrabold text-blue-950 block text-sm">1. Materjalimüügi Partnerlus (Affiliate)</span>
                  <p className="text-gray-600 leading-relaxed">
                    Kuna klient valib süsteemi (MIRA, Mapei, Weber) ja AI arvutab täpsed kogused kottides/liitrites, suuna tellija otse edasimüüja e-poodi (nt Espak, EhituseABC, Decora) ja teeni <strong>3-7% vahendustasu</strong> igalt ostukorvilt.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-blue-200 shadow-2xs space-y-1.5">
                  <span className="font-extrabold text-blue-950 block text-sm">2. Sponsoreeritud Meistrite Esiletõst</span>
                  <p className="text-gray-600 leading-relaxed">
                    Paku meistritele võimalust osta <strong>"Kuu Parim Meister"</strong> bännerit avalehel ja kataloogi tipus (nt <strong>49 €/kuu</strong> lisatasu eest), mis tagab neile esimese kontakti kõigi linna uute päringutega.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-blue-200 shadow-2xs space-y-1.5">
                  <span className="font-extrabold text-blue-950 block text-sm">3. Peatöövõtjate B2B Kuumaks</span>
                  <p className="text-gray-600 leading-relaxed">
                    Peatöövõtjatele ja arendajatele (Merko, YIT) paku <strong>B2B Projektijuhi paketti</strong> (nt 99 €/kuu), millega nad saavad hallata mitut arendust korraga, alla laadida koondtabelid ja leida allhankijad 24h jooksul.
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB: TURU HINNAKIRI & AI REEGLID */}
        {activeTab === 'pricing' && (
          <div className="space-y-8">
            {/* Päisekaart tegevustega */}
            <div className="card p-6 border border-blue-200 bg-gradient-to-r from-blue-50/60 via-white to-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-600 text-white tracking-wide uppercase">
                    Ametlik 2026 Hinnamaatriks
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    Topciment (Ehitus Art Design) · Remondisemu · Remonditurg
                  </span>
                </div>
                <h2 className="text-xl font-black text-gray-950">Turu Hinnakirja & AI Reeglite Haldus</h2>
                <p className="text-xs text-gray-600 mt-1 max-w-2xl">
                  Kõik siin seatud hinnad võetakse reaalajas aluseks klientide ja meistrite AI kalkulatsioonides. Muudatused salvestuvad koheselt.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleResetPricingRules}
                  className="px-4 py-2.5 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold transition-all shadow-2xs"
                >
                  ↺ Taasta 2026 turuhinnad
                </button>
                <button
                  type="button"
                  onClick={handleSaveAllPricingRules}
                  className="btn-primary py-2.5 px-6 text-xs font-bold shadow-md flex items-center gap-2"
                >
                  <span>💾</span>
                  <span>Salvesta hinnakiri</span>
                </button>
              </div>
            </div>

            {/* REAALAJAS KALKULAATORI SIMULAATOR */}
            <div className="card p-6 border border-gray-200 bg-white shadow-xs">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <h3 className="font-extrabold text-gray-950 text-base">⚡ Reaalajas kalkulaatori simulaator</h3>
                </div>
                <span className="text-xs text-gray-500">Testi otse, kuidas sinu seadistatud hinnad töötavad</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Simulaatori sisendid */}
                <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">Teenuse liik</label>
                    <select
                      value={simService}
                      onChange={(e) => setSimService(e.target.value as typeof simService)}
                      className="w-full p-2 border border-gray-300 rounded-lg font-bold bg-white text-gray-900"
                    >
                      <option value="plaat">Plaatimistööd</option>
                      <option value="mikrotsement">Mikrotsement (Topciment)</option>
                      <option value="mõlemad">Mõlemad kombineeritult</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">Plaadi suurus / tüüp</label>
                    <select
                      value={simTileSize}
                      onChange={(e) => setSimTileSize(e.target.value as typeof simTileSize)}
                      className="w-full p-2 border border-gray-300 rounded-lg font-bold bg-white text-gray-900"
                      disabled={simService === 'mikrotsement'}
                    >
                      <option value="standard_60x60">Standard (kuni 60x60)</option>
                      <option value="large_60x120">Suurformaat (60x120)</option>
                      <option value="slab_large">XXL tahvlid (120x240)</option>
                      <option value="herringbone">Kalasaba (herringbone)</option>
                      <option value="mosaic">Mosaiikplaadid</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">Põranda pind (m²)</label>
                    <input
                      type="number"
                      value={simFloorArea}
                      onChange={(e) => setSimFloorArea(Number(e.target.value) || 0)}
                      className="w-full p-2 border border-gray-300 rounded-lg font-bold text-gray-900 text-right"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">Seinte pind (m²)</label>
                    <input
                      type="number"
                      value={simWallArea}
                      onChange={(e) => setSimWallArea(Number(e.target.value) || 0)}
                      className="w-full p-2 border border-gray-300 rounded-lg font-bold text-gray-900 text-right"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">45° Jiirid (jm)</label>
                    <input
                      type="number"
                      value={simCorners}
                      onChange={(e) => setSimCorners(Number(e.target.value) || 0)}
                      className="w-full p-2 border border-gray-300 rounded-lg font-bold text-gray-900 text-right"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">Nišid (tk) / Trapid (tk)</label>
                    <div className="flex gap-1.5">
                      <input
                        type="number"
                        placeholder="Nišid"
                        value={simNiches}
                        onChange={(e) => setSimNiches(Number(e.target.value) || 0)}
                        className="w-1/2 p-2 border border-gray-300 rounded-lg font-bold text-gray-900 text-right"
                      />
                      <input
                        type="number"
                        placeholder="Trapid"
                        value={simDrains}
                        onChange={(e) => setSimDrains(Number(e.target.value) || 0)}
                        className="w-1/2 p-2 border border-gray-300 rounded-lg font-bold text-gray-900 text-right"
                      />
                    </div>
                  </div>

                  <div className="col-span-2 sm:col-span-3 flex items-center gap-6 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-800">
                      <input
                        type="checkbox"
                        checked={simHydro}
                        onChange={(e) => setSimHydro(e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span>Märgruumi hüdroisolatsioon (2 kihti)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-800">
                      <input
                        type="checkbox"
                        checked={simDemo}
                        onChange={(e) => setSimDemo(e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span>Vana plaadi lammutus ja utiliseerimine</span>
                    </label>
                  </div>
                </div>

                {/* Simulaatori arvutustulemus */}
                <div className="lg:col-span-5 bg-gradient-to-br from-gray-900 to-blue-950 text-white p-5 rounded-2xl flex flex-col justify-between shadow-md">
                  <div>
                    <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                      <span className="text-xs uppercase tracking-wider text-blue-300 font-bold">Kalkulaatori eelarve</span>
                      <span className="text-xs bg-blue-500/20 text-blue-200 border border-blue-400/30 px-2 py-0.5 rounded-full font-mono">
                        u {simEstimate.estimatedDays} tööpäeva
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-gray-300">
                      <div className="flex justify-between">
                        <span>Tööde maksumus (KM-ta):</span>
                        <span className="font-mono font-bold text-white">{simEstimate.laborSubtotal.toLocaleString('et-EE')} €</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Materjalide kulu (KM-ta):</span>
                        <span className="font-mono font-bold text-white">{simEstimate.materialSubtotal.toLocaleString('et-EE')} €</span>
                      </div>
                      <div className="flex justify-between border-t border-white/10 pt-1.5">
                        <span>Neto kokku:</span>
                        <span className="font-mono font-bold text-white">{simEstimate.netTotal.toLocaleString('et-EE')} €</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>Käibemaks (22%):</span>
                        <span className="font-mono">{simEstimate.vat.toLocaleString('et-EE')} €</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/15">
                    <span className="text-[11px] text-blue-200 block uppercase font-bold tracking-wider">Kliendi lõpphind (KM-ga):</span>
                    <div className="text-2xl font-black text-white font-mono mt-0.5">
                      {simEstimate.grossTotal.toLocaleString('et-EE')} €
                    </div>
                    <div className="text-xs text-blue-300 mt-1">
                      Turusoovituslik vahemik: <strong>{simEstimate.priceRange.min.toLocaleString('et-EE')} – {simEstimate.priceRange.max.toLocaleString('et-EE')} €</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 1. KATEGOORIA: MIKROTSEMENT (Topciment süsteem) */}
            <div className="card p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-extrabold text-gray-950 text-base flex items-center gap-2">
                    <span>🏛️</span>
                    <span>1. Mikrotsemenditööd (Topciment ametlik süsteem)</span>
                  </h3>
                  <p className="text-xs text-gray-500">Tallinna turuhinnad: seinad alates 75€+KM, põrandad 85€+KM, miinimumtasu alla 10m² pinnale</p>
                </div>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">Topciment partnerlus</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider">
                      <th className="pb-3 w-1/3">Töö nimetus ja kirjeldus</th>
                      <th className="pb-3 text-center">Ühik</th>
                      <th className="pb-3 text-right">Töö hind (€)</th>
                      <th className="pb-3 text-right">Materjalikulu (€)</th>
                      <th className="pb-3 text-right">Minimaaltasu (€)</th>
                      <th className="pb-3 text-center">Olek</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {pricingRules.filter(r => r.category === 'mikrotsement').map(rule => (
                      <tr key={rule.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-3 pr-4">
                          <span className="font-bold text-gray-900 block text-sm">{rule.title}</span>
                          <span className="text-gray-500 text-[11px] block mt-0.5">{rule.description}</span>
                        </td>
                        <td className="py-3 text-center font-mono font-semibold text-gray-600">{rule.unit}</td>
                        <td className="py-3 text-right">
                          <input
                            type="number"
                            step="0.5"
                            value={rule.laborPrice}
                            onChange={(e) => handleUpdateRuleLabor(rule.id, parseFloat(e.target.value) || 0)}
                            className="w-24 px-2.5 py-1.5 border border-gray-300 rounded-lg text-sm text-right font-bold text-gray-900 focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="py-3 text-right">
                          <input
                            type="number"
                            step="0.5"
                            value={rule.materialPrice}
                            onChange={(e) => handleUpdateRuleMaterial(rule.id, parseFloat(e.target.value) || 0)}
                            className="w-24 px-2.5 py-1.5 border border-gray-300 rounded-lg text-sm text-right font-bold text-gray-900 focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="py-3 text-right">
                          {rule.minProjectFee !== undefined ? (
                            <input
                              type="number"
                              step="25"
                              value={rule.minProjectFee}
                              onChange={(e) => handleUpdateRuleMinFee(rule.id, parseFloat(e.target.value) || 0)}
                              className="w-24 px-2.5 py-1.5 border border-blue-300 bg-blue-50/50 rounded-lg text-sm text-right font-bold text-blue-900 focus:ring-2 focus:ring-blue-500"
                            />
                          ) : (
                            <span className="text-gray-400 font-mono">-</span>
                          )}
                        </td>
                        <td className="py-3 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Aktiivne
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 2. KATEGOORIA: PLAATIMISTÖÖD */}
            <div className="card p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-extrabold text-gray-950 text-base flex items-center gap-2">
                    <span>🧱</span>
                    <span>2. Plaatimistööd (Põrandad, seinad, suurformaadid, mustrid)</span>
                  </h3>
                  <p className="text-xs text-gray-500">Remondisemu 2026 turuhinnad: põrand 32–45€, sein 35–50€, suurformaat 50–80€, mosaiik 60–100€</p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">Remondisemu 2026</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider">
                      <th className="pb-3 w-1/3">Töö nimetus ja kirjeldus</th>
                      <th className="pb-3 text-center">Ühik</th>
                      <th className="pb-3 text-right">Töö hind (€)</th>
                      <th className="pb-3 text-right">Liimikulu / m² (€)</th>
                      <th className="pb-3 text-center">Olek</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {pricingRules.filter(r => r.category === 'plaat').map(rule => (
                      <tr key={rule.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-3 pr-4">
                          <span className="font-bold text-gray-900 block text-sm">{rule.title}</span>
                          <span className="text-gray-500 text-[11px] block mt-0.5">{rule.description}</span>
                        </td>
                        <td className="py-3 text-center font-mono font-semibold text-gray-600">{rule.unit}</td>
                        <td className="py-3 text-right">
                          <input
                            type="number"
                            step="0.5"
                            value={rule.laborPrice}
                            onChange={(e) => handleUpdateRuleLabor(rule.id, parseFloat(e.target.value) || 0)}
                            className="w-24 px-2.5 py-1.5 border border-gray-300 rounded-lg text-sm text-right font-bold text-gray-900 focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="py-3 text-right">
                          <input
                            type="number"
                            step="0.5"
                            value={rule.materialPrice}
                            onChange={(e) => handleUpdateRuleMaterial(rule.id, parseFloat(e.target.value) || 0)}
                            className="w-24 px-2.5 py-1.5 border border-gray-300 rounded-lg text-sm text-right font-bold text-gray-900 focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="py-3 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Aktiivne
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 3. KATEGOORIA: MÄRGRUUMI HÜDROISOLATSIOON & ETTEVALMISTUS */}
            <div className="card p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-extrabold text-gray-950 text-base flex items-center gap-2">
                    <span>🛡️</span>
                    <span>3. Märgruumi hüdroisolatsioon & aluspinna ettevalmistus</span>
                  </h3>
                  <p className="text-xs text-gray-500">Märgruumis kohustuslik standard: 2 kihti mastiksit + tugevduslindid ja trapikraed</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider">
                      <th className="pb-3 w-1/3">Töö nimetus ja kirjeldus</th>
                      <th className="pb-3 text-center">Ühik</th>
                      <th className="pb-3 text-right">Töö hind (€)</th>
                      <th className="pb-3 text-right">Materjalikulu (€)</th>
                      <th className="pb-3 text-center">Olek</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {pricingRules.filter(r => r.category === 'ettevalmistus').map(rule => (
                      <tr key={rule.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-3 pr-4">
                          <span className="font-bold text-gray-900 block text-sm">{rule.title}</span>
                          <span className="text-gray-500 text-[11px] block mt-0.5">{rule.description}</span>
                        </td>
                        <td className="py-3 text-center font-mono font-semibold text-gray-600">{rule.unit}</td>
                        <td className="py-3 text-right">
                          <input
                            type="number"
                            step="0.5"
                            value={rule.laborPrice}
                            onChange={(e) => handleUpdateRuleLabor(rule.id, parseFloat(e.target.value) || 0)}
                            className="w-24 px-2.5 py-1.5 border border-gray-300 rounded-lg text-sm text-right font-bold text-gray-900 focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="py-3 text-right">
                          <input
                            type="number"
                            step="0.5"
                            value={rule.materialPrice}
                            onChange={(e) => handleUpdateRuleMaterial(rule.id, parseFloat(e.target.value) || 0)}
                            className="w-24 px-2.5 py-1.5 border border-gray-300 rounded-lg text-sm text-right font-bold text-gray-900 focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="py-3 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Aktiivne
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 4. KATEGOORIA: ERITÖÖD JA DETAILID */}
            <div className="card p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-extrabold text-gray-950 text-base flex items-center gap-2">
                    <span>✨</span>
                    <span>4. Viimistlus, eritööd ja detailid (Jiirid, epoksiid, trapid, nišid)</span>
                  </h3>
                  <p className="text-xs text-gray-500">45° välisnurkade faasimine kivilõikega, renntrapid, veekindlad vuugid ja silikoonid</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider">
                      <th className="pb-3 w-1/3">Töö nimetus ja kirjeldus</th>
                      <th className="pb-3 text-center">Ühik</th>
                      <th className="pb-3 text-right">Töö hind (€)</th>
                      <th className="pb-3 text-right">Materjalikulu (€)</th>
                      <th className="pb-3 text-center">Olek</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {pricingRules.filter(r => r.category === 'viimistlus' || r.category === 'eritoo').map(rule => (
                      <tr key={rule.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-3 pr-4">
                          <span className="font-bold text-gray-900 block text-sm">{rule.title}</span>
                          <span className="text-gray-500 text-[11px] block mt-0.5">{rule.description}</span>
                        </td>
                        <td className="py-3 text-center font-mono font-semibold text-gray-600">{rule.unit}</td>
                        <td className="py-3 text-right">
                          <input
                            type="number"
                            step="0.5"
                            value={rule.laborPrice}
                            onChange={(e) => handleUpdateRuleLabor(rule.id, parseFloat(e.target.value) || 0)}
                            className="w-24 px-2.5 py-1.5 border border-gray-300 rounded-lg text-sm text-right font-bold text-gray-900 focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="py-3 text-right">
                          <input
                            type="number"
                            step="0.5"
                            value={rule.materialPrice}
                            onChange={(e) => handleUpdateRuleMaterial(rule.id, parseFloat(e.target.value) || 0)}
                            className="w-24 px-2.5 py-1.5 border border-gray-300 rounded-lg text-sm text-right font-bold text-gray-900 focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="py-3 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Aktiivne
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Alumine salvestusriba */}
            <div className="flex items-center justify-between p-4 bg-gray-900 text-white rounded-2xl shadow-lg">
              <div className="text-xs text-gray-300">
                Oled teinud hinnakirjas muudatusi? Vajuta salvesta, et need jõustuksid koheselt veebilehel.
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleResetPricingRules}
                  className="px-4 py-2 border border-gray-700 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl text-xs font-bold transition-all"
                >
                  ↺ Lähtesta
                </button>
                <button
                  type="button"
                  onClick={handleSaveAllPricingRules}
                  className="btn-primary py-2 px-6 text-xs font-bold flex items-center gap-2"
                >
                  <span>💾</span>
                  <span>Salvesta kõik hinnad</span>
                </button>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Vasak 7 veergu: Toodete nimekiri ja letihindade muutmine */}
            <div className="lg:col-span-7 space-y-4">
              <div className="card p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">Materjalide baashinnad kalkulaatoris</h3>
                    <p className="text-xs text-gray-500">Need hinnad võetakse arvesse kliendile AI esialgse letihinna koostamisel</p>
                  </div>
                  <span className="text-xs font-bold text-gray-400">{products.length} toodet</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-400 uppercase tracking-wider text-[10px]">
                        <th className="pb-2 font-bold">Toode & Bränd</th>
                        <th className="pb-2 font-bold">Kategooria</th>
                        <th className="pb-2 font-bold text-right">Baashind (€)</th>
                        <th className="pb-2 font-bold text-center">Tegevus</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {products.map(prod => (
                        <tr key={prod.id} className="hover:bg-gray-50">
                          <td className="py-3 pr-2">
                            <div className="font-bold text-gray-900">{prod.name}</div>
                            <div className="text-[10px] text-blue-700 font-semibold uppercase">{prod.brand}</div>
                          </td>
                          <td className="py-3 text-gray-600">
                            {prod.category} ({prod.unit})
                          </td>
                          <td className="py-3 text-right">
                            <input
                              type="number"
                              step="0.10"
                              defaultValue={prod.retailPrice}
                              onBlur={(e) => handleUpdateProductPrice(prod.id, parseFloat(e.target.value) || prod.retailPrice)}
                              className="input w-20 text-right py-1 px-2 font-bold text-xs"
                            />
                          </td>
                          <td className="py-3 text-center">
                            <span className="text-emerald-600 text-xs font-bold">Aktiivne</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Parem 5 veergu: Uue toote lisamine */}
            <div className="lg:col-span-5 space-y-4">
              <div className="card p-6 border-2 border-blue-200 bg-white shadow-xs">
                <h3 className="text-base font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <span>➕</span> Lisa uus toode / materjal
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  Lisatud toode ilmub AI materjalikalkulatsioonis vastava süsteemi valimisel
                </p>

                <form onSubmit={handleAddProduct} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Tootja / Süsteem *
                    </label>
                    <select
                      value={newProdBrand}
                      onChange={(e) => setNewProdBrand(e.target.value as SystemBrand)}
                      className="input text-xs font-semibold"
                    >
                      <option value="mira">MIRA Byggeprodukter</option>
                      <option value="mapei">MAPEI</option>
                      <option value="weber">Saint-Gobain Weber</option>
                      <option value="kiilto">Kiilto Pro</option>
                      <option value="ceresit">Ceresit</option>
                      <option value="none">Üldine ehitustoode</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Kategooria
                    </label>
                    <select
                      value={newProdCategory}
                      onChange={(e) => setNewProdCategory(e.target.value as AdminProduct['category'])}
                      className="input text-xs"
                    >
                      <option value="plaadiliim">Plaadiliim</option>
                      <option value="hüdroisolatsioon">Hüdroisolatsioon</option>
                      <option value="vuugisegu">Vuugisegu</option>
                      <option value="tasandus">Aluspinna tasandus</option>
                      <option value="mikrotsement">Mikrotsemendi süsteem</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Toote nimetus *
                    </label>
                    <input
                      type="text"
                      required
                      value={newProdName}
                      onChange={(e) => setNewProdName(e.target.value)}
                      placeholder="nt Mira 4400 multicoat 15kg"
                      className="input text-xs font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Ühik
                      </label>
                      <select
                        value={newProdUnit}
                        onChange={(e) => setNewProdUnit(e.target.value as AdminProduct['unit'])}
                        className="input text-xs"
                      >
                        <option value="kott">kott</option>
                        <option value="m²">m²</option>
                        <option value="kg">kg</option>
                        <option value="tk">tk</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Baashind (€) *
                      </label>
                      <input
                        type="number"
                        step="0.10"
                        required
                        value={newProdPrice}
                        onChange={(e) => setNewProdPrice(parseFloat(e.target.value) || 0)}
                        className="input text-xs font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Kirjeldus
                    </label>
                    <textarea
                      rows={2}
                      value={newProdDesc}
                      onChange={(e) => setNewProdDesc(e.target.value)}
                      placeholder="Toote omadused, kulu ja kasutusvaldkond..."
                      className="input text-xs resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary w-full justify-center py-2.5 text-xs font-bold shadow-xs"
                  >
                    Salvesta toode andmebaasi
                  </button>
                </form>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: PAKETID & HINNASTUS (12.90€ / 49€) */}
        {activeTab === 'plans' && (
          <div className="space-y-6">
            <div className="card p-6 border border-gray-200">
              <h3 className="font-bold text-gray-900 text-lg mb-1">Tellimuspakettide kuutasude haldus</h3>
              <p className="text-xs text-gray-500 mb-6">
                Siin saad muuta meistritele kehtivaid tellimushindu. Muudatused jõustuvad koheselt.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map(plan => (
                  <div key={plan.id} className="p-5 rounded-2xl border-2 border-gray-200 bg-white space-y-4">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                        {plan.id}
                      </span>
                      <h4 className="font-extrabold text-gray-900 text-base mt-2">{plan.name}</h4>
                      <p className="text-xs text-gray-500">{plan.description}</p>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-xl">
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        Kuutasu (€ / kuu):
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          step="0.10"
                          defaultValue={plan.priceMonthly}
                          onBlur={(e) => handleUpdatePlanPrice(plan.id, parseFloat(e.target.value) || plan.priceMonthly)}
                          className="input font-black text-lg py-1 px-3 w-32"
                        />
                        <span className="text-xs font-semibold text-gray-500">€ / kuu</span>
                      </div>
                    </div>

                    <ul className="text-xs text-gray-600 space-y-1">
                      {plan.features.slice(0, 3).map((f, i) => (
                        <li key={i} className="truncate">✓ {f}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: MEISTRID & KLIENDID */}
        {activeTab === 'clients' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Vasak: Meistrite nimekiri ja pakettide muutmine */}
            <div className="lg:col-span-7 space-y-4">
              <div className="card p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 text-base mb-1">Registreeritud plaatijad ja paketid</h3>
                <p className="text-xs text-gray-500 mb-4">Admin saab vajadusel meistrite pakette käsitsi kohandada</p>

                <div className="divide-y divide-gray-100 text-xs">
                  {tilers.map(t => (
                    <div key={t.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="font-extrabold text-gray-900 text-sm flex items-center gap-1.5">
                          {t.companyName}
                          <span className="text-gray-400 font-normal">({t.name})</span>
                        </div>
                        <div className="text-gray-500 mt-0.5">
                          📍 {t.city} · 📞 {t.phone} · ✉️ {t.email}
                        </div>
                        <div className="text-[11px] text-gray-400 mt-0.5">
                          Pakkumisi tehtud: {t.quotesUsedThisMonth} {t.subscriptionTier === 'free' ? '/ 3' : '(Piiramatu)'}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={t.subscriptionTier}
                          onChange={(e) => handleUpdateTilerTier(t.id, e.target.value as SubscriptionTier)}
                          className="input py-1 px-2.5 text-xs font-bold w-44 bg-white"
                        >
                          <option value="free">Tasuta (3 pakkumist/k)</option>
                          <option value="pro_1290">Meister PRO (12.90 €)</option>
                          <option value="vip_b2b_2500">Peatöövõtjad B2B (49.00 €)</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Parem: Lisa uus klient / peatöövõtja */}
            <div className="lg:col-span-5 space-y-4">
              <div className="card p-6 border-2 border-blue-200 bg-white shadow-xs">
                <h3 className="text-base font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <span>🏢</span> Lisa uus klient / Peatöövõtja
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  Saad adminina lisada uusi tellijaid ja peatöövõtjaid otse süsteemi
                </p>

                <form onSubmit={(e) => {
                  e.preventDefault()
                  flashNotice(`✅ Klient "${newClientName || newClientCompany}" edukalt lisatud!`)
                  setNewClientName('')
                  setNewClientCompany('')
                  setNewClientEmail('')
                }} className="space-y-3 text-xs">
                  
                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Kliendi tüüp
                    </label>
                    <select
                      value={newClientType}
                      onChange={(e) => setNewClientType(e.target.value as typeof newClientType)}
                      className="input text-xs font-bold"
                    >
                      <option value="contractor_b2b">Peatöövõtja / Arendaja (B2B)</option>
                      <option value="private">Eraisik Tellija</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Ettevõtte nimi (Peatöövõtja)
                    </label>
                    <input
                      type="text"
                      value={newClientCompany}
                      onChange={(e) => setNewClientCompany(e.target.value)}
                      placeholder="nt Merko Ehitus, Nordecon jne"
                      className="input text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Kontaktisiku nimi *
                    </label>
                    <input
                      type="text"
                      required
                      value={newClientName}
                      onChange={(e) => setNewClientName(e.target.value)}
                      placeholder="nt Andres Tammur (Projektijuht)"
                      className="input text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                        E-post *
                      </label>
                      <input
                        type="email"
                        required
                        value={newClientEmail}
                        onChange={(e) => setNewClientEmail(e.target.value)}
                        placeholder="andres@ehitus.ee"
                        className="input text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Telefon
                      </label>
                      <input
                        type="tel"
                        value={newClientPhone}
                        onChange={(e) => setNewClientPhone(e.target.value)}
                        placeholder="+372 5xx xxxxx"
                        className="input text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Piirkond / Linn
                    </label>
                    <input
                      type="text"
                      value={newClientCity}
                      onChange={(e) => setNewClientCity(e.target.value)}
                      placeholder="Tallinn"
                      className="input text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary w-full justify-center py-2.5 text-xs font-bold"
                  >
                    Salvesta klient portaali
                  </button>
                </form>
              </div>
            </div>

          </div>
        )}

        {/* TAB 5: REKLAAMIBÄNNERITE HALDUS */}
        {activeTab === 'ads' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Vasak: Bännerite nimekiri */}
            <div className="lg:col-span-7 space-y-4">
              <div className="card p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 text-base mb-1">Portaali reklaamibännerid (Sponsorid)</h3>
                <p className="text-xs text-gray-500 mb-4">
                  Need bännerid ilmuvad päringuvormis, avalehel ja projekti detaillehel
                </p>

                <div className="space-y-3">
                  {ads.map(ad => (
                    <div key={ad.id} className="p-4 rounded-xl border border-gray-200 bg-white flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg text-white font-black text-xs flex items-center justify-center uppercase shadow-2xs"
                          style={{ backgroundColor: ad.accentColor || '#d97706' }}
                        >
                          {ad.brand}
                        </div>
                        <div>
                          <div className="font-extrabold text-gray-900 text-xs">{ad.title}</div>
                          <div className="text-[11px] text-gray-500">{ad.subtitle}</div>
                          <a href={ad.targetUrl} target="_blank" rel="noreferrer" className="text-[10px] text-blue-600 underline">
                            {ad.targetUrl}
                          </a>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleAd(ad.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          ad.active
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {ad.active ? '✓ Aktiivne' : 'Peatatud'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Parem: Lisa uus bänner */}
            <div className="lg:col-span-5 space-y-4">
              <div className="card p-6 border-2 border-blue-200 bg-white shadow-xs">
                <h3 className="text-base font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <span>📢</span> Lisa uus reklaamibänner
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  Müü bänneripinda materjalitootjatele ja ehituskauplustele
                </p>

                <form onSubmit={handleAddAd} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Bränd / Ettevõte *
                    </label>
                    <input
                      type="text"
                      required
                      value={newAdBrand}
                      onChange={(e) => setNewAdBrand(e.target.value)}
                      placeholder="nt MIRA, Mapei, Espak"
                      className="input text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Pealkiri *
                    </label>
                    <input
                      type="text"
                      required
                      value={newAdTitle}
                      onChange={(e) => setNewAdTitle(e.target.value)}
                      placeholder="nt Sertifitseeritud veetõke 10a garantiiga"
                      className="input text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Tekst / Alapealkiri
                    </label>
                    <textarea
                      rows={2}
                      value={newAdSubtitle}
                      onChange={(e) => setNewAdSubtitle(e.target.value)}
                      placeholder="Toote tutvustus või sooduskampaania..."
                      className="input text-xs resize-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Sihtkoha URL (veebilink)
                    </label>
                    <input
                      type="url"
                      value={newAdUrl}
                      onChange={(e) => setNewAdUrl(e.target.value)}
                      placeholder="https://..."
                      className="input text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Brändi tunnusvärv
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={newAdColor}
                        onChange={(e) => setNewAdColor(e.target.value)}
                        className="w-10 h-8 rounded border border-gray-300 cursor-pointer"
                      />
                      <span className="font-mono text-gray-600">{newAdColor}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn-primary w-full justify-center py-2.5 text-xs font-bold"
                  >
                    Aktiveeri reklaamibänner
                  </button>
                </form>
              </div>
            </div>

          </div>
        )}

        {/* TAB: TAGASISIDE & RAPORTID */}
        {activeTab === 'feedback' && (
          <div className="card p-6 border border-gray-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-base">Klientide ja meistrite tagasiside & raportid</h3>
                <p className="text-xs text-gray-500">Siia jõuavad nii klientide hinnangud, ettepanekud kui ka meistrite teated tühjade päringute kohta</p>
              </div>
            </div>

            {feedbacks.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-sm">
                <span className="text-4xl block mb-2">💬</span>
                Hetkel pole veel ühtegi tagasisidet ega raportit saabunud.
              </div>
            ) : (
              <div className="space-y-3">
                {feedbacks.map(fb => (
                  <div key={fb.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1 text-xs">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                          fb.category === 'report_spam_lead'
                            ? 'bg-red-100 text-red-800'
                            : fb.category === 'review_tiler'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {fb.category === 'report_spam_lead' ? '🚩 Libapäringu raport' : fb.category === 'review_tiler' ? `⭐ Hinnang (${fb.rating}/5)` : fb.category}
                        </span>
                        <span className="font-bold text-gray-900">{fb.senderName}</span>
                        <span className="text-gray-400">({fb.senderRole})</span>
                        <span className="text-gray-400">· {new Date(fb.createdAt).toLocaleString('et-EE')}</span>
                      </div>
                      <p className="text-gray-700 text-sm mt-1">{fb.message}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {fb.status === 'lahendatud' ? (
                        <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold">
                          ✓ Lahendatud
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            resolveFeedback(fb.id)
                            refreshAll()
                            flashNotice('✅ Tagasiside märgitud lahendatuks!')
                          }}
                          className="btn-secondary py-1.5 px-3 text-xs font-bold whitespace-nowrap"
                        >
                          Märgi lahendatuks
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  )
}
