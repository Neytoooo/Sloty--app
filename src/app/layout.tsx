import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import { Urbanist } from 'next/font/google'

const urbanist = Urbanist({
  subsets: ['latin'],
  variable: '--font-urbanist',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="fr" className={urbanist.variable}>
        <body className="font-sans">{children}</body>
      </html>
    </ClerkProvider>
  )
}