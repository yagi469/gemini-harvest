'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Harvest {
  id: number;
  name: string;
  description: string;
  location: string;
  price: number;
  imageData: string;
}

export default function Home() {
  const [harvests, setHarvests] = useState<Harvest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHarvests = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        const response = await fetch(`${apiUrl}/api/harvests`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Harvest[] = await response.json();
        // Display only a limited number of recommended harvests on the homepage
        setHarvests(data.slice(0, 3)); // Display first 3 as recommended
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchHarvests();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-8">
      <h1 className="text-5xl font-extrabold text-center text-green-800 mb-12 drop-shadow-md">
        おすすめ収穫体験
      </h1>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          Loading...
        </div>
      ) : error ? (
        <div className="flex justify-center items-center min-h-screen text-red-500">
          Error: {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {harvests.map((harvest) => (
            <Link
              key={harvest.id}
              href={`/harvests/${harvest.id}`}
              className="bg-white rounded-xl shadow-xl p-7 block hover:shadow-2xl hover:scale-102 transition-all duration-300 border border-gray-100 transform"
            >
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
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h2 className="text-2xl font-bold text-green-700 mb-3">
                {harvest.name}
              </h2>
              <p className="text-gray-700 mb-3 leading-relaxed line-clamp-3">
                {harvest.description}
              </p>
              <p className="text-gray-600 text-md mb-2">
                場所: <span className="font-semibold">{harvest.location}</span>
              </p>
              <p className="text-green-800 font-extrabold text-xl">
                価格: {harvest.price}円
              </p>
            </Link>
          ))}
        </div>
      )}
      <div className="text-center mt-12">
        <Link
          href="/harvests/all"
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 shadow-md"
        >
          すべての収穫体験を見る
        </Link>
      </div>
    </div>
  );
}
