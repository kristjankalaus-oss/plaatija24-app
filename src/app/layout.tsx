export const metadata = {
  title: 'Plaatija24',
  description: 'Mikrotsemendi ja plaatimistööde veebiplatvorm',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="et">
      <body>{children}</body>
    </html>
  )
}
