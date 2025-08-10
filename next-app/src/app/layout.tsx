import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "農業収穫体験アプリ",
  description: "全国各地の農業収穫体験を予約できるプラットフォーム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 text-gray-100`}
      >
        <header className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700/50 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <Link 
                href="/" 
                className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent hover:from-emerald-300 hover:to-cyan-300 transition-all duration-300"
              >
                農業収穫体験
              </Link>
              <nav className="flex items-center space-x-8">
                <Link 
                  href="/harvests/all" 
                  className="text-gray-300 hover:text-emerald-400 font-medium transition-colors duration-300 relative group"
                >
                  すべての体験
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-400 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </nav>
            </div>
          </div>
        </header>
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
