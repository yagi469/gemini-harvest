'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

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

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Today's date (for calendar logic)
  const [today] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0); // Normalize to the start of the day
    return d;
  });

  // Reservation form states
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [numberOfParticipants, setNumberOfParticipants] = useState(1);
  const [reservationMessage, setReservationMessage] = useState<string | null>(
    null
  );

  // Helper function to check if two dates are the same day
  const isSameDay = (a: Date | null, b: Date | null) => {
    if (!a || !b) return false;
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  };

  // Helper function to format a Date object to 'YYYY-MM-DD' string
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

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

    if (!selectedDate) {
      setReservationMessage('予約日を選択してください。');
      return;
    }

    const reservationDateString = formatDate(selectedDate);

    // Validate selected date has available slots
    if (
      !harvest.availableSlots ||
      !harvest.availableSlots[reservationDateString]
    ) {
      setReservationMessage(
        '選択された日付は予約できません。別の利用可能な日付を選択してください。'
      );
      return;
    }

    // Validate number of participants against available slots
    if (numberOfParticipants > harvest.availableSlots[reservationDateString]) {
      setReservationMessage(
        `選択された人数 (${numberOfParticipants}名) は、この日の残り予約枠 (${harvest.availableSlots[reservationDateString]}名) を超えています。`
      );
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
          reservationDate: reservationDateString,
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
      setSelectedDate(null); // Clear selected date
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

            {/* 予約ボタン */}
            <div className="text-center">
              <button
                onClick={openModal}
                className="inline-flex items-center px-10 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold text-xl rounded-2xl shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105"
              >
                <span className="mr-2">📅</span>
                予約する
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 予約モーダル */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-600/50">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                予約フォーム
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white text-3xl font-bold transition-colors duration-300 hover:scale-110"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleReservationSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="userName"
                  className="block text-gray-300 text-sm font-semibold mb-3"
                >
                  お名前
                </label>
                <input
                  type="text"
                  id="userName"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="山田太郎"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="userEmail"
                  className="block text-gray-300 text-sm font-semibold mb-3"
                >
                  メールアドレス
                </label>
                <input
                  type="email"
                  id="userEmail"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="example@email.com"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="reservationDate"
                  className="block text-gray-300 text-sm font-semibold mb-3"
                >
                  予約日
                </label>
                <p className="text-gray-400 text-sm mb-2">
                  カレンダーから予約可能な日付を選択してください。
                </p>
                <div className="bg-gray-700/50 border border-gray-600/50 rounded-xl p-4">
                  <Calendar
                    onChange={(value) => {
                      const date = Array.isArray(value) ? value[0] : value;
                      // The type assertion is safe because we are not using selectRange
                      setSelectedDate(date as Date);
                    }}
                    value={selectedDate}
                    locale="ja-JP"
                    className="react-calendar-custom"
                    tileClassName={({ date, view }) => {
                      if (view !== 'month') {
                        return null;
                      }

                      const dateString = formatDate(date);

                      // 1. Selected date
                      if (isSameDay(date, selectedDate)) {
                        return 'selected-date';
                      }
                      // 2. Today
                      if (isSameDay(date, today)) {
                        return 'today-date';
                      }
                      // 3. Past or unavailable dates
                      if (date < today || !harvest?.availableSlots?.[dateString]) {
                        return 'unavailable-date';
                      }
                      // 4. Future, available dates
                      if (harvest.availableSlots[dateString] > 0) {
                        return 'available-date';
                      }

                      return null;
                    }}
                    minDate={today} // Prevent selecting past dates
                    tileDisabled={({ date, view }) => {
                      if (view !== 'month') return false;
                      const dateString = formatDate(date);
                      // Disable if it's a past date or has no slots available
                      return date < today || !harvest?.availableSlots?.[dateString];
                    }}
                  />
                </div>
                {selectedDate && (
                  <p className="text-emerald-400 text-sm mt-2">
                    選択中の予約日: {selectedDate.toLocaleDateString('ja-JP')}
                    {harvest?.availableSlots && harvest.availableSlots[formatDate(selectedDate)] !== undefined && (
                      <span className="ml-2"> (残り枠: {harvest.availableSlots[formatDate(selectedDate)]}名)</span>
                    )}
                  </p>
                )}
              </div>

              {/* Calendar Legend */}
              <div className="mt-6 p-4 bg-gray-700/50 rounded-xl border border-gray-600/50 text-sm text-gray-300">
                <p className="font-semibold mb-2">カレンダー凡例:</p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center">
                    <span className="w-4 h-4 rounded-sm bg-emerald-500 mr-2"></span>
                    <span>選択中の日</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-4 h-4 rounded-sm border-2 border-emerald-500 mr-2"></span>
                    <span>今日</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-4 h-4 rounded-sm bg-gray-700 border border-gray-600 mr-2"></span>
                    <span>予約可能な日</span>
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="numberOfParticipants"
                  className="block text-gray-300 text-sm font-semibold mb-3"
                >
                  参加人数
                </label>
                <input
                  type="number"
                  id="numberOfParticipants"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
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
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                予約を確定する
              </button>
            </form>

            {reservationMessage && (
              <div
                className={`mt-6 p-4 rounded-xl text-center ${
                  reservationMessage.includes('失敗')
                    ? 'bg-red-500/20 border border-red-500/30 text-red-300'
                    : 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300'
                }`}
              >
                <p className="font-semibold">{reservationMessage}</p>
              </div>
            )}
          </div>
        </div>
      )}

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
