'use client'

import { useState, useEffect } from 'react'
import { ChatMessage, ContractorQuote } from '@/types'
import { getMessagesForProject, sendChatMessage } from '@/lib/data-store'

interface ProjectChatProps {
  projectId: string
  clientName: string
  selectedTiler?: {
    id: string
    name: string
    company: string
  }
}

export default function ProjectChat({ projectId, clientName, selectedTiler }: ProjectChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputText, setInputText] = useState('')
  const [asRole, setAsRole] = useState<'client' | 'tiler'>('client')

  const refreshMessages = () => {
    const list = getMessagesForProject(projectId)
    setMessages(list)
  }

  useEffect(() => {
    refreshMessages()
    const interval = setInterval(refreshMessages, 2500)
    return () => clearInterval(interval)
  }, [projectId])

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!inputText.trim()) return

    const newMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      projectId,
      conversationId: `${projectId}-${selectedTiler?.id || 'tiler-1'}`,
      senderType: asRole,
      senderName: asRole === 'client' 
        ? `${clientName} (Tellija)` 
        : `${selectedTiler?.company || 'Plaatija Meister'}`,
      message: inputText.trim(),
      createdAt: new Date().toISOString()
    }

    sendChatMessage(newMsg)
    setInputText('')
    refreshMessages()
  }

  const quickQuestions = [
    'Millal oleks teil võimalik töödega alustada?',
    'Kas teete ka nõuetekohase hüdroisolatsiooni sertifikaadi?',
    'Kas hind sisaldab plaadiliimi ja vuugisegusid?',
    'Kas saaksite tulla objekti enne üle vaatama?'
  ]

  return (
    <div className="card border border-gray-200 overflow-hidden flex flex-col h-[520px]">
      
      {/* Header */}
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
            💬 Kiirsõnumid & Täpsustavad küsimused
          </h3>
          <p className="text-xs text-gray-500">
            Vestlus: <span className="font-semibold text-gray-800">{clientName}</span> ja{' '}
            <span className="font-semibold text-brand-600" style={{ color: 'var(--color-brand-600)' }}>
              {selectedTiler ? selectedTiler.company : 'Kõik pakkujad'}
            </span>
          </p>
        </div>

        {/* Sender toggle for demo testing */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-gray-200 text-xs font-semibold">
          <span className="text-gray-400 text-[11px] px-1">Kirjuta kui:</span>
          <button
            type="button"
            onClick={() => setAsRole('client')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              asRole === 'client'
                ? 'bg-amber-500 text-white font-bold shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Klient
          </button>
          <button
            type="button"
            onClick={() => setAsRole('tiler')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              asRole === 'tiler'
                ? 'bg-gray-800 text-white font-bold shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Plaatija
          </button>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-white">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 p-6">
            <span className="text-3xl mb-2">👋</span>
            <p className="text-sm font-medium">Vestlust pole veel alustatud</p>
            <p className="text-xs text-gray-400 mt-1 max-w-xs">
              Esita paigaldajale täpsustavaid küsimusi projekti, algusaegade või materjalide kohta.
            </p>
          </div>
        ) : (
          messages.map((m) => {
            const isMe = (asRole === 'client' && m.senderType === 'client') || (asRole === 'tiler' && m.senderType === 'tiler')
            const isClientMsg = m.senderType === 'client'

            return (
              <div
                key={m.id}
                className={`flex flex-col ${isClientMsg ? 'items-start' : 'items-end'}`}
              >
                <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mb-1 px-1">
                  <span className={`font-semibold ${isClientMsg ? 'text-amber-700' : 'text-gray-700'}`}>
                    {m.senderName}
                  </span>
                  <span>·</span>
                  <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-2xs ${
                    isClientMsg
                      ? 'bg-amber-50 text-gray-800 border border-amber-200/60 rounded-tl-xs'
                      : 'bg-gray-900 text-white rounded-tr-xs'
                  }`}
                >
                  {m.message}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Quick suggestions */}
      {asRole === 'client' && (
        <div className="px-4 py-2 bg-gray-50/80 border-t border-gray-100 flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <span className="text-gray-400 whitespace-nowrap">Kiirküsimused:</span>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setInputText(q)}
              className="whitespace-nowrap px-2.5 py-1 bg-white border border-gray-200 rounded-full text-gray-600 hover:border-amber-400 hover:text-amber-700 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <form onSubmit={handleSend} className="p-3 bg-gray-50 border-t border-gray-200 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={asRole === 'client' ? 'Kirjuta küsimus paigaldajale...' : 'Kirjuta vastus kliendile...'}
          className="input bg-white flex-1 text-sm py-2"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="btn-primary py-2 px-4 text-xs font-bold whitespace-nowrap"
          style={!inputText.trim() ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
        >
          Saada ↵
        </button>
      </form>

    </div>
  )
}
