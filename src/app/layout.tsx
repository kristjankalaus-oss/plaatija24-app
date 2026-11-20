import type { Metadata } from 'next'
import './globals.css'
import { LanguageProvider } from '@/lib/i18n'

export const metadata: Metadata = {
  title: 'Objekt24 – Eelarve sekundiga, pakkumised päevaga',
  description: 'Eesti nutikas ehitus- ja viimistlustööde turuplats. Plaatimine, mikrotsement, maalritööd, kipsitööd, müüriladumine ja üldehitus.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="et">
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}
