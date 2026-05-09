import type { Metadata, Viewport } from 'next'
import { Roboto, Roboto_Condensed, Bebas_Neue } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { FloatingWhatsAppButton } from '@/components/FloatingWhatsAppButton'
import { NavbarWrapper } from '@/components/NavbarWrapper'
import { FooterWrapper } from '@/components/FooterWrapper'
import './globals.css'

const roboto = Roboto({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '700'],
});

const robotoCondensed = Roboto_Condensed({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['700', '800'],
});

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  variable: '--font-display',
  weight: '400',
});

export const metadata: Metadata = {
  title: 'MICROSET JK - Premium Goldsmith Tools & Machinery',
  description: 'Premium goldsmith tools and jewellery machinery manufacturer. Rajkot-based, bulk supply, and international export available.',
  keywords: ['goldsmith tools', 'jewellery machinery', 'Rajkot', 'made in India', 'bulk supply', 'export'],
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0F52BA',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${roboto.variable} ${robotoCondensed.variable} ${bebasNeue.variable} antialiased bg-background text-foreground`}>
        <NavbarWrapper />
        {children}
        <FooterWrapper />
        <FloatingWhatsAppButton />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
