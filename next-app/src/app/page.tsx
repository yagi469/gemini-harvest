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
      } catch (e: any) {
        setError(e.message);
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
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center text-green-700 mb-10">農業収穫体験アプリ</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {harvests.map((harvest) => (
          <div key={harvest.id} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-green-600 mb-2">{harvest.name}</h2>
            <p className="text-gray-700 mb-2">{harvest.description}</p>
            <p className="text-gray-600 text-sm mb-1">場所: {harvest.location}</p>
            <p className="text-green-800 font-bold">価格: {harvest.price}円</p>
          </div>
        ))}
      </div>
    </div>
  );
}