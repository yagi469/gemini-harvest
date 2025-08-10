'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Harvest {
  id: number;
  name: string;
  description: string;
  location: string;
  price: number;
  imageData: string;
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

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Reservation form states
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [reservationDate, setReservationDate] = useState('');
  const [numberOfParticipants, setNumberOfParticipants] = useState(1);
  const [reservationMessage, setReservationMessage] = useState<string | null>(
    null
  );

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

  const openModal = () => {
    setIsModalOpen(true);
    setReservationMessage(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setReservationMessage(null);
  };

  const handleReservationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReservationMessage(null);

    if (!harvest) {
      setReservationMessage('収穫体験情報がありません。');
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const response = await fetch(`${apiUrl}/api/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          harvestId: harvest.id,
          userName,
          userEmail,
          reservationDate,
          numberOfParticipants,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      setReservationMessage('予約が完了しました！');
      // Clear form
      setUserName('');
      setUserEmail('');
      setReservationDate('');
      setNumberOfParticipants(1);
      
      // Close modal after successful reservation
      setTimeout(() => {
        closeModal();
      }, 2000);
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      setReservationMessage(`予約に失敗しました: ${message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  if (!harvest) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Harvest not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-8">
      <h1 className="text-5xl font-extrabold text-center text-green-800 mb-12 drop-shadow-md">
        {harvest.name}
      </h1>
      <div className="bg-white rounded-xl shadow-xl p-7 max-w-2xl mx-auto border border-gray-100">
        {harvest.imageData && (
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
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
        )}
        <p className="text-gray-700 mb-4 leading-relaxed">
          {harvest.description}
        </p>
        <p className="text-gray-600 text-lg mb-2">
          場所: <span className="font-semibold">{harvest.location}</span>
        </p>
        <p className="text-green-800 font-extrabold text-2xl">
          価格: {harvest.price}円
        </p>
        
        {/* 予約ボタン */}
        <div className="text-center mt-8">
          <button
            onClick={openModal}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300 shadow-md text-lg"
          >
            予約する
          </button>
        </div>
      </div>

      {/* 予約モーダル */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-green-700">
                予約フォーム
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleReservationSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="userName"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  お名前:
                </label>
                <input
                  type="text"
                  id="userName"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="userEmail"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  メールアドレス:
                </label>
                <input
                  type="email"
                  id="userEmail"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="reservationDate"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  予約日:
                </label>
                <input
                  type="date"
                  id="reservationDate"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={reservationDate}
                  onChange={(e) => setReservationDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="numberOfParticipants"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  参加人数:
                </label>
                <input
                  type="number"
                  id="numberOfParticipants"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={numberOfParticipants}
                  onChange={(e) =>
                    setNumberOfParticipants(parseInt(e.target.value))
                  }
                  min="1"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full transition-colors duration-300"
              >
                予約を確定する
              </button>
            </form>
            
            {reservationMessage && (
              <p
                className={`mt-4 text-center ${
                  reservationMessage.includes('失敗')
                    ? 'text-red-500'
                    : 'text-green-500'
                }`}
              >
                {reservationMessage}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="text-center mt-10">
        <button
          onClick={() => router.back()}
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 shadow-md"
        >
          前のページに戻る
        </button>
      </div>
    </div>
  );
}
