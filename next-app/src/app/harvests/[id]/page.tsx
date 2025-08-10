'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import ReservationModal from '../../components/ReservationModal';

interface Harvest {
  id: number;
  name: string;
  description: string;
  location: string;
  price: number;
  imageData: string;
  availableSlots: { [key: string]: number };
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function HarvestDetailPage({ params }: PageProps) {
  const router = useRouter();
  const [harvest, setHarvest] = useState<Harvest | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [id, setId] = useState<string>('');

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (id) {
      const fetchHarvest = async () => {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
          const response = await fetch(`${apiUrl}/api/harvests/${id}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data: Harvest = await response.json();
          setHarvest(data);
        } catch (e) {
          const message = e instanceof Error ? e.message : String(e);
          setError(message);
        } finally {
          setLoading(false);
        }
      };
      fetchHarvest();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-400 mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex justify-center items-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <p className="text-red-400 text-xl">エラーが発生しました: {error}</p>
        </div>
      </div>
    );
  }

  if (!harvest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex justify-center items-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <p className="text-gray-400 text-xl">収穫体験が見つかりません</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/20 to-cyan-900/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 mb-8 text-center leading-tight">
            {harvest.name}
          </h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-6 pb-16">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl overflow-hidden border border-gray-700/50 shadow-2xl">
          {/* Image Section */}
          {harvest.imageData && (
            <div className="relative h-96 overflow-hidden">
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
                className="w-full h-full object-cover"
                unoptimized
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent"></div>
            </div>
          )}

          {/* Content */}
          <div className="p-8">
            <p className="text-gray-300 mb-6 leading-relaxed text-lg">
              {harvest.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-700/30 rounded-2xl p-6 border border-gray-600/30">
                <div className="flex items-center mb-2">
                  <span className="text-emerald-400 text-2xl mr-3">📍</span>
                  <h3 className="text-gray-300 font-semibold text-lg">場所</h3>
                </div>
                <p className="text-white font-bold text-xl">
                  {harvest.location}
                </p>
              </div>

              <div className="bg-gray-700/30 rounded-2xl p-6 border border-gray-600/30">
                <div className="flex items-center mb-2">
                  <span className="text-emerald-400 text-2xl mr-3">💰</span>
                  <h3 className="text-gray-300 font-semibold text-lg">価格</h3>
                </div>
                <p className="text-emerald-400 font-black text-3xl">
                  ¥{harvest.price.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Reservation Button */}
            <div className="mt-8 text-center">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                予約する
              </button>
            </div>

            {/* Reservation Modal */}
            <ReservationModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              harvest={harvest}
            />
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="text-center pb-16">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center px-6 py-3 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white font-semibold rounded-xl border border-gray-600/50 hover:border-gray-500/50 transition-all duration-300 transform hover:scale-105"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          前のページに戻る
        </button>
      </div>
    </div>
  );
}