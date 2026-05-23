import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sales Entry Form',
  description: 'Daily sales transaction entry',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
