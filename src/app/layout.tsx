import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Objekt24 – Eelarve sekundiga, pakkumised päevaga',
  description: 'Eesti nutikas ehitus- ja viimistlustööde turuplats. Plaatimine, mikrotsement, maalritööd, kipsitööd, müüriladumine ja üldehitus.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="et">
      <body>{children}</body>
    </html>
  )
}
