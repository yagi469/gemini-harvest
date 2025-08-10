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
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Mock available times
  const mockAvailableTimes = ['10:00', '11:00', '14:00', '15:00', '16:00'];

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

    if (!selectedTime) {
      // New validation for selectedTime
      setReservationMessage('時間帯を選択してください。');
      return;
    }

    const reservationDateString = formatDate(selectedDate);

    // No need to validate availableSlots based on time here, as mock data is always available
    // The mock data assumes all times are available once a date is selected.

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
          reservationTime: selectedTime, // Include selected time
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
      setSelectedTime(null); // Clear selected time
      setNumberOfParticipants(1);

      // Close modal after successful reservation
      setTimeout(() => {
        // closeModal(); // No modal anymore
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

            {/* Reservation Form */}
            <form onSubmit={handleReservationSubmit} className="mt-8 space-y-8">
              {/* --- Section 1: Date and Time Selection --- */}
              <div className="bg-gray-700/30 rounded-2xl p-6 border border-gray-600/30">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-6">
                  ① 日時を選択
                </h2>

                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Calendar Column */}
                  <div className="lg:w-1/2">
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
                          setSelectedDate(date as Date);
                          setSelectedTime(null);
                        }}
                        value={selectedDate}
                        locale="ja-JP"
                        className="react-calendar-custom"
                        tileClassName={({ date, view }) => {
                          if (view !== 'month') return null;
                          const dateString = formatDate(date);
                          if (isSameDay(date, selectedDate))
                            return 'selected-date';
                          if (isSameDay(date, today)) return 'today-date';
                          if (
                            date < today ||
                            !harvest?.availableSlots?.[dateString]
                          )
                            return 'unavailable-date';
                          if (harvest.availableSlots[dateString] > 0)
                            return 'available-date';
                          return null;
                        }}
                        minDate={today}
                        tileDisabled={({ date, view }) => {
                          if (view !== 'month') return false;
                          const dateString = formatDate(date);
                          return (
                            date < today ||
                            !harvest?.availableSlots?.[dateString]
                          );
                        }}
                      />
                    </div>
                  </div>

                  {/* Time and Legend Column */}
                  <div className="lg:w-1/2">
                    {/* Time Selection */}
                    {selectedDate && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-300 mb-3">
                          空き時間
                        </h3>
                        <div className="grid grid-cols-3 gap-3">
                          {mockAvailableTimes.map((time) => (
                            <button
                              key={time}
                              type="button"
                              onClick={() => setSelectedTime(time)}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                selectedTime === time
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                              }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Selected Date Info */}
                    {selectedDate && (
                      <div className="mb-6 p-4 bg-gray-800/60 rounded-xl border border-gray-600/50 text-sm">
                        <p className="font-semibold text-white">
                          選択中の予約日
                        </p>
                        <p className="text-emerald-400 font-bold text-lg">
                          {selectedDate.toLocaleDateString('ja-JP')}
                          {harvest?.availableSlots &&
                            harvest.availableSlots[formatDate(selectedDate)] !==
                              undefined && (
                              <span className="ml-2 text-gray-300 font-medium text-sm">
                                (残り枠:{' '}
                                {
                                  harvest.availableSlots[
                                    formatDate(selectedDate)
                                  ]
                                }
                                名)
                              </span>
                            )}
                        </p>
                      </div>
                    )}

                    {/* Calendar Legend */}
                    <div className="p-4 bg-gray-800/60 rounded-xl border border-gray-600/50 text-sm text-gray-300">
                      <p className="font-semibold mb-2 text-white">
                        カレンダー凡例
                      </p>
                      <div className="flex flex-wrap gap-x-4 gap-y-2">
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
                  </div>
                </div>
              </div>

              {/* --- Section 2: Customer Information --- */}
              <div className="bg-gray-700/30 rounded-2xl p-6 border border-gray-600/30">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-6">
                  ② お客様情報を入力
                </h2>
                <div className="space-y-6">
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
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                予約を確定する
              </button>
            </form>

            {/* Final Confirmation Display & Messages */}
            <div className="mt-6 space-y-4">
              {selectedDate && selectedTime && (
                <div className="p-4 rounded-xl text-center bg-gray-700/50 border border-gray-600/50 text-gray-300">
                  <p className="font-semibold">
                    選択中の予約: {selectedDate.toLocaleDateString('ja-JP')}{' '}
                    {selectedTime}
                  </p>
                </div>
              )}

              {reservationMessage && (
                <div
                  className={`p-4 rounded-xl text-center ${
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
