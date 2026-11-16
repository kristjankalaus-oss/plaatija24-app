'use client'

import { useState, useEffect } from 'react'
import { getAds, fetchAdsFromSupabase } from '@/lib/data-store'
import { AdBanner as AdBannerType } from '@/types'

export default function AdGrid() {
  const [ads, setAds] = useState<AdBannerType[]>([])

  useEffect(() => {
    setAds(getAds().filter(a => a.active))
    fetchAdsFromSupabase().then(remote => {
      if (remote) {
        setAds(remote.filter(a => a.active))
      }
    })
  }, [])

  if (ads.length === 0) {
    return null
  }

  return (
    <div className="py-12 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-blue-800 bg-blue-100 border border-blue-200/80 px-2.5 py-0.5 rounded">
            Sponsorid & Partnerid
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-gray-950 mt-1">
            Ehitusmaterjalide ja süsteemide eripakkumised
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {ads.map((item) => (
          <a
            key={item.id}
            href={item.targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-900 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between min-h-[260px]"
          >
            {item.imageUrl && (
              <div
                className="absolute inset-0 bg-cover bg-center opacity-45 group-hover:opacity-55 group-hover:scale-105 transition-all duration-500"
                style={{ backgroundImage: `url(${item.imageUrl})` }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/65 to-transparent" />

            <div className="relative z-10 p-5 flex items-center justify-between">
              <span
                className="px-2.5 py-1 rounded-lg text-white text-xs font-black tracking-wider border border-white/20 shadow-xs"
                style={{ backgroundColor: item.accentColor || '#0d5ed9' }}
              >
                {item.brand}
              </span>
            </div>

            <div className="relative z-10 p-5 pt-10 space-y-2">
              <h4 className="font-extrabold text-white text-base leading-snug group-hover:text-blue-300 transition-colors">
                {item.title}
              </h4>
              <p className="text-xs text-gray-300 leading-relaxed line-clamp-2">
                {item.subtitle}
              </p>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] font-bold text-blue-300">
                  {item.tagline}
                </span>
                <span className="text-xs font-bold text-white group-hover:translate-x-1 transition-transform">
                  {item.ctaText}
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
