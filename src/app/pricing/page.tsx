'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import { getPricingPlans, getTilers, updateTilerProfile, AD_BANNER_PACKAGES } from '@/lib/data-store'
import { SubscriptionTier, TilerProfile } from '@/types'

export default function PricingPage() {
  const plans = getPricingPlans()
  const tilers = getTilers()
  const [selectedTilerId, setSelectedTilerId] = useState<string>(tilers[0]?.id || 'tiler-1')
  const [activeTier, setActiveTier] = useState<SubscriptionTier>(tilers[0]?.subscriptionTier || 'pro_1290')
  const [successMsg, setSuccessMsg] = useState('')

  const handleSelectTier = (tier: SubscriptionTier) => {
    setActiveTier(tier)
    const t = tilers.find(x => x.id === selectedTilerId)
    if (t) {
      t.subscriptionTier = tier
      if (tier === 'free') {
        t.quotesLimit = 3
      } else {
        t.quotesLimit = -1
      }
      updateTilerProfile(t)
      setSuccessMsg(`✅ Profiili "${t.companyName}" paketiks määrati: ${plans.find(p => p.id === tier)?.name}!`)
      setTimeout(() => setSuccessMsg(''), 4000)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase font-extrabold tracking-wider px-3.5 py-1 bg-blue-100 text-blue-900 border border-blue-200/80 rounded-full">
            Meistrite Tellimuspaketid
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-950 mt-3">
            Liitu Plaatija24 meistrite võrgustikuga
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Tellijale on platvorm täiesti tasuta. Vali oma töömahule sobiv pakett ja saa pidevalt uusi tulusaid objekte.
          </p>

          {/* Aktiivse meistri valik */}
          {tilers.length > 0 && (
            <div className="mt-6 inline-flex items-center gap-2 p-2 bg-white rounded-xl border border-gray-200 shadow-2xs text-xs">
              <span className="text-gray-500 font-semibold pl-2">Vali meistri konto:</span>
              <select
                value={selectedTilerId}
                onChange={(e) => {
                  setSelectedTilerId(e.target.value)
                  const current = tilers.find(t => t.id === e.target.value)
                  if (current) setActiveTier(current.subscriptionTier)
                }}
                className="bg-gray-50 border border-gray-200 text-gray-900 font-bold rounded-lg px-3 py-1.5 outline-none"
              >
                {tilers.map(t => (
                  <option key={t.id} value={t.id}>{t.companyName} ({t.subscriptionTier})</option>
                ))}
              </select>
            </div>
          )}

          {successMsg && (
            <div className="mt-4 p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold rounded-xl max-w-md mx-auto">
              {successMsg}
            </div>
          )}
        </div>

        {/* 3 Paketti kõrvuti */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => {
            const isCurrent = activeTier === plan.id
            const isVip = plan.id === 'vip_b2b_2500'
            const isPro = plan.id === 'pro_1290'

            return (
              <div
                key={plan.id}
                className={`card p-8 flex flex-col justify-between transition-all duration-200 relative ${
                  isVip
                    ? 'border-2 border-gray-950 bg-gray-950 text-white shadow-xl'
                    : isCurrent
                    ? 'border-2 border-blue-600 shadow-lg ring-2 ring-blue-500/30'
                    : isPro
                    ? 'border-2 border-blue-500 shadow-md bg-blue-50/20'
                    : 'border border-gray-200'
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className={`text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full text-white shadow-xs ${
                      isVip ? 'bg-blue-600' : 'bg-blue-600'
                    }`}>
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div>
                  <div className="mb-4">
                    <h3 className={`text-xl font-black ${isVip ? 'text-white' : 'text-gray-950'}`}>{plan.name}</h3>
                    <p className={`text-xs mt-1 min-h-[32px] ${isVip ? 'text-gray-300' : 'text-gray-500'}`}>{plan.description}</p>
                  </div>

                  {/* Hind */}
                  <div className={`py-4 border-y mb-6 ${isVip ? 'border-gray-800' : 'border-gray-100'}`}>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-4xl font-black ${isVip ? 'text-white' : 'text-gray-950'}`}>
                        {plan.priceMonthly === 0 ? '0 €' : `${plan.priceMonthly.toFixed(2)} €`}
                      </span>
                      <span className="text-xs font-semibold text-gray-400">/ kuu</span>
                    </div>
                    <div className="text-[11px] text-gray-400 mt-0.5">
                      {plan.priceMonthly === 0 ? 'Kohustustevaba alustus' : 'Kuutasu arve alusel · km lisandub'}
                    </div>
                  </div>

                  {/* Omadused */}
                  <ul className={`space-y-3 text-xs mb-8 ${isVip ? 'text-gray-300' : 'text-gray-700'}`}>
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className={`font-black ${isVip ? 'text-blue-400' : 'text-blue-600'}`}>✓</span>
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Nupp */}
                <div>
                  <button
                    type="button"
                    onClick={() => handleSelectTier(plan.id)}
                    className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-xs ${
                      isCurrent
                        ? 'bg-emerald-600 text-white cursor-default'
                        : isVip
                        ? 'bg-blue-600 text-white hover:bg-blue-500'
                        : isPro
                        ? 'btn-primary justify-center'
                        : 'btn-secondary justify-center'
                    }`}
                  >
                    {isCurrent ? '✓ Praegu valitud pakett' : plan.ctaText}
                  </button>
                  <p className="text-[10px] text-center text-gray-400 mt-2">
                    Paketti saab igal ajal muuta või peatada
                  </p>
                </div>

              </div>
            )
          })}
        </div>

        {/* B2B peatöövõtjate selgituskast */}
        <div className="mt-16 card p-8 border border-blue-200 bg-gradient-to-r from-blue-50/50 via-white to-slate-50/40">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded">
                Eksklusiivne B2B Allhanked
              </span>
              <h3 className="text-xl font-extrabold text-gray-900 mt-1">
                Kuidas toimib 49 €/kuus Peatöövõtjate & Äripakett?
              </h3>
              <p className="text-xs text-gray-600 mt-1 max-w-2xl leading-relaxed">
                Kinnisvaraarendajad, ehitusfirmad ja peatöövõtjad sisestavad lehele suuremahulisi korterelamute ja äripindade hankeid. Need projektid on tähistatud märgiga <strong>"💎 Peatöövõtja B2B päring"</strong>. Tavalised ja 12.90 € meistrid neid pakkuda ei saa — need on reserveeritud ainult 49 € paketiga liitunud meistritele!
              </p>
            </div>
            <Link
              href="/pro/requests"
              className="btn-primary py-3 px-6 text-xs font-bold whitespace-nowrap shadow-sm"
            >
              Vaata avatud päringuid töölaual →
            </Link>
          </div>
        </div>

        {/* Reklaamipindade hinnakiri tootjatele ja poodidele */}
        <div className="mt-16 pt-12 border-t border-gray-200">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase font-extrabold tracking-wider px-3.5 py-1 bg-blue-100 text-blue-900 border border-blue-200/80 rounded-full">
              Partneritele & Ehituspoodidele
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-950 mt-3">
              Reklaamipindade & bännerite hinnakiri
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Jõua otse klientide ja professionaalsete plaatijateni hetkel, mil nad planeerivad materjalide ostu. Platvorm kujundab bännerikaardi sinu teksti ja pildi põhjal automaatselt.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {AD_BANNER_PACKAGES.map((pkg) => (
              <div key={pkg.id} className="card p-6 border border-gray-200 bg-white flex flex-col justify-between hover:border-blue-400 hover:shadow-lg transition-all">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                      {pkg.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-gray-950">{pkg.name}</h3>
                  <div className="text-[11px] font-mono text-gray-400 mt-0.5">{pkg.sizeLabel}</div>
                  <div className="mt-3 text-3xl font-black text-gray-950">
                    {pkg.priceMonthly} € <span className="text-xs font-normal text-gray-400">/ kuu</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                    {pkg.description}
                  </p>
                </div>

                <a
                  href={`mailto:info@plaatija24.ee?subject=${encodeURIComponent(`Reklaamipinna tellimine: ${pkg.name} (${pkg.priceMonthly} €/k)`)}`}
                  className="btn-secondary w-full justify-center py-2.5 text-xs font-bold mt-6"
                >
                  Broneeri pind (info@plaatija24.ee) →
                </a>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  )
}
