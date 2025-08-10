'use client';

import { useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
}

export default function ProfilePage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      redirect('/');
    }
    
    if (isLoaded && isSignedIn && user) {
      setProfile({
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        imageUrl: user.imageUrl,
      });
      setLoading(false);
    }
  }, [isLoaded, isSignedIn, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-400"></div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 mb-4">
            プロフィール
          </h1>
          <p className="text-xl text-gray-300">
            あなたのアカウント情報を管理できます
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* プロフィール画像 */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-emerald-500/50">
                <Image
                  src={profile.imageUrl}
                  alt="プロフィール画像"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>
            </div>

            {/* プロフィール情報 */}
            <div className="flex-1 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    姓
                  </label>
                  <div className="bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-gray-100">
                    {profile.lastName || '未設定'}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    名
                  </label>
                  <div className="bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-gray-100">
                    {profile.firstName || '未設定'}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    メールアドレス
                  </label>
                  <div className="bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-gray-100">
                    {profile.email}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    ユーザーID
                  </label>
                  <div className="bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-gray-100 font-mono text-sm">
                    {profile.id}
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105">
                  プロフィールを編集
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 追加情報セクション */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
            <h3 className="text-xl font-bold text-emerald-400 mb-4">予約状況</h3>
            <div className="text-center py-8">
              <div className="text-4xl font-bold text-emerald-400 mb-2">0</div>
              <p className="text-gray-300">現在の予約</p>
            </div>
            <a
              href="/reservations"
              className="block w-full text-center px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 rounded-lg transition-colors duration-300"
            >
              予約履歴を見る
            </a>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
            <h3 className="text-xl font-bold text-emerald-400 mb-4">お気に入り</h3>
            <div className="text-center py-8">
              <div className="text-4xl font-bold text-emerald-400 mb-2">0</div>
              <p className="text-gray-300">お気に入り体験</p>
            </div>
            <a
              href="/favorites"
              className="block w-full text-center px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 rounded-lg transition-colors duration-300"
            >
              お気に入りを見る
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
