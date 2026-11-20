'use client'

import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import AdGrid from '@/components/ads/AdGrid'
import { useTranslation } from '@/lib/i18n'

export default function HomePage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* HERO SECTION: Arhitektuurne plaadivõrgustik & Vaarao sinine kuma */}
      <section className="relative overflow-hidden pt-14 pb-20 px-4 sm:px-6 bg-tile-grid border-b border-gray-200/70">
        {/* Taustakuma efektid */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[780px] h-[380px] rounded-full bg-blue-500/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 w-[420px] h-[280px] rounded-full bg-blue-600/10 blur-3xl" />

        <div className="relative max-w-6xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2.5 bg-white/90 backdrop-blur-md text-blue-950 border border-blue-200/80 text-xs font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-wider shadow-xs">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span>🇪🇪 {t('home.badge')}</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-gray-950 tracking-tight leading-[1.1] mb-5">
              {t('home.h1.prefix')}{' '}
              <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-gray-950 bg-clip-text text-transparent">
                {t('home.h1.highlight')}
              </span>{' '}
              {t('home.h1.suffix')}
            </h1>

            <p className="text-lg sm:text-xl font-bold mb-4 text-blue-700">
              {t('home.subtitle')}
            </p>

            <p className="text-sm sm:text-base text-gray-600 mb-9 max-w-2xl mx-auto leading-relaxed">
              {t('home.desc')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/request"
                className="btn-primary text-sm sm:text-base py-4 px-8 pharaoh-glow"
              >
                <span>🤖 {t('home.cta.client')}</span>
                <span>→</span>
              </Link>
              <Link
                href="/pricing"
                className="btn-secondary text-sm sm:text-base py-4 px-8"
              >
                <span>🔨 {t('home.cta.pro')}</span>
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-gray-500">
              <span className="flex items-center gap-1.5"><span className="text-blue-600 font-black">✓</span> {t('home.trust.1')}</span>
              <span className="flex items-center gap-1.5"><span className="text-blue-600 font-black">✓</span> {t('home.trust.2')}</span>
              <span className="flex items-center gap-1.5"><span className="text-blue-600 font-black">✓</span> {t('home.trust.3')}</span>
              <span className="flex items-center gap-1.5"><span className="text-blue-600 font-black">✓</span> {t('home.trust.4')}</span>
            </div>
          </div>

          {/* GRAFILINE BENTO-GALERII: Teenuste & Materjalide Visuaalne Esitlus */}
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Kaart 1: Keraamika & Suurformaat */}
            <div className="group relative overflow-hidden rounded-2xl bg-gray-950 text-white p-6 border border-gray-800 shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="absolute inset-0 bg-tile-grid-dark opacity-70" />
              <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-blue-600/20 blur-xl group-hover:bg-blue-500/30 transition-colors" />
              <div className="relative z-10 flex flex-col justify-between h-full min-h-[170px]">
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="8" height="8" rx="1" />
                      <rect x="13" y="3" width="8" height="8" rx="1" />
                      <rect x="3" y="13" width="8" height="8" rx="1" />
                      <rect x="13" y="13" width="8" height="8" rx="1" />
                    </svg>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300 bg-blue-950/80 border border-blue-800 px-2.5 py-0.5 rounded-full">
                    {t('bento.1.tag')}
                  </span>
                </div>
                <div className="mt-6">
                  <h3 className="font-extrabold text-base text-white">{t('bento.1.title')}</h3>
                  <p className="text-xs text-gray-400 mt-1">{t('bento.1.desc')}</p>
                </div>
              </div>
            </div>

            {/* Kaart 2: Mikrotsement */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 via-white to-blue-50 text-gray-950 p-6 border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <svg className="absolute -right-8 -bottom-8 w-40 h-40 text-blue-600/5 group-hover:text-blue-600/10 transition-colors" viewBox="0 0 100 100" fill="currentColor">
                <circle cx="50" cy="50" r="45" />
              </svg>
              <div className="relative z-10 flex flex-col justify-between h-full min-h-[170px]">
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                    </svg>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-full">
                    {t('bento.2.tag')}
                  </span>
                </div>
                <div className="mt-6">
                  <h3 className="font-extrabold text-base text-gray-950">{t('bento.2.title')}</h3>
                  <p className="text-xs text-gray-600 mt-1">{t('bento.2.desc')}</p>
                </div>
              </div>
            </div>

            {/* Kaart 3: Maalri-, Kipsi- & Müüritööd */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-900 text-white p-6 border border-blue-500 shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="absolute inset-0 bg-tile-grid-dark opacity-40" />
              <div className="relative z-10 flex flex-col justify-between h-full min-h-[170px]">
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-white/15 px-2.5 py-0.5 rounded-full">
                    {t('bento.3.tag')}
                  </span>
                </div>
                <div className="mt-6">
                  <h3 className="font-extrabold text-base text-white">{t('bento.3.title')}</h3>
                  <p className="text-xs text-blue-100 mt-1">{t('bento.3.desc')}</p>
                </div>
              </div>
            </div>

            {/* Kaart 4: AI Eelarve */}
            <div className="group relative overflow-hidden rounded-2xl bg-white text-gray-950 p-6 border border-gray-200 shadow-sm hover:border-blue-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="relative z-10 flex flex-col justify-between h-full min-h-[170px]">
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-xl bg-gray-950 text-white flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    {t('bento.4.tag')}
                  </span>
                </div>
                <div className="mt-6">
                  <h3 className="font-extrabold text-base text-gray-950">{t('bento.4.title')}</h3>
                  <p className="text-xs text-gray-600 mt-1">{t('bento.4.desc')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sertifitseeritud standardite riba */}
      <section className="py-4 bg-gray-950 text-white border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 font-bold text-xs uppercase tracking-wider">
            <span className="text-gray-200 flex items-center gap-2"><span className="text-blue-400">🛡️</span> {t('std.1')}</span>
            <span className="text-gray-200 flex items-center gap-2"><span className="text-blue-400">📐</span> {t('std.2')}</span>
            <span className="text-gray-200 flex items-center gap-2"><span className="text-blue-400">🧱</span> {t('std.3')}</span>
            <span className="text-gray-200 flex items-center gap-2"><span className="text-blue-400">🎨</span> {t('std.4')}</span>
          </div>
        </div>
      </section>

      {/* Reklaamibännerite ruudustik (ainult siis, kui on aktiivseid partnereid) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <AdGrid />
      </div>

      {/* Kuidas see töötab (4 sammu) */}
      <section className="py-20 px-4 sm:px-6 bg-gray-50/70 border-b border-gray-100">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase font-extrabold tracking-wider text-blue-800 bg-blue-100 border border-blue-200/80 px-3.5 py-1 rounded-full">
              {t('how.badge')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-950 mt-3 tracking-tight">
              {t('how.title')}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              {t('how.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '01', icon: '📐', title: t('how.s1.title'), desc: t('how.s1.desc') },
              { step: '02', icon: '🤖', title: t('how.s2.title'), desc: t('how.s2.desc') },
              { step: '03', icon: '🔨', title: t('how.s3.title'), desc: t('how.s3.desc') },
              { step: '04', icon: '💬', title: t('how.s4.title'), desc: t('how.s4.desc') },
            ].map(item => (
              <div
                key={item.step}
                className="group card p-6 border border-gray-200 hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between bg-white relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-gray-950 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      {item.icon}
                    </span>
                    <span className="text-3xl font-black text-gray-200 group-hover:text-blue-200 font-mono transition-colors">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-gray-950 text-base mb-2">{item.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* B2B Peatöövõtjate & Arendajate Banner */}
      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gray-950 bg-tile-grid-dark border border-gray-800 p-8 sm:p-12 text-white shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="pointer-events-none absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-blue-600/20 blur-3xl" />

            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider bg-blue-600/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full mb-4">
                <span>🏢 {t('b2b.badge')}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                {t('b2b.title')}
              </h2>
              <p className="text-sm text-gray-300 mt-3 leading-relaxed">
                {t('b2b.desc')}
              </p>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <Link href="/request" className="btn-primary py-3.5 px-6 text-xs font-bold justify-center whitespace-nowrap pharaoh-glow">
                {t('b2b.cta1')}
              </Link>
              <Link href="/pricing" className="px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-bold text-center whitespace-nowrap transition-all">
                {t('b2b.cta2')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Meistrite Paketid (Eelvaade) */}
      <section className="py-18 px-4 sm:px-6 bg-gray-50 border-t border-gray-200/70">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs uppercase font-extrabold tracking-wider text-blue-800 bg-blue-100 border border-blue-200/80 px-3.5 py-1 rounded-full">
              {t('plan.badge')}
            </span>
            <h2 className="text-3xl font-black text-gray-950 mt-3">{t('plan.title')}</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {t('plan.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card p-6 border border-gray-200 flex flex-col justify-between bg-white hover:shadow-lg transition-all">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('plan.free.title')}</span>
                <div className="text-3xl font-black text-gray-950 mt-2">0 € <span className="text-xs font-normal text-gray-400">{t('plan.perMonth')}</span></div>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">{t('plan.free.desc')}</p>
              </div>
              <Link href="/pricing" className="btn-secondary w-full justify-center text-xs font-bold py-2.5 mt-6">
                {t('plan.free.cta')}
              </Link>
            </div>

            <div className="card p-6 border-2 border-blue-600 relative shadow-xl flex flex-col justify-between bg-white pharaoh-glow">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider">
                {t('plan.pro.badge')}
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-blue-700 uppercase tracking-wider">{t('plan.pro.title')}</span>
                </div>
                <div className="text-3xl font-black text-gray-950 mt-2">12.90 € <span className="text-xs font-normal text-gray-400">{t('plan.perMonth')}</span></div>
                <p className="text-xs text-gray-600 mt-2 leading-relaxed">{t('plan.pro.desc')}</p>
              </div>
              <Link href="/pricing" className="btn-primary w-full justify-center text-xs font-bold py-2.5 mt-6">
                {t('plan.pro.cta')}
              </Link>
            </div>

            <div className="card p-6 border-2 border-gray-950 bg-gray-950 bg-tile-grid-dark text-white shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">{t('plan.vip.title')}</span>
                  <span className="text-[10px] bg-blue-600/30 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded font-bold">{t('plan.vip.tag')}</span>
                </div>
                <div className="text-3xl font-black text-white mt-2">49.00 € <span className="text-xs font-normal text-gray-400">{t('plan.perMonth')}</span></div>
                <p className="text-xs text-gray-300 mt-2 leading-relaxed">{t('plan.vip.desc')}</p>
              </div>
              <Link href="/pricing" className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl text-center mt-6 transition-colors shadow-xs">
                {t('plan.vip.cta')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-gray-950 text-white py-12 px-4 sm:px-6 border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-xs text-gray-400">
          <div className="space-y-1.5">
            <span className="text-lg font-black text-white block">
              Objekt<span className="text-blue-500">24</span> · {t('brand.tagline')}
            </span>
            <p>{t('brand.slogan')} · www.objekt24.ee</p>
            <p className="text-gray-500">
              {t('footer.managedBy')} <strong className="text-gray-300">Tegulaator OÜ</strong> · {t('footer.email')} <a href="mailto:info@objekt24.ee" className="text-blue-400 hover:underline">info@objekt24.ee</a>
            </p>
          </div>
          <div className="flex flex-wrap gap-5 font-semibold">
            <Link href="/request" className="hover:text-white transition-colors">{t('nav.request')}</Link>
            <Link href="/tilers" className="hover:text-white transition-colors">{t('nav.tilers')}</Link>
            <Link href="/pricing" className="hover:text-white transition-colors">{t('nav.pricing')} (12.90€ / 49€)</Link>
            <Link href="/pro/requests" className="hover:text-white transition-colors">{t('nav.workspace')}</Link>
            <Link href="/feedback" className="hover:text-white transition-colors">{t('nav.feedback')}</Link>
            <Link href="/login" className="hover:text-white transition-colors">{t('nav.login')}</Link>
            <Link href="/admin" className="text-blue-400 hover:text-blue-300 transition-colors">⚙️ {t('footer.admin')}</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
