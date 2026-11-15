'use client'

import { useState } from 'react'
import { getAds } from '@/lib/data-store'

export default function AdGrid() {
  const ads = getAds().filter(a => a.active)

  const partnerBanners = [
    {
      id: 'mira-showcase',
      brand: 'MIRA',
      badge: 'Ametlik Süsteemipartner',
      flag: '🇩🇰',
      accentColor: '#d97706',
      bgGradient: 'from-amber-900/90 to-stone-900',
      title: 'mira 4400 multicoat veetõke',
      subtitle: 'Sertifitseeritud 2-kihiline elastne hüdroisolatsioon ja C2TE S1 elastne plaadiliim 10-aastase süsteemigarantiiga.',
      perk: '10a garantii sertifikaat',
      targetUrl: 'https://mirabyggeprodukter.ee',
      ctaText: 'Vaata tehnilist kaarti →',
      imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'mapei-showcase',
      brand: 'MAPEI',
      badge: 'Itaalia Tippdisain',
      flag: '🇮🇹',
      accentColor: '#2563eb',
      bgGradient: 'from-blue-950/90 to-slate-900',
      title: 'Ultracolor Plus & Mapelastic',
      subtitle: 'Kiirkõvenev vee- ja mustushülgav vuugisegu BioBlock® tehnoloogiaga. Üle 40 tooniplaatidega sobiva värvi.',
      perk: 'Hallitusevaba BioBlock®',
      targetUrl: 'https://www.mapei.com/ee',
      ctaText: 'Tutvu värvikaardiga →',
      imageUrl: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'weber-showcase',
      brand: 'WEBER',
      badge: 'Saint-Gobain Ehituskeemia',
      flag: '🇫🇷',
      accentColor: '#059669',
      bgGradient: 'from-emerald-950/90 to-stone-900',
      title: 'weber vetonit põrandalahendused',
      subtitle: 'Isevalguvad kiirkõvenevad tasandussegud ja veekindlad plaadiliimid professionaalsele ehitajale.',
      perk: 'Kiire kuivamine & tugevus',
      targetUrl: 'https://www.ee.weber',
      ctaText: 'Loe tootejuhendit →',
      imageUrl: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'store-showcase',
      brand: 'ESPAK & EHITUSEABC',
      badge: 'Eksklusiivne Sooduskood',
      flag: '🏷️',
      accentColor: '#e11d48',
      bgGradient: 'from-rose-950/90 to-gray-900',
      title: 'Materjalide hulgisoodustus -15%',
      subtitle: 'Telli plaadiliimid, vuugisegud ja hüdroisolatsioon Plaatija24 sooduskoodiga otse edasimüüjatelt.',
      perk: 'Kood: PLAATIJA24',
      targetUrl: 'https://www.espak.ee',
      ctaText: 'Kasuta sooduskoodi →',
      imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded">
            Sponsorid & Partnerid
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-gray-950 mt-1">
            Ehitusmaterjalide ja süsteemide eripakkumised
          </h3>
          <p className="text-xs text-gray-500">
            Ametlikult tunnustatud plaatimis- ja veetõkkesüsteemid otse tootjatelt
          </p>
        </div>
        <div className="text-[11px] font-semibold text-gray-400">
          Sponsoreeritud bännerid
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {partnerBanners.map(b => (
          <div
            key={b.id}
            className="group relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-[220px]"
          >
            {/* Taustapilt tumeduse ja gradiendiga */}
            <div className="absolute inset-0 z-0">
              <img
                src={b.imageUrl}
                alt={b.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-30"
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${b.bgGradient} opacity-90`} />
            </div>

            {/* Sisu */}
            <div className="relative z-10 p-6 flex flex-col justify-between h-full text-white">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2.5 py-0.5 rounded text-[11px] font-black tracking-wider uppercase text-black"
                      style={{ backgroundColor: b.accentColor }}
                    >
                      {b.flag} {b.brand}
                    </span>
                    <span className="text-[10px] font-semibold text-gray-300">
                      {b.badge}
                    </span>
                  </div>
                  <span className="text-[10px] bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-full font-bold">
                    {b.perk}
                  </span>
                </div>

                <h4 className="text-lg font-black text-white leading-tight mb-1.5">
                  {b.title}
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed max-w-md">
                  {b.subtitle}
                </p>
              </div>

              <div className="pt-4 mt-2 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] text-gray-400 font-medium">
                  Ametlik tootesari
                </span>
                <a
                  href={b.targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold px-3.5 py-1.5 rounded-lg bg-white text-gray-900 hover:bg-amber-400 transition-colors shadow-xs"
                >
                  {b.ctaText}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
