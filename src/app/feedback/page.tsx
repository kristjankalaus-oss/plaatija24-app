'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import { useAuth } from '@/lib/useAuth'
import { addFeedback, getTilers } from '@/lib/data-store'
import { PlatformFeedback, TilerProfile } from '@/types'

export default function FeedbackPage() {
  const { user, role, fullName } = useAuth()
  const [tilers, setTilers] = useState<TilerProfile[]>([])

  const [senderRole, setSenderRole] = useState<'client' | 'contractor_b2b' | 'tiler'>('client')
  const [senderName, setSenderName] = useState('')
  const [senderEmail, setSenderEmail] = useState('')
  const [category, setCategory] = useState<PlatformFeedback['category']>('platform_feedback')
  const [selectedTilerId, setSelectedTilerId] = useState('')
  const [rating, setRating] = useState<number>(5)
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    setTilers(getTilers())
  }, [])

  useEffect(() => {
    if (!user) return
    if (role === 'tiler' || role === 'contractor_b2b' || role === 'client') {
      setSenderRole(role)
    }
    if (fullName && !senderName) setSenderName(fullName)
    if (user.email && !senderEmail) setSenderEmail(user.email)
  }, [user, role, fullName])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    setSending(true)

    const fb: PlatformFeedback = {
      id: 'fb-' + Date.now(),
      createdAt: new Date().toISOString(),
      senderRole,
      senderName: senderName.trim() || 'Anonüümne kasutaja',
      senderEmail: senderEmail.trim() || undefined,
      category,
      rating: category === 'review_tiler' ? rating : undefined,
      tilerId: category === 'review_tiler' && selectedTilerId ? selectedTilerId : undefined,
      message: message.trim(),
      status: 'uus',
    }

    addFeedback(fb)

    fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'feedback',
        feedbackSender: fb.senderName,
        feedbackRole: fb.senderRole,
        feedbackCategory: fb.category,
        feedbackMessage: fb.message,
        rating: fb.rating,
      }),
    }).catch(() => {})

    setSending(false)
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-10">
        <div className="card p-6 sm:p-8 border border-gray-200 bg-white shadow-sm">
          <div className="mb-6">
            <span className="text-xs font-extrabold uppercase tracking-wider px-3 py-1 bg-blue-100 text-blue-900 rounded-full">
              Tagasiside & Kvaliteedikontroll
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-950 mt-3">
              Jaga tagasisidet või hinda koostööd
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Mõeldud nii klientidele, peatöövõtjatele kui ka paigaldajatele. Sinu tagasiside aitab hoida platvormi kvaliteeti ja eemaldada mittevastavad päringud.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 text-center bg-emerald-50 border border-emerald-200 rounded-2xl space-y-4">
              <span className="text-5xl block">✅</span>
              <h2 className="text-xl font-extrabold text-emerald-950">Aitäh tagasiside eest!</h2>
              <p className="text-xs sm:text-sm text-emerald-800">
                Sinu sõnum on salvestatud ja edastatud Plaatija24 meeskonnale. Vaatame selle esimesel võimalusel üle.
              </p>
              <div className="pt-2 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false)
                    setMessage('')
                  }}
                  className="btn-secondary py-2 px-5 text-xs font-bold"
                >
                  Saada uus tagasiside
                </button>
                <Link href="/" className="btn-primary py-2 px-5 text-xs font-bold">
                  Tagasi avalehele
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              {/* Saatja roll */}
              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Kes sa oled? *
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'client', label: '🏠 Klient / Tellija' },
                    { id: 'tiler', label: '🧱 Meister / Paigaldaja' },
                    { id: 'contractor_b2b', label: '🏢 Peatöövõtja' },
                  ].map(r => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSenderRole(r.id as typeof senderRole)}
                      className={`p-3 rounded-xl border-2 font-bold text-center transition-all ${
                        senderRole === r.id
                          ? 'border-blue-600 bg-blue-50 text-blue-950'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Teema / Kategooria */}
              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Tagasiside teema *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as PlatformFeedback['category'])}
                  className="input font-semibold bg-white"
                >
                  <option value="platform_feedback">💡 Ettepanek või tagasiside platvormi kohta</option>
                  <option value="review_tiler">⭐ Meistri töö hindamine (1–5 tärni)</option>
                  <option value="report_spam_lead">🚩 Teata tühjast / libapäringust või väärkasutusest</option>
                  <option value="bug_report">🛠️ Tehniline probleem / viga lehel</option>
                </select>
              </div>

              {category === 'review_tiler' && (
                <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-xl space-y-3">
                  {tilers.length > 0 && (
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Vali meister (valikuline)</label>
                      <select
                        value={selectedTilerId}
                        onChange={(e) => setSelectedTilerId(e.target.value)}
                        className="input bg-white"
                      >
                        <option value="">-- Märgi kommentaaris või vali nimekirjast --</option>
                        {tilers.map(t => (
                          <option key={t.id} value={t.id}>
                            {t.name} ({t.companyName})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Hinnang töö kvaliteedile *</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={`px-3 py-1.5 rounded-lg border font-bold text-sm transition-all ${
                            rating >= star
                              ? 'bg-amber-400 border-amber-500 text-gray-950'
                              : 'bg-white border-gray-200 text-gray-400'
                          }`}
                        >
                          ★ {star}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Sinu nimi *</label>
                  <input
                    type="text"
                    required
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Ees- ja perekonnanimi"
                    className="input"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">E-post (kui ootad vastust)</label>
                  <input
                    type="email"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    placeholder="nimi@ettevote.ee"
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Sõnum / Kirjeldus *</label>
                <textarea
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Kirjelda oma kogemust, ettepanekut või teata probleemist..."
                  className="input resize-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="btn-primary w-full py-3 text-sm font-bold justify-center shadow-md"
              >
                {sending ? '⏳ Saadan...' : 'Saada tagasiside →'}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  )
}
