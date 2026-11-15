import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Plaatija24 & Mikrotsement',
  description: 'Ehitusmaterjalide ja plaatimistööde haldusplatvorm',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="et">
      <body>{children}</body>
    </html>
  )
}
