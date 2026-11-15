import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import AdGrid from '@/components/ads/AdGrid'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-14 pb-18 px-4 sm:px-6 bg-gradient-to-br from-amber-50/80 via-white to-orange-50/60 border-b border-gray-100">
        <div className="max-w-5xl mx-auto text-center">
          
          <div className="inline-flex items-center gap-2 bg-amber-100/90 text-amber-900 text-xs font-bold px-3.5 py-1.5 rounded-full mb-6 uppercase tracking-wider shadow-2xs">
            <span>🇪🇪</span> Kliendile 100% tasuta · AI Letihindade kalkulaator & Visualiseering
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-gray-950 tracking-tight leading-[1.12] mb-6">
            Leia parim plaatija ja mikrotsemendi meister.<br />
            <span style={{ color: 'var(--color-brand-500)' }}>AI esialgne letihindade kalkulatsioon & visualiseering.</span>
          </h1>

          <p className="text-base sm:text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Sisesta ruumi mahud, fotod ja joonised. Meie <strong>AI agent</strong> koostab kohese letihindadega esialgse pakkumise ning kujundab realistlikud fotod valmis tööst. Kontrollitud meistrid ja peatöövõtjad esitavad omapoolsed pakkumised ning suhtlevad <strong>kiirsõnumitega</strong>.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/request"
              className="btn-primary text-base py-4 px-8 shadow-lg hover:shadow-xl transition-all"
            >
              🤖 Küsi tasuta pakkumist & koosta AI pildid →
            </Link>
            <Link
              href="/pricing"
              className="btn-secondary text-base py-4 px-8"
            >
              🔨 Liitu meistrina (alates 0 € kuni 25 €/k)
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-gray-500">
            <span className="flex items-center gap-1.5">✓ Kliendile täiesti tasuta</span>
            <span className="flex items-center gap-1.5">✓ Täpne letihindade mahutabel</span>
            <span className="flex items-center gap-1.5">✓ AI fotorealistlikud pildid</span>
            <span className="flex items-center gap-1.5">✓ Otsevestlus kiirsõnumites</span>
          </div>

        </div>
      </section>

      {/* Ametlikult toetatud brändide riba */}
      <section className="py-5 bg-gray-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-gray-400 font-extrabold text-sm uppercase tracking-widest">
            <span className="text-[11px] font-bold text-gray-400">Ametlikult toetatud süsteemid:</span>
            <span className="text-gray-700 hover:text-amber-600 transition-colors">🇩🇰 MIRA</span>
            <span className="text-gray-700 hover:text-blue-600 transition-colors">🇮🇹 MAPEI</span>
            <span className="text-gray-700 hover:text-emerald-600 transition-colors">🇫🇷 WEBER</span>
            <span className="text-gray-700 hover:text-blue-800 transition-colors">🇫🇮 KIILTO</span>
            <span className="text-gray-700 hover:text-red-700 transition-colors">🇩🇪 CERESIT</span>
          </div>
        </div>
      </section>

      {/* Reklaamibännerite ruudustik (Sponsorid & Partnerid) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <AdGrid />
      </section>

      {/* Kuidas see töötab (4 sammu) */}
      <section className="py-16 px-4 sm:px-6 bg-gray-50/50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase font-extrabold tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
              Kuidas teenus töötab?
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-3">
              Mugav tellijale, tulus meistrile
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Platvorm viib kokku erakliendid, peatöövõtjad ja kvalifitseeritud meistrid
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                icon: '📐',
                title: 'Sisesta andmed & mahud',
                desc: 'Määra ruumi pindala, töölõigud (hüdroisolatsioon, 45° jiirid, nišid, vuugitüüp) ning laadi üles fotod ja plaanid.'
              },
              {
                step: '02',
                icon: '🤖',
                title: 'AI letihinnad & pildid',
                desc: 'AI arvutab detailse letihindadega esialgse kalkulatsiooni ning kujundab realistlikud fotod valmis ruumist.'
              },
              {
                step: '03',
                icon: '🔨',
                title: 'Meistrite pakkumised',
                desc: 'Registreeritud meistrid ja B2B allhankijad näevad päringut, kohandavad hindu ja saadavad ametliku pakkumise.'
              },
              {
                step: '04',
                icon: '💬',
                title: 'Kiirsõnumid & Leping',
                desc: 'Suhtle pakkujatega kiirsõnumites, esita täpsustavaid küsimusi ja lepi kokku tööde algus.'
              }
            ].map(item => (
              <div
                key={item.step}
                className="card p-6 border border-gray-200 hover:border-amber-300 transition-all shadow-xs flex flex-col justify-between bg-white"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{item.icon}</span>
                    <span className="text-xs font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-base mb-2">{item.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Peatöövõtjad ja B2B hanke esiletõst */}
      <section className="py-14 px-4 sm:px-6 bg-gradient-to-r from-blue-900 to-indigo-950 text-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-blue-500 text-white px-2.5 py-0.5 rounded">
              💎 Peatöövõtjate & Arendajate B2B Kanal
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-2">
              Korterelamud, äripinnad ja suuremahulised hanked
            </h2>
            <p className="text-xs sm:text-sm text-blue-200 mt-2 max-w-2xl leading-relaxed">
              Kas juhid ehitusobjekti või arendust? Sisesta korterite mahutabelid ja dwg joonised. Sinu hankele pääsevad pakkumisi tegema ainult kontrollitud <strong>B2B Äripaketiga (25 €/kuu)</strong> liitunud meistrid.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 whitespace-nowrap">
            <Link
              href="/request"
              className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold rounded-xl text-xs shadow-md transition-colors text-center"
            >
              Sisesta B2B päring →
            </Link>
            <Link
              href="/pricing"
              className="px-6 py-3.5 bg-blue-800/80 hover:bg-blue-700 text-white font-bold rounded-xl text-xs border border-blue-600 transition-colors text-center"
            >
              Liitu 25€ B2B meistrina
            </Link>
          </div>
        </div>
      </section>

      {/* Meistrite paketid eelvaade */}
      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase font-extrabold tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
              Plaatijate Paketid
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-3">
              Kuidas plaatijana portaaliga liituda?
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Alusta tasuta või vali piiramatu ligipääsuga PRO pakett
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card p-6 border border-gray-200 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase">Alustav Meister</span>
                <div className="text-2xl font-black text-gray-900 mt-1">0 € <span className="text-xs font-normal text-gray-400">/ kuu</span></div>
                <p className="text-xs text-gray-500 mt-1">Vasta kuni 3 päringule kuus tasuta. Kõik erapäringud on nähtaval.</p>
              </div>
              <Link href="/pricing" className="btn-secondary w-full justify-center text-xs font-bold py-2 mt-6">
                Vaata paketti
              </Link>
            </div>

            <div className="card p-6 border-2 border-amber-400 bg-amber-50/20 shadow-md flex flex-col justify-between relative">
              <span className="absolute -top-3 right-6 bg-amber-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                Populaarne
              </span>
              <div>
                <span className="text-xs font-bold text-amber-700 uppercase">Aktiivne Meister PRO</span>
                <div className="text-2xl font-black text-gray-900 mt-1">12.90 € <span className="text-xs font-normal text-gray-400">/ kuu</span></div>
                <p className="text-xs text-gray-500 mt-1">Piiramatu arv pakkumisi kõigile erapäringutele. Esiletõstetud profiil.</p>
              </div>
              <Link href="/pricing" className="btn-primary w-full justify-center text-xs font-bold py-2 mt-6">
                Liitu 12.90 € paketiga
              </Link>
            </div>

            <div className="card p-6 border-2 border-blue-400 bg-blue-50/20 shadow-md flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-blue-800 uppercase">Peatöövõtjad & Äri PRO</span>
                <div className="text-2xl font-black text-gray-900 mt-1">25.00 € <span className="text-xs font-normal text-gray-400">/ kuu</span></div>
                <p className="text-xs text-gray-500 mt-1">Täielik ligipääs PEATÖÖVÕTJATE B2B hangetele ja arendustele.</p>
              </div>
              <Link href="/pricing" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl text-center mt-6 transition-colors">
                Liitu 25.00 € paketiga
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-gray-950 text-white py-12 px-4 sm:px-6 border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-gray-400">
          <div>
            <span className="text-lg font-black text-white">
              Plaatija<span style={{ color: 'var(--color-brand-500)' }}>24</span> & Mikrotsement
            </span>
            <p className="mt-1">Eesti juhtiv plaatimistööde ja mikrotsemendi turuplats · www.plaatija24.ee</p>
          </div>
          <div className="flex flex-wrap gap-5 font-semibold">
            <Link href="/request" className="hover:text-white transition-colors">Küsi pakkumist</Link>
            <Link href="/tilers" className="hover:text-white transition-colors">Paigaldajad</Link>
            <Link href="/pricing" className="hover:text-white transition-colors">Meistrite paketid (12.90€ / 25€)</Link>
            <Link href="/pro/requests" className="hover:text-white transition-colors">Töölaud</Link>
            <Link href="/admin" className="text-amber-400 hover:text-amber-300 transition-colors">⚙️ Admin Paneel</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
