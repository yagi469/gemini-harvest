'use client';

import { useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Reservation {
  id: number;
  harvestId: number;
  userId: string;
  userName: string;
  userEmail: string;
  reservationDate: string;
  reservationTime: string;
  numberOfParticipants: number;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  harvestName?: string;
  harvestLocation?: string;
  harvestImage?: string;
  totalPrice?: number;
}

export default function ReservationsPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmedCount, setConfirmedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      redirect('/');
    }
    
    if (isLoaded && isSignedIn && user) {
      const fetchReservations = async () => {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
          const response = await fetch(`${apiUrl}/api/reservations?userId=${user.id}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data: Reservation[] = await response.json();

          const reservationsWithHarvestDetails = await Promise.all(
            data.map(async (res) => {
              const harvestResponse = await fetch(`${apiUrl}/api/harvests/${res.harvestId}`);
              if (!harvestResponse.ok) {
                console.error(`Failed to fetch harvest details for ID: ${res.harvestId}`);
                return res; 
              }
              const harvestData = await harvestResponse.json();
              return {
                ...res,
                harvestName: harvestData.name,
                harvestLocation: harvestData.location,
                harvestImage: harvestData.imageData.startsWith('/') ? harvestData.imageData : `data:image/jpeg;base64,${harvestData.imageData}`,
                totalPrice: harvestData.price * res.numberOfParticipants,
              };
            })
          );
          setReservations(reservationsWithHarvestDetails);

          // Calculate counts
          const confirmed = reservationsWithHarvestDetails.filter(res => res.status === 'Confirmed').length;
          const pending = reservationsWithHarvestDetails.filter(res => res.status === 'Pending').length;
          setConfirmedCount(confirmed);
          setPendingCount(pending);

        } catch (e) {
          console.error("Failed to fetch reservations:", e);
          setReservations([]);
          setConfirmedCount(0);
          setPendingCount(0);
        } finally {
          setLoading(false);
        }
      };
      fetchReservations();
    }
  }, [isLoaded, isSignedIn, user]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return (
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm font-medium rounded-full border border-emerald-500/30">
            確定済み
          </span>
        );
      case 'Pending':
        return (
          <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-sm font-medium rounded-full border border-yellow-500/30">
            確認中
          </span>
        );
      case 'Cancelled':
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
                      <Image
                        src={reservation.harvestImage || '/images/placeholder.svg'}
                        alt={reservation.harvestName || 'Harvest Image'}
                        width={96}
                        height={96}
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
                              {reservation.numberOfParticipants}名
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-400">料金:</span>
                            <p className="text-white font-medium">
                              ¥{reservation.totalPrice?.toLocaleString()}
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
                      {reservation.status === 'Pending' && (
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

      {/* Fixed counts display at bottom-left */}
      <div className="fixed bottom-8 left-8 bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-700/50">
        <div className="flex flex-col space-y-2 text-lg">
          <div className="flex items-center text-emerald-300">
            <span className="text-2xl mr-2">✅</span>
            確定済み: <span className="font-bold ml-1">{confirmedCount}</span>
          </div>
          <div className="flex items-center text-yellow-300">
            <span className="text-2xl mr-2">⏳</span>
            確認中: <span className="font-bold ml-1">{pendingCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}