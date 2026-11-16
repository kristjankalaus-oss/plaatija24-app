import { NextResponse } from 'next/server'

interface NotifyPayload {
  type: 'new_inquiry' | 'new_quote' | 'feedback'
  projectTitle?: string
  projectId?: string
  city?: string
  clientName?: string
  clientEmail?: string
  estimatedTotal?: number
  tilerName?: string
  tilerCompany?: string
  quoteTotal?: number
  feedbackCategory?: string
  feedbackMessage?: string
  feedbackSender?: string
  feedbackRole?: string
  rating?: number
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as NotifyPayload
    const resendKey = process.env.RESEND_API_KEY
    const adminEmail = process.env.ADMIN_EMAIL || 'info@plaatija24.ee'
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'Plaatija24 <noreply@plaatija24.ee>'
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.plaatija24.ee'

    let subject = ''
    let html = ''
    const recipients: string[] = [adminEmail]

    if (body.type === 'new_inquiry') {
      subject = `🧱 Uus hinnapäring: ${body.projectTitle || 'Plaatimistöö'} (${body.city || 'Eesti'})`
      html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="color: #0d5ed9; margin-top: 0;">Plaatija24 – Uus hinnapäring</h2>
          <p>Platvormile lisati uus päring:</p>
          <ul style="line-height: 1.7;">
            <li><strong>Projekt:</strong> ${body.projectTitle || '-'}</li>
            <li><strong>Piirkond:</strong> ${body.city || '-'}</li>
            <li><strong>Tellija:</strong> ${body.clientName || '-'}</li>
            <li><strong>AI esialgne eelarve (KM-ga):</strong> ${body.estimatedTotal ? body.estimatedTotal.toLocaleString('et-EE') + ' €' : '-'}</li>
          </ul>
          <a href="${appUrl}/request/${body.projectId || ''}" style="display: inline-block; margin-top: 12px; padding: 10px 20px; background: #0d5ed9; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold;">
            Vaata projekti ja tee pakkumine →
          </a>
        </div>
      `
      if (body.clientEmail && body.clientEmail.includes('@')) {
        recipients.push(body.clientEmail)
      }
    } else if (body.type === 'feedback') {
      subject = `💬 Uus tagasiside / raport (${body.feedbackCategory || 'Üldine'})`
      html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="color: #0d5ed9; margin-top: 0;">Plaatija24 – Tagasiside & Raport</h2>
          <ul style="line-height: 1.7;">
            <li><strong>Saatja:</strong> ${body.feedbackSender || '-'} (${body.feedbackRole || '-'})</li>
            <li><strong>Kategooria:</strong> ${body.feedbackCategory || '-'}</li>
            ${body.rating ? `<li><strong>Hinnang:</strong> ${body.rating}/5 ★</li>` : ''}
            ${body.projectId ? `<li><strong>Projekti ID:</strong> ${body.projectId}</li>` : ''}
          </ul>
          <p style="background: #f9fafb; padding: 12px; border-radius: 8px; border: 1px solid #e5e7eb;">${body.feedbackMessage || ''}</p>
        </div>
      `
    } else if (body.type === 'new_quote') {
      subject = `💬 Uus meistri pakkumine projektile: ${body.projectTitle || body.projectId}`
      html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="color: #0d5ed9; margin-top: 0;">Plaatija24 – Uus hinnapakkumine</h2>
          <p>Meister esitas teie projektile ametliku pakkumise:</p>
          <ul style="line-height: 1.7;">
            <li><strong>Meister / Ettevõte:</strong> ${body.tilerName || '-'} (${body.tilerCompany || '-'})</li>
            <li><strong>Pakkumise kogusumma (KM-ga):</strong> ${body.quoteTotal ? body.quoteTotal.toLocaleString('et-EE') + ' €' : '-'}</li>
          </ul>
          <a href="${appUrl}/request/${body.projectId || ''}" style="display: inline-block; margin-top: 12px; padding: 10px 20px; background: #0d5ed9; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold;">
            Vaata pakkumist ja kirjuta meistrile →
          </a>
        </div>
      `
      if (body.clientEmail && body.clientEmail.includes('@')) {
        recipients.push(body.clientEmail)
      }
    } else if (body.type === 'feedback') {
      subject = `💬 Uus tagasiside / raport (${body.feedbackCategory || 'Üldine'})`
      html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="color: #0d5ed9; margin-top: 0;">Plaatija24 – Tagasiside & Raport</h2>
          <ul style="line-height: 1.7;">
            <li><strong>Saatja:</strong> ${body.feedbackSender || '-'} (${body.feedbackRole || '-'})</li>
            <li><strong>Kategooria:</strong> ${body.feedbackCategory || '-'}</li>
            ${body.rating ? `<li><strong>Hinnang:</strong> ${body.rating}/5 ★</li>` : ''}
            ${body.projectId ? `<li><strong>Projekti ID:</strong> ${body.projectId}</li>` : ''}
          </ul>
          <p style="background: #f9fafb; padding: 12px; border-radius: 8px; border: 1px solid #e5e7eb;">${body.feedbackMessage || ''}</p>
        </div>
      `
    }

    if (!resendKey) {
      console.info('[Notify API] RESEND_API_KEY puudub – teavitus logitud:', { subject, recipients })
      return NextResponse.json({ ok: true, mode: 'logged_only' })
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: Array.from(new Set(recipients)),
        subject,
        html,
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error('[Notify API] Resend viga:', errText)
      return NextResponse.json({ ok: false, error: errText }, { status: 502 })
    }

    return NextResponse.json({ ok: true, mode: 'sent' })
  } catch (err) {
    console.error('[Notify API] Viga:', err)
    return NextResponse.json({ ok: false, error: 'Teavituse saatmine ebaõnnestus' }, { status: 500 })
  }
}
