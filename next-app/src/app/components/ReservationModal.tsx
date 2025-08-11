'use client';

import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Link from 'next/link';

import { UserResource } from '@clerk/types'; // Import UserResource type

interface Harvest {
  id: number;
  name: string;
  description: string;
  location: string;
  price: number;
  imageData: string;
  availableSlots: { [key: string]: number };
}

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  harvest: Harvest | null;
  isSignedIn: boolean;
  user: UserResource | null | undefined; // Add user prop
}

export default function ReservationModal({ isOpen, onClose, harvest, isSignedIn, user }: ReservationModalProps) {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [numberOfParticipants, setNumberOfParticipants] = useState(1);
  const [reservationMessage, setReservationMessage] = useState<string | null>(null);
  const [showSuccessPrompt, setShowSuccessPrompt] = useState<boolean>(false);

  // Today's date (for calendar logic)
  const [today] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0); // Normalize to the start of the day
    return d;
  });

  // Mock available times
  const mockAvailableTimes = ['10:00', '11:00', '14:00', '15:00', '16:00'];

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
    if (isOpen) {
      // Reset form fields when modal opens
      setUserName('');
      setUserEmail('');
      setSelectedDate(null);
      setSelectedTime(null);
      setNumberOfParticipants(1);
      setReservationMessage(null); // Clear any previous messages
      setShowSuccessPrompt(false); // Hide success prompt

      // Pre-fill user information if signed in
      if (isSignedIn && user) {
        setUserName(user.fullName || '');
        setUserEmail(user.primaryEmailAddress?.emailAddress || '');
      }
    }
  }, [isOpen, isSignedIn, user]); // Add isSignedIn and user to dependency array

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
      setReservationMessage('時間帯を選択してください。');
      return;
    }

    const reservationDateString = formatDate(selectedDate);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const response = await fetch(`${apiUrl}/api/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          harvestId: harvest.id,
          userId: user?.id, // Include userId if available
          userName,
          userEmail,
          reservationDate: reservationDateString,
          reservationTime: selectedTime,
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

      if (isSignedIn) {
        setTimeout(() => {
          onClose();
        }, 5000);
      } else {
        setShowSuccessPrompt(true);
      }

    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      setReservationMessage(`予約に失敗しました: ${message}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative border border-gray-700">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold"
        >
          &times;
        </button>
        <div className="p-8">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-6 text-center">
            収穫体験を予約する
          </h2>

          <form onSubmit={handleReservationSubmit} className="space-y-8">
            {/* --- Section 1: Date and Time Selection --- */}
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-6">
                ① 日時を選択
              </h3>
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
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-6">
                ② お客様情報を入力
              </h3>
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

            {/* Final Confirmation Display & Messages */}
            <div className="mt-6 space-y-4">
              {selectedDate && selectedTime && !showSuccessPrompt && (
                <div className="p-4 rounded-xl text-center bg-gray-700/50 border border-gray-600/50 text-gray-300">
                  <p className="font-semibold">
                    選択中の予約: {selectedDate.toLocaleDateString('ja-JP')}{' '}
                    {selectedTime}
                  </p>
                </div>
              )}

              {reservationMessage && !showSuccessPrompt && (
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

            {reservationMessage ? (
              <div className="text-center space-y-4">
                <p className="text-xl font-bold text-emerald-400">
                  {reservationMessage}
                </p>
                {isSignedIn ? (
                  <button
                    onClick={onClose}
                    className="mt-4 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-400 rounded-lg transition-colors duration-300"
                  >
                    閉じる
                  </button>
                ) : (
                  <div className="text-center space-y-4">
                    <p className="text-gray-300">
                      予約履歴を管理するために、アカウントを作成またはログインしますか？
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                      <Link
                        href="/sign-up"
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors duration-300"
                      >
                        新規登録
                      </Link>
                      <Link
                        href="/sign-in"
                        className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors duration-300"
                      >
                        ログイン
                      </Link>
                    </div>
                    <button
                      onClick={onClose}
                      className="mt-4 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-400 rounded-lg transition-colors duration-300"
                    >
                      閉じる
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                予約を確定する
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
