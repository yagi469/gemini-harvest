'use client';

import { useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link'; // Add this import

interface Reservation {
  id: number;
  harvestId: number;
  harvestName: string;
  harvestLocation: string;
  harvestImage: string;
  reservationDate: string;
  numberOfPeople: number;
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'cancelled';
}

export default function ReservationsPage() {
  const { isLoaded, isSignedIn } = useUser(); // Removed 'user'
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      redirect('/');
    }
    
    if (isLoaded && isSignedIn) {
      // 実際のAPIから予約データを取得する処理
      // 現在はダミーデータを使用
      setTimeout(() => {
        setReservations([
          {
            id: 1,
            harvestId: 1,
            harvestName: 'いちご狩り体験',
            harvestLocation: '栃木県',
            harvestImage: '/images/ichigo.svg',
            reservationDate: '2024-01-15',
            numberOfPeople: 2,
            totalPrice: 4000,
            status: 'confirmed'
          },
          {
            id: 2,
            harvestId: 2,
            harvestName: 'ブルーベリー収穫',
            harvestLocation: '群馬県',
            harvestImage: '/images/blueberry.svg',
            reservationDate: '2024-02-20',
            numberOfPeople: 3,
            totalPrice: 6000,
            status: 'pending'
          }
        ]);
        setLoading(false);
      }, 1000);
    }
  }, [isLoaded, isSignedIn]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm font-medium rounded-full border border-emerald-500/30">
            確定済み
          </span>
        );
      case 'pending':
        return (
          <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-sm font-medium rounded-full border border-yellow-500/30">
            確認中
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-3 py-1 bg-red-500/20 text-red-400 text-sm font-medium rounded-full border border-red-500/30">
            キャンセル
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 mb-4">
            予約履歴
          </h1>
          <p className="text-xl text-gray-300">
            あなたの農業収穫体験の予約状況を確認できます
          </p>
        </div>

        {reservations.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🌱</div>
            <h3 className="text-2xl font-bold text-gray-300 mb-2">
              まだ予約がありません
            </h3>
            <p className="text-gray-400 mb-6">
              素晴らしい農業収穫体験を予約してみましょう
            </p>
            <Link
              href="/harvests/all"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              体験を探す
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {reservations.map((reservation) => (
              <div
                key={reservation.id}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 hover:border-emerald-500/30 transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row items-start space-y-4 lg:space-y-0 lg:space-x-6">
                  {/* 体験画像 */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-600">
                      <img
                        src={reservation.harvestImage}
                        alt={reservation.harvestName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* 予約詳細 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-white mb-2">
                          {reservation.harvestName}
                        </h3>
                        <p className="text-gray-400 mb-3">
                          📍 {reservation.harvestLocation}
                        </p>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">予約日:</span>
                            <p className="text-white font-medium">
                              {new Date(reservation.reservationDate).toLocaleDateString('ja-JP')}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-400">人数:</span>
                            <p className="text-white font-medium">
                              {reservation.numberOfPeople}名
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-400">料金:</span>
                            <p className="text-white font-medium">
                              ¥{reservation.totalPrice.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-400">ステータス:</span>
                            <div className="mt-1">
                              {getStatusBadge(reservation.status)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* アクションボタン */}
                    <div className="flex flex-wrap gap-3 mt-6">
                      <a
                        href={`/harvests/${reservation.harvestId}`}
                        className="px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 rounded-lg transition-colors duration-300"
                      >
                        詳細を見る
                      </a>
                      {reservation.status === 'pending' && (
                        <button className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors duration-300 border border-red-500/30">
                          キャンセル
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
