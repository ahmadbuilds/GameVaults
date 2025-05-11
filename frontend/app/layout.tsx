import { type Metadata } from 'next'
import {ClerkProvider} from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
//import { auth } from '@clerk/nextjs/server'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Game Vault',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider
    appearance={{
      variables: {
        colorBackground: '#000000',
        colorPrimary: '#eee', // Indigo
        colorText: 'white',
        colorInputBackground: '#1F1F1F',
        colorInputText: '#FFFFFF',
      },
      elements: {
        card: 'rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 via-black to-gray-800 shadow-xl',
        headerTitle: 'text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600',
        button:
          'bg-gradient-to-r from-blue-600 to-purple-500 text-white font-bold py-3 px-6 rounded-lg hover:from-blue-500 hover:to-purple-400 transform hover:scale-105 transition',
        input: 'bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500',
        footer: 'text-gray-400 text-sm',
      },
    }}
    afterSignOutUrl='/sign-in'
    >
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}