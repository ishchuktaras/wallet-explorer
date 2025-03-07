import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Cardano NFT Explorer | View Wallet Assets & Collections",
  description:
    "Explore Cardano blockchain wallets, view NFT collections, track transactions, and analyze wallet data using Blockfrost API integration. Perfect for NFT collectors and Cardano enthusiasts.",
  keywords: ["Cardano", "NFT", "Blockchain", "Wallet Explorer", "ADA", "Crypto", "Digital Assets", "Blockfrost API"],
  authors: [{ name: "Cardano NFT Explorer Team" }],
  openGraph: {
    title: "Cardano NFT Explorer | View Wallet Assets & Collections",
    description:
      "Explore Cardano blockchain wallets, view NFT collections, track transactions, and analyze wallet data.",
    type: "website",
    locale: "en_US",
    url: "https://cardano-nft-explorer.vercel.app/",
    images: [
      {
        url: "https://cardano.org/img/og-default.png", // Placeholder image URL
        width: 1200,
        height: 630,
        alt: "Cardano NFT Explorer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cardano NFT Explorer | View Wallet Assets & Collections",
    description:
      "Explore Cardano blockchain wallets, view NFT collections, track transactions, and analyze wallet data.",
    images: ["https://cardano.org/img/og-default.png"], // Placeholder image URL
  },
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

