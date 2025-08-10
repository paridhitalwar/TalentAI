import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Providers from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TalentAI - AI-Powered Talent Marketplace',
  description: 'Discover top AI talent through intelligent matching, skill evaluation, and engaging experiences. Connect with the best candidates and opportunities in the AI industry.',
  keywords: ['AI', 'talent', 'recruitment', 'machine learning', 'hiring', 'tech jobs'],
  authors: [{ name: 'TalentAI Team' }],
  creator: 'TalentAI',
  publisher: 'TalentAI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    title: 'TalentAI - AI-Powered Talent Marketplace',
    description: 'Discover top AI talent through intelligent matching, skill evaluation, and engaging experiences.',
    url: 'http://localhost:3000',
    siteName: 'TalentAI',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TalentAI - AI-Powered Talent Marketplace',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TalentAI - AI-Powered Talent Marketplace',
    description: 'Discover top AI talent through intelligent matching, skill evaluation, and engaging experiences.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
                borderRadius: '12px',
                padding: '16px',
                fontSize: '14px',
                fontWeight: '500',
              },
              success: {
                style: {
                  background: '#10b981',
                },
                iconTheme: {
                  primary: '#fff',
                  secondary: '#10b981',
                },
              },
              error: {
                style: {
                  background: '#ef4444',
                },
                iconTheme: {
                  primary: '#fff',
                  secondary: '#ef4444',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
