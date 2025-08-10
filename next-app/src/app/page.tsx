'use client';

import { useState, useEffect } from 'react';

interface Harvest {
  id: number;
  name: string;
  description: string;
  location: string;
  price: number;
}

export default function Home() {
  const [harvests, setHarvests] = useState<Harvest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHarvests = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        const response = await fetch(`${apiUrl}/api/harvests`);
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
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-8">
      <h1 className="text-5xl font-extrabold text-center text-green-800 mb-12 drop-shadow-md">農業収穫体験アプリ</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {harvests.map((harvest) => (
          <a key={harvest.id} href={`/harvests/${harvest.id}`} className="bg-white rounded-xl shadow-xl p-7 block hover:shadow-2xl hover:scale-102 transition-all duration-300 border border-gray-100 transform">
            <h2 className="text-2xl font-bold text-green-700 mb-3">{harvest.name}</h2>
            <p className="text-gray-700 mb-3 leading-relaxed line-clamp-3">{harvest.description}</p>
            <p className="text-gray-600 text-md mb-2">場所: <span className="font-semibold">{harvest.location}</span></p>
            <p className="text-green-800 font-extrabold text-xl">価格: {harvest.price}円</p>
          </a>
        ))}
      </div>
    </div>
  );
}