'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';

interface Harvest {
  id: number;
  name: string;
  description: string;
  location: string;
  price: number;
  imageData: string;
}

export default function Home() {
  const [harvests, setHarvests] = useState<Harvest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    const fetchHarvests = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        const response = await fetch(`${apiUrl}/api/harvests`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Harvest[] = await response.json();
        setHarvests(data.slice(0, 3));
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchHarvests();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/20 to-cyan-900/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-24 text-center">
          <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 mb-8 leading-tight">
            おすすめ収穫体験
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
            全国各地の農園で、新鮮で美味しい果物や野菜を収穫する体験をお楽しみください
          </p>
          
          {/* 認証状態に応じたCTA */}
          {isLoaded && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {isSignedIn ? (
                <div className="space-y-4">
                  <p className="text-lg text-emerald-300 font-medium">
                    ようこそ！素晴らしい体験をお探しください
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      href="/harvests/all"
                      className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105"
                    >
                      体験を探す
                      <svg
                        className="ml-2 w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </Link>
                    <Link
                      href="/profile"
                      className="inline-flex items-center px-8 py-4 bg-gray-700/50 hover:bg-gray-600/50 text-white font-bold text-lg rounded-xl border border-gray-600 transition-all duration-300 transform hover:scale-105"
                    >
                      マイページ
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-lg text-gray-300">
                    アカウントを作成して、より多くの機能をお楽しみください
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      href="/harvests/all"
                      className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105"
                    >
                      体験を探す
                      <svg
                        className="ml-2 w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </Link>
                    <Link
                      href="/sign-up"
                      className="inline-flex items-center px-8 py-4 bg-gray-700/50 hover:bg-gray-600/50 text-white font-bold text-lg rounded-xl border border-gray-600 transition-all duration-300 transform hover:scale-105"
                    >
                      新規登録
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-400"></div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="text-red-400 text-6xl mb-4">⚠️</div>
              <p className="text-red-400 text-xl">
                エラーが発生しました: {error}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {harvests.map((harvest) => (
              <Link
                key={harvest.id}
                href={`/harvests/${harvest.id}`}
                className="group block"
              >
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10 hover:scale-105 transition-all duration-500 transform">
                  {/* Image Container with Overlay */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={
                        harvest.imageData.startsWith('http')
                          ? harvest.imageData
                          : harvest.imageData.startsWith('/')
                          ? `${process.env.NEXT_PUBLIC_BASE_URL || ''}${
                              harvest.imageData
                            }`
                          : `data:image/jpeg;base64,${harvest.imageData}`
                      }
                      alt={harvest.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    {/* Experience Name on Image */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
                        {harvest.name}
                      </h3>
                      <p className="text-emerald-300 font-medium text-sm">
                        📍 {harvest.location}
                      </p>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <p className="text-gray-300 mb-4 leading-relaxed line-clamp-3">
                      {harvest.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-black text-emerald-400">
                        ¥{harvest.price.toLocaleString()}
                      </span>
                      <span className="text-emerald-400 font-semibold group-hover:text-emerald-300 transition-colors duration-300">
                        詳細を見る →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center mt-20">
          <Link
            href="/harvests/all"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105"
          >
            すべての体験を見る
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
