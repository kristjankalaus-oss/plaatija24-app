'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import ProjectChat from '@/components/chat/ProjectChat'
import { ProjectInquiry, ContractorQuote } from '@/types'
import { getProjectById, getQuotesForProject, SEED_PROJECTS } from '@/lib/data-store'

export default function ProjectDetailPage() {
  const params = useParams()
  const projectId = (params?.id as string) || 'demo-preview'

  const [project, setProject] = useState<ProjectInquiry | null>(null)
  const [quotes, setQuotes] = useState<ContractorQuote[]>([])
  const [selectedQuoteTiler, setSelectedQuoteTiler] = useState<{ id: string; name: string; company: string } | undefined>(undefined)
  const [activeTab, setActiveTab] = useState<'ai_quote' | 'visuals' | 'contractors' | 'chat'>('ai_quote')

  useEffect(() => {
    let p = getProjectById(projectId)
    if (!p) {
      // Fallback kui otsiti ID-d, mida pole
      p = SEED_PROJECTS[0]
    }
    setProject(p)

    const qList = getQuotesForProject(p.id)
    setQuotes(qList)
    if (qList.length > 0) {
      setSelectedQuoteTiler({
        id: qList[0].tilerId,
        name: qList[0].tilerName,
        company: qList[0].tilerCompany
      })
    }
  }, [projectId])

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <span className="text-4xl">⏳</span>
            <p className="mt-3 text-gray-600 font-semibold">Laadin projekti andmeid...</p>
          </div>
        </div>
      </div>
    )
  }

  const { aiEstimate } = project

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        
        {/* Päis ja staatus */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                  ● {project.status === 'pakkumised_avatud' ? 'Pakkumised avatud' : 'Uus päring'}
                </span>
                <span className="text-xs text-gray-400">
                  ID: #{project.id.slice(-6)} · {new Date(project.createdAt).toLocaleDateString('et-EE')}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                {project.roomTypeLabel} – {project.serviceType === 'mõlemad' ? 'Plaat & Mikrotsement' : project.serviceType}
              </h1>
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                <span>📍 {project.city}</span>
                <span>·</span>
                <span>Tellija: {project.clientName}</span>
                <span>·</span>
                <span>Mahud: {project.scope.floorArea} m² põrand / {project.scope.wallArea} m² seinad</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/pro/requests"
                className="btn-secondary py-2 px-4 text-xs font-bold"
              >
                🔨 Paigaldaja vaade (tee pakkumine)
              </Link>
              <button
                type="button"
                onClick={() => setActiveTab('chat')}
                className="btn-primary py-2 px-4 text-xs font-bold"
              >
                💬 Kiirsõnumid ({quotes.length} pakkujat)
              </button>
            </div>
          </div>

          {/* Navigatsioonitabid */}
          <div className="flex border-b border-gray-100 mt-6 -mb-2 overflow-x-auto text-sm font-semibold">
            {[
              { id: 'ai_quote', label: '🤖 AI Letihindade pakkumine' },
              { id: 'visuals', label: `🖼️ AI Visualiseeringud (${project.aiVisualizations?.length || 0})` },
              { id: 'contractors', label: `🔨 Paigaldajate pakkumised (${quotes.length})` },
              { id: 'chat', label: '💬 Kiirsõnumid & Chat' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`py-3 px-4 border-b-2 whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-gray-950 font-bold'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* TAB 1: AI LETIHINDADE PAKKUMINE */}
        {activeTab === 'ai_quote' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Vasak 2 veergu: Ridade kaupa eelarve */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Kokkuvõtte kaart */}
              <div className="card p-6 bg-gradient-to-br from-blue-50/70 via-white to-slate-50/60 border border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      AI
                    </span>
                    <div>
                      <h3 className="font-bold text-gray-900 text-base">Eesti turu letihindade kalkulatsioon</h3>
                      <p className="text-xs text-gray-500">Põhineb standardsetel sertifitseeritud ehitushindadel</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400">Prognoositav aeg:</div>
                    <div className="text-sm font-bold text-gray-800">~{aiEstimate.estimatedDays} tööpäeva</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-blue-100">
                  <div>
                    <div className="text-xs text-gray-500">Tööde maksumus:</div>
                    <div className="text-lg font-black text-gray-900">{aiEstimate.laborSubtotal.toLocaleString('et-EE')} €</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Materjalid (letihind):</div>
                    <div className="text-lg font-black text-gray-900">{aiEstimate.materialSubtotal.toLocaleString('et-EE')} €</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Käibemaks (22%):</div>
                    <div className="text-lg font-bold text-gray-600">{aiEstimate.vat.toLocaleString('et-EE')} €</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Koguhind KM-ga:</div>
                    <div className="text-xl font-black text-blue-700">{aiEstimate.grossTotal.toLocaleString('et-EE')} €</div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-blue-900 font-medium bg-blue-100/70 p-2.5 rounded-lg border border-blue-200/60">
                  <span>💡 Realistlik turuvahemik sõltuvalt aluspinna sirgusest:</span>
                  <span className="font-bold">
                    {aiEstimate.priceRange.min.toLocaleString('et-EE')} – {aiEstimate.priceRange.max.toLocaleString('et-EE')} €
                  </span>
                </div>
              </div>

              {/* Tööde mahutabel ridadena */}
              <div className="card p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 text-base mb-4 flex items-center gap-2">
                  <span>🔨</span> Tööde lahtikirjutus (Letihinnad)
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-400 uppercase tracking-wider text-[10px]">
                        <th className="pb-2.5 font-bold">Töölõik</th>
                        <th className="pb-2.5 font-bold text-right">Maht</th>
                        <th className="pb-2.5 font-bold text-right">Ühikuhind</th>
                        <th className="pb-2.5 font-bold text-right">Summa</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {aiEstimate.laborItems.map(item => (
                        <tr key={item.id} className="hover:bg-gray-50/60">
                          <td className="py-3 pr-2">
                            <div className="font-bold text-gray-900">{item.title}</div>
                            {item.description && (
                              <div className="text-[11px] text-gray-500">{item.description}</div>
                            )}
                          </td>
                          <td className="py-3 text-right font-medium text-gray-700 whitespace-nowrap">
                            {item.quantity} {item.unit}
                          </td>
                          <td className="py-3 text-right font-medium text-gray-700 whitespace-nowrap">
                            {item.unitPrice} €/{item.unit}
                          </td>
                          <td className="py-3 text-right font-bold text-gray-900 whitespace-nowrap">
                            {item.total.toLocaleString('et-EE')} €
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-gray-200 font-bold text-gray-900">
                        <td colSpan={3} className="pt-3">Tööde vahesumma kokku:</td>
                        <td className="pt-3 text-right text-sm">{aiEstimate.laborSubtotal.toLocaleString('et-EE')} €</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Materjalide letihindade tabel */}
              <div className="card p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 text-base mb-4 flex items-center gap-2">
                  <span>📦</span> Arvestuslikud materjalid (letihinnad)
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-400 uppercase tracking-wider text-[10px]">
                        <th className="pb-2.5 font-bold">Materjal</th>
                        <th className="pb-2.5 font-bold text-right">Maht</th>
                        <th className="pb-2.5 font-bold text-right">Ühikuhind</th>
                        <th className="pb-2.5 font-bold text-right">Summa</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {aiEstimate.materialItems.map(item => (
                        <tr key={item.id} className="hover:bg-gray-50/60">
                          <td className="py-3 pr-2">
                            <div className="font-bold text-gray-900">{item.title}</div>
                            {item.description && (
                              <div className="text-[11px] text-gray-500">{item.description}</div>
                            )}
                          </td>
                          <td className="py-3 text-right font-medium text-gray-700 whitespace-nowrap">
                            {item.quantity} {item.unit}
                          </td>
                          <td className="py-3 text-right font-medium text-gray-700 whitespace-nowrap">
                            {item.unitPrice} €/{item.unit}
                          </td>
                          <td className="py-3 text-right font-bold text-gray-900 whitespace-nowrap">
                            {item.total.toLocaleString('et-EE')} €
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-gray-200 font-bold text-gray-900">
                        <td colSpan={3} className="pt-3">Materjalide vahesumma kokku:</td>
                        <td className="pt-3 text-right text-sm">{aiEstimate.materialSubtotal.toLocaleString('et-EE')} €</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

            </div>

            {/* Parem veerg: Tehnilised märkused ja materjali spetsifikatsioon */}
            <div className="space-y-6">
              
              {/* Visualiseeringu eelvaate kaart */}
              <div className="card p-5 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    🖼️ AI Visualiseering
                  </h4>
                  <button
                    onClick={() => setActiveTab('visuals')}
                    className="text-xs text-blue-600 font-bold hover:underline"
                  >
                    Vaata suurelt →
                  </button>
                </div>
                <div className="rounded-xl overflow-hidden h-44 bg-gray-100 relative shadow-inner">
                  <img
                    src={project.aiVisualizations[0]}
                    alt="AI render"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3">
                    <p className="text-white text-xs font-semibold leading-tight">
                      {project.tileSpecs?.colorStyle || project.microcementSpecs?.colorTone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Materjalide spetsifikatsioon */}
              <div className="card p-5 border border-gray-200 space-y-3 text-xs">
                <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <span>📐</span> Sisestatud spetsifikatsioon
                </h4>
                {project.tileSpecs && (
                  <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                    <div className="font-bold text-blue-950">Keraamiline plaat:</div>
                    <div className="text-gray-600">Formaat: {project.tileSpecs.sizeLabel}</div>
                    <div className="text-gray-600">Stiil: {project.tileSpecs.colorStyle}</div>
                    <div className="text-gray-600">Viimistlus: {project.tileSpecs.finish}</div>
                    <div className="text-gray-600">Vuuk: {project.tileSpecs.jointType === 'epoxy' ? 'Epoksiidvuuk (100% veekindel)' : 'Tsemendivuuk'}</div>
                  </div>
                )}
                {project.microcementSpecs && (
                  <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                    <div className="font-bold text-blue-950">Mikrotsement:</div>
                    <div className="text-gray-600">Süsteem: {project.microcementSpecs.systemLabel}</div>
                    <div className="text-gray-600">Toon: {project.microcementSpecs.colorTone}</div>
                    <div className="text-gray-600">Viimistlus: {project.microcementSpecs.finish}</div>
                  </div>
                )}
              </div>

              {/* AI Tehnilised soovitused */}
              <div className="card p-5 border border-blue-200 bg-blue-50/30 space-y-3 text-xs">
                <h4 className="font-bold text-blue-950 text-sm flex items-center gap-2">
                  <span>💡</span> AI Meistri märkused
                </h4>
                <ul className="space-y-2 text-gray-700">
                  {aiEstimate.technicalNotes.map((note, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-2 border-t border-blue-200/60">
                  <div className="font-bold text-gray-800 mb-1">Soovitatavad tooted:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {aiEstimate.recommendedMaterials.map((mat, idx) => (
                      <span key={idx} className="bg-white border border-blue-200 px-2 py-0.5 rounded text-[11px] font-medium text-blue-900">
                        {mat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: AI VISUALISEERINGUD */}
        {activeTab === 'visuals' && (
          <div className="space-y-6">
            <div className="card p-6 border border-gray-200">
              <div className="max-w-2xl mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100 border border-blue-200/80 px-2.5 py-1 rounded-full">
                  AI Visualiseerija
                </span>
                <h2 className="text-xl font-bold text-gray-900 mt-2">
                  Kujundatud fotod valmis tööst
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Pildid on genereeritud vastavalt teie valitud plaatidele ({project.tileSpecs?.colorStyle || 'Plaat'}) ja mikrotsemendi toonile ({project.microcementSpecs?.colorTone || 'Mikrotsement'}).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.aiVisualizations.map((imgUrl, idx) => (
                  <div key={idx} className="group rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 shadow-xs flex flex-col">
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={imgUrl}
                        alt={`Visualiseering ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md">
                        AI Render #{idx + 1}
                      </div>
                    </div>
                    <div className="p-4 bg-white flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm mb-1">
                          {idx === 0 ? 'Põhivaade: 60x120 Calacatta marmor & LED-nišš' : idx === 1 ? 'Lähivaade: Veekindel sujuv mikrotsement' : 'Terviklahendus: Plaatide ja mikrotsemendi ühendus'}
                        </h4>
                        <p className="text-xs text-gray-500">
                          Täpselt rihitud 45° jiirid, epoksiidvuuk ja monoliitne veetsoon.
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                        <span className="text-blue-700 font-bold">Autentsuse hinne: 98%</span>
                        <a
                          href={imgUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-gray-500 hover:text-gray-900 font-semibold"
                        >
                          Ava täissuuruses ↗
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PAIGALDAJATE PAKKUMISED */}
        {activeTab === 'contractors' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Registreeritud paigaldajate pakkumised</h2>
                <p className="text-xs text-gray-500">Meistrid on teie ruumi andmeid ja AI letihindu vaadanud ning esitanud omapoolse hinna</p>
              </div>
              <Link
                href="/pro/requests"
                className="btn-secondary py-2 px-4 text-xs font-bold"
              >
                + Esita uus pakkumine (Plaatija režiim)
              </Link>
            </div>

            {quotes.length === 0 ? (
              <div className="card p-12 text-center border border-gray-200">
                <span className="text-4xl">📬</span>
                <h3 className="font-bold text-gray-900 mt-3 text-base">Pakkumisi pole veel laekunud</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
                  Teie päring on paigaldajate töölaual avatud. Tavaliselt laekuvad esimesed pakkumised paari tunni jooksul.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {quotes.map(quote => (
                  <div key={quote.id} className="card p-6 border-2 border-blue-200 hover:border-blue-500 bg-white shadow-sm flex flex-col justify-between transition-all">
                    <div>
                      {/* Paigaldaja info */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={quote.tilerAvatar}
                            alt={quote.tilerName}
                            className="w-12 h-12 rounded-xl object-cover border border-gray-200"
                          />
                          <div>
                            <div className="font-extrabold text-gray-900 text-sm flex items-center gap-1.5">
                              {quote.tilerCompany}
                              <span className="text-blue-600 text-xs">✓</span>
                            </div>
                            <div className="text-xs text-gray-500">{quote.tilerName} · 📍 {quote.tilerCity}</div>
                            <div className="flex items-center gap-1 text-xs text-blue-700 font-bold mt-0.5">
                              <span>★ {quote.tilerRating}</span>
                              <span className="text-gray-400 font-normal">({quote.warrantyYears}a garantii)</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs text-gray-400 block">Pakutud hind:</span>
                          <span className="text-2xl font-black text-gray-900">{quote.totalPrice.toLocaleString('et-EE')} €</span>
                          <span className="text-[11px] text-gray-500 block">
                            {quote.materialsIncluded ? 'Materjalid hinna sees' : 'Ainult tööraha'}
                          </span>
                        </div>
                      </div>

                      {/* Tingimused */}
                      <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50 p-3 rounded-xl mb-4 text-gray-700">
                        <div>
                          <span className="text-gray-400 block text-[10px]">Eeldatav algus:</span>
                          <span className="font-semibold">{quote.estimatedStartDate}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block text-[10px]">Tööde kestus:</span>
                          <span className="font-semibold">{quote.estimatedDuration}</span>
                        </div>
                      </div>

                      {/* Kommentaar */}
                      <p className="text-xs text-gray-600 leading-relaxed mb-4 italic bg-blue-50/40 p-3 rounded-lg border border-blue-100">
                        "{quote.comment}"
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                      <Link
                        href={`/tilers/${quote.tilerId}`}
                        className="text-xs font-bold text-gray-700 hover:text-gray-900 underline"
                      >
                        Vaata profiili & galeriid →
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedQuoteTiler({
                            id: quote.tilerId,
                            name: quote.tilerName,
                            company: quote.tilerCompany
                          })
                          setActiveTab('chat')
                        }}
                        className="btn-primary py-2 px-4 text-xs font-bold"
                      >
                        💬 Saada kiirsõnum
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: KIIRSÕNUMID & CHAT */}
        {activeTab === 'chat' && (
          <div className="space-y-6">
            <div className="max-w-3xl mx-auto">
              <ProjectChat
                projectId={project.id}
                clientName={project.clientName}
                selectedTiler={selectedQuoteTiler}
              />
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
