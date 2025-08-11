'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useUser } from '@clerk/nextjs'; 
// import { redirect } from 'next/navigation'; // ミドルウェアが処理するため削除

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
}

export default function AdminReservationsPage() {
  // ミドルウェアが認証とロールベースのアクセスを処理します。
  // このページに到達した場合、ユーザーは認証されており、「admin」ロールを持っていることを意味します。
  // ここでの冗長なチェックは不要です。

  const { user } = useUser(); // ユーザー情報を表示目的で使用する場合は残す

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 認証と認可はミドルウェアで処理されるため、直接予約をフェッチします
    fetchAllReservations();
  }, []); // マウント時に一度だけ実行

  const fetchAllReservations = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const response = await fetch(`${apiUrl}/api/reservations`); // すべての予約をフェッチ
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
          };
        })
      );
      setReservations(reservationsWithHarvestDetails);
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      setError(`Failed to fetch reservations: ${message}`);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: number, newStatus: 'Confirmed' | 'Cancelled') => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const response = await fetch(`${apiUrl}/api/reservations/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // 更新後に予約を再フェッチ
      fetchAllReservations();
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      alert(`Failed to update reservation status: ${message}`);
    }
  };

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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <p className="text-red-400 text-xl">エラーが発生しました: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 mb-4">
            管理者用予約管理
          </h1>
          <p className="text-xl text-gray-300">
            すべての予約の状況を確認・管理できます
          </p>
        </div>

        {reservations.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-2xl font-bold text-gray-300 mb-2">
              表示する予約がありません
            </h3>
            <p className="text-gray-400 mb-6">
              新しい予約が作成されるとここに表示されます
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-2xl p-6">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    予約ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    体験名
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    予約者
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    予約日
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    人数
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    ステータス
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    アクション
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {reservations.map((reservation) => (
                  <tr key={reservation.id} className="hover:bg-gray-700/30 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">
                      {reservation.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {reservation.harvestName || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {reservation.userName} ({reservation.userEmail})
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(reservation.reservationDate).toLocaleDateString('ja-JP')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {reservation.numberOfParticipants}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {getStatusBadge(reservation.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {reservation.status === 'Pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleStatusUpdate(reservation.id, 'Confirmed')}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors duration-200"
                          >
                            確定
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(reservation.id, 'Cancelled')}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200"
                          >
                            キャンセル
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}