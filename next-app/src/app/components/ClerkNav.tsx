'use client';

import { useAuth, SignInButton, SignUpButton, UserButton, SignOutButton } from '@clerk/nextjs';
import { useState } from 'react';

export function ClerkNav() {
  const { isSignedIn, isLoaded } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  if (!isLoaded) {
    return (
      <div className="flex items-center space-x-4">
        <div className="animate-pulse bg-gray-600 h-8 w-20 rounded-md"></div>
      </div>
    );
  }

  if (isSignedIn) {
    return (
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2 text-gray-300 hover:text-emerald-400 transition-colors duration-300"
          >
            <span className="font-medium">マイページ</span>
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-2 z-50">
              <a
                href="/profile"
                className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-emerald-400 transition-colors duration-200"
                onClick={() => setShowUserMenu(false)}
              >
                プロフィール
              </a>
              <a
                href="/reservations"
                className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-emerald-400 transition-colors duration-200"
                onClick={() => setShowUserMenu(false)}
              >
                予約履歴
              </a>
              <div className="border-t border-gray-700 my-1"></div>
              <SignOutButton>
                <button className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-red-400 transition-colors duration-200">
                  ログアウト
                </button>
              </SignOutButton>
            </div>
          )}
        </div>
        
        <UserButton 
          appearance={{
            elements: {
              avatarBox: "w-8 h-8",
              userButtonPopoverCard: "bg-gray-800 border-gray-700",
              userButtonPopoverActionButton: "text-gray-300 hover:bg-gray-700 hover:text-emerald-400"
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <SignInButton mode="modal">
        <button className="text-gray-300 hover:text-emerald-400 font-medium transition-colors duration-300">
          ログイン
        </button>
      </SignInButton>
      <SignUpButton mode="modal">
        <button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105">
          新規登録
        </button>
      </SignUpButton>
    </div>
  );
}
