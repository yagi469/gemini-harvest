'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Harvest {
  id: number;
  name: string;
  description: string;
  location: string;
  price: number;
  imageData: string;
}

export default function AllHarvestsPage() {
  const [harvests, setHarvests] = useState<Harvest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchHarvests = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        const response = await fetch(`${apiUrl}/api/harvests${searchTerm ? `?searchTerm=${searchTerm}` : ''}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Harvest[] = await response.json();
        setHarvests(data);
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchHarvests();
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/20 to-cyan-900/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-24 text-center">
          <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 mb-8 leading-tight">
            すべての収穫体験
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            全国各地の農園で提供されている様々な収穫体験をご覧ください
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="mb-8">
          <input
            type="text"
            placeholder="収穫体験を検索..."
            className="w-full p-4 rounded-xl bg-gray-700/50 text-white placeholder-gray-400 border border-gray-600/50 focus:border-emerald-500/50 focus:ring focus:ring-emerald-500/20 transition-all duration-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-400 mx-auto mb-4"></div>
              <p className="text-gray-400 text-lg">読み込み中...</p>
            </div>
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
                    <Image
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
                      fill
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      unoptimized
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

        {/* Back to Home */}
        <div className="text-center mt-20">
          <Link
            href="/"
            className="inline-flex items-center px-8 py-4 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white font-semibold text-lg rounded-xl border border-gray-600/50 hover:border-gray-500/50 transition-all duration-300 transform hover:scale-105"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            ホームに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
