import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GeoBridge AI - Geomorphic Analysis',
  description: 'AI-powered IT-based tool to redesign bridge structures based on geomorphic conditions',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%231e40af"/><path d="M50 20 L30 60 L70 60 Z" fill="white" stroke="%230ea5e9" stroke-width="2"/><line x1="30" y1="60" x2="70" y2="60" stroke="white" stroke-width="3"/></svg>',
  },
  other: {
    'cache-control': 'no-cache, no-store, must-revalidate',
  },
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

