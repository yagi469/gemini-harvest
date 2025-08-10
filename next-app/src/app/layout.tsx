'use client';

import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import {
  SignInButton,
  SignUpButton,
  UserButton,
  SignedIn,
  SignedOut,
} from '@clerk/nextjs';
import { useState } from 'react';
import Link from 'next/link';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 text-gray-100`}
      >
        <Providers>
          <header className="bg-gray-800/80 backdrop-blur-md border-b border-gray-700/50 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
              <div className="flex justify-between items-center">
                {/* 左上タイトル */}
                <Link
                  href="/"
                  className="text-lg sm:text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent hover:from-emerald-300 hover:to-cyan-300 transition-all duration-300"
                >
                  農業収穫体験
                </Link>

                {/* ハンバーガーメニューボタン (smブレークポイント未満で表示) */}
                <button
                  className="sm:hidden text-gray-300 hover:text-emerald-400 focus:outline-none"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {isMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>

                {/* ナビゲーション (smブレークポイント以上で表示、sm未満ではハンバーガーメニューで制御) */}
                <nav className={`sm:flex items-center space-x-4 sm:space-x-8 ${isMenuOpen ? 'flex flex-col absolute top-full left-0 w-full bg-gray-800/90 border-t border-gray-700/50 py-4 space-y-4' : 'hidden'}`}>
                  <Link
                    href="/harvests/all"
                    className="text-gray-300 hover:text-emerald-400 font-medium transition-colors duration-300 relative group"
                    onClick={() => setIsMenuOpen(false)} // メニューを閉じる
                  >
                    すべての体験
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-400 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                  <SignedIn>
                    <UserButton afterSignOutUrl="/" /> {/* afterSignOutUrlを追加 */}
                  </SignedIn>
                  <SignedOut>
                    <SignInButton mode="modal">
                      <button
                        className="text-gray-300 hover:text-emerald-400 font-medium transition-colors duration-300"
                        onClick={() => setIsMenuOpen(false)} // メニューを閉じる
                      >
                        ログイン
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button
                        className="px-3 py-1 sm:px-4 sm:py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105"
                        onClick={() => setIsMenuOpen(false)} // メニューを閉じる
                      >
                        新規登録
                      </button>
                    </SignUpButton>
                  </SignedOut>
                </nav>
              </div>
            </div>
          </header>
          <main className="min-h-screen">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
