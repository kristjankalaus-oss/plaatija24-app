'use client'

import { AdBanner as AdBannerType } from '@/types'
import { getAds } from '@/lib/data-store'

interface AdBannerProps {
  position?: 'top_header' | 'sidebar' | 'inline'
  specificBrand?: string
}

export default function AdBanner({ position = 'inline', specificBrand }: AdBannerProps) {
  const ads = getAds()
  const activeAds = ads.filter(a => a.active)

  if (activeAds.length === 0) return null

  let chosenAd: AdBannerType | undefined
  if (specificBrand) {
    chosenAd = activeAds.find(a => a.brand.toLowerCase() === specificBrand.toLowerCase())
  }
  if (!chosenAd) {
    chosenAd = activeAds.find(a => a.position === position) || activeAds[0]
  }

  if (position === 'top_header') {
    return (
      <div className="bg-gradient-to-r from-gray-900 via-gray-950 to-gray-900 text-white py-2 px-4 border-b border-gray-800 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-extrabold px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider text-black font-mono"
                  style={{ backgroundColor: chosenAd.accentColor || '#f59e0b' }}>
              {chosenAd.brand}
            </span>
            <span className="font-semibold text-gray-200">{chosenAd.title}</span>
            <span className="hidden md:inline text-gray-400">· {chosenAd.subtitle}</span>
          </div>
          <a
            href={chosenAd.targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold underline text-amber-400 hover:text-amber-300 transition-colors whitespace-nowrap text-[11px]"
          >
            {chosenAd.ctaText}
          </a>
        </div>
      </div>
    )
  }

  // Inline või sidebar
  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200/90 bg-gradient-to-br from-white via-gray-50/50 to-amber-50/30 p-5 shadow-xs relative">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-2xs"
                style={{ backgroundColor: chosenAd.accentColor || 'var(--color-brand-500)' }}>
            {chosenAd.brand}
          </span>
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
            Ametlik Süsteemipartner
          </span>
        </div>
        <span className="text-[9px] text-gray-400 font-medium">Reklaam</span>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-extrabold text-gray-900 text-sm sm:text-base leading-tight">
            {chosenAd.title}
          </h4>
          <p className="text-xs text-gray-600 mt-1 leading-relaxed max-w-xl">
            {chosenAd.subtitle}
          </p>
          {chosenAd.tagline && (
            <div className="text-xs font-bold text-amber-700 mt-1.5 flex items-center gap-1">
              <span>⭐</span> {chosenAd.tagline}
            </div>
          )}
        </div>

        <a
          href={chosenAd.targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary py-2 px-4 text-xs font-bold whitespace-nowrap self-stretch sm:self-auto text-center"
        >
          {chosenAd.ctaText}
        </a>
      </div>
    </div>
  )
}
