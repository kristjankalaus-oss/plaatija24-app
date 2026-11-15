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
  getProjects
} from '@/lib/data-store'
import {
  AdminProduct,
  AdBanner,
  PricingPlan,
  TilerProfile,
  ProjectInquiry,
  SystemBrand,
  SubscriptionTier
} from '@/types'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'clients' | 'plans' | 'ads'>('overview')

  // Andmed
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [ads, setAds] = useState<AdBanner[]>([])
  const [plans, setPlans] = useState<PricingPlan[]>([])
  const [tilers, setTilers] = useState<TilerProfile[]>([])
  const [projects, setProjects] = useState<ProjectInquiry[]>([])
  const [notice, setNotice] = useState<string>('')

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
  const [newAdBrand, setNewAdBrand] = useState('MIRA')
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
  }

  useEffect(() => {
    refreshAll()
  }, [])

  const flashNotice = (msg: string) => {
    setNotice(msg)
    setTimeout(() => setNotice(''), 3500)
  }

  // Toote hinna muutmine
  const handleUpdateProductPrice = (id: string, newPrice: number) => {
    const updated = products.map(p => p.id === id ? { ...p, retailPrice: newPrice } : p)
    setProducts(updated)
    saveAdminProducts(updated)
    flashNotice('✅ Toote letihind edukalt uuendatud!')
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
    flashNotice(`✅ Toode "${newProd.name}" lisatud letihindade andmebaasi!`)
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
  const monthlySubscriptionRevenue = (proTilersCount * 12.90) + (b2bTilersCount * 25.00)
  const totalVolumeEstimate = projects.reduce((sum, p) => sum + (p.aiEstimate?.grossTotal || 0), 0)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        
        {/* Admin Header */}
        <div className="bg-gray-950 text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-black uppercase tracking-wider bg-amber-400 text-gray-950 px-2.5 py-0.5 rounded-md">
                Administraatori Juhtpaneel
              </span>
              <span className="text-xs text-gray-400">Plaatija24 & Mikrotsement Ärijuhtimine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">Portaali haldus, tooted & tulud</h1>
            <p className="text-xs sm:text-sm text-gray-300 mt-1">
              Muuda letihindu, halda tellimuspakette (12.90 € / 25 €), lisa kliente ja halda reklaamibännereid.
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
            { id: 'products', label: `📦 Tooted & Letihinnad (${products.length})` },
            { id: 'plans', label: '💰 Paketid & Hinnastus (12.90€ / 25€)' },
            { id: 'clients', label: `👥 Meistrid & Peatöövõtjad (${tilers.length})` },
            { id: 'ads', label: `📢 Reklaamibännerid (${ads.length})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`py-3 px-5 border-b-2 whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'border-amber-500 text-gray-900 font-bold bg-white rounded-t-lg'
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
                  {proTilersCount} PRO (12.90€) + {b2bTilersCount} B2B (25€)
                </div>
              </div>

              <div className="card p-5 border border-amber-200 bg-amber-50/40">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                  Aktiivsed Päringud
                </span>
                <div className="text-3xl font-black text-gray-900 mt-2">
                  {projects.length} tk
                </div>
                <div className="text-[11px] text-amber-700 mt-1">
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
                  AI letihindade kalkulatsiooni koguväärtus
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
            <div className="card p-6 border-2 border-amber-300 bg-gradient-to-r from-amber-50/60 to-orange-50/40">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">💡</span>
                <h3 className="text-lg font-black text-gray-900">
                  Eksperdi soovitused: Kuidas Plaatija24 portaaliga veelgi rohkem teenida
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-700 mt-4">
                <div className="p-4 bg-white rounded-xl border border-amber-200 shadow-2xs space-y-1.5">
                  <span className="font-extrabold text-amber-900 block text-sm">1. Materjalimüügi Partnerlus (Affiliate)</span>
                  <p className="text-gray-600 leading-relaxed">
                    Kuna klient valib süsteemi (MIRA, Mapei, Weber) ja AI arvutab täpsed kogused kottides/liitrites, suuna tellija otse edasimüüja e-poodi (nt Espak, EhituseABC, Decora) ja teeni <strong>3-7% vahendustasu</strong> igalt ostukorvilt.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-amber-200 shadow-2xs space-y-1.5">
                  <span className="font-extrabold text-amber-900 block text-sm">2. Sponsoreeritud Meistrite Esiletõst</span>
                  <p className="text-gray-600 leading-relaxed">
                    Paku meistritele võimalust osta <strong>"Kuu Parim Meister"</strong> bännerit avalehel ja kataloogi tipus (nt <strong>49 €/kuu</strong> lisatasu eest), mis tagab neile esimese kontakti kõigi linna uute päringutega.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-amber-200 shadow-2xs space-y-1.5">
                  <span className="font-extrabold text-amber-900 block text-sm">3. Peatöövõtjate B2B Kuumaks</span>
                  <p className="text-gray-600 leading-relaxed">
                    Peatöövõtjatele ja arendajatele (Merko, YIT) paku <strong>B2B Projektijuhi paketti</strong> (nt 99 €/kuu), millega nad saavad hallata mitut arendust korraga, alla laadida koondtabelid ja leida allhankijad 24h jooksul.
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: TOOTED & LETIHINNAD */}
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
                        <th className="pb-2 font-bold text-right">Letihind (€)</th>
                        <th className="pb-2 font-bold text-center">Tegevus</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {products.map(prod => (
                        <tr key={prod.id} className="hover:bg-gray-50">
                          <td className="py-3 pr-2">
                            <div className="font-bold text-gray-900">{prod.name}</div>
                            <div className="text-[10px] text-amber-700 font-semibold uppercase">{prod.brand}</div>
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
              <div className="card p-6 border-2 border-amber-300 bg-white shadow-xs">
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
                        Letihind (€) *
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
                    Salvesta toode letihindadesse
                  </button>
                </form>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: PAKETID & HINNASTUS (12.90€ / 25€) */}
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
                          <option value="vip_b2b_2500">Peatöövõtjad B2B (25.00 €)</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Parem: Lisa uus klient / peatöövõtja */}
            <div className="lg:col-span-5 space-y-4">
              <div className="card p-6 border-2 border-amber-300 bg-white shadow-xs">
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
                          <a href={ad.targetUrl} target="_blank" rel="noreferrer" className="text-[10px] text-amber-600 underline">
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
              <div className="card p-6 border-2 border-amber-300 bg-white shadow-xs">
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

      </main>
    </div>
  )
}
