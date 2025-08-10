'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
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
  const router = useRouter(); // Initialize useRouter
  const [harvest, setHarvest] = useState<Harvest | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [id, setId] = useState<string>('');

  useEffect(() => {
    // paramsがPromiseなので、非同期で解決する必要があります
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
        <img
          src={
            harvest.imageData.startsWith('http')
              ? harvest.imageData
              : harvest.imageData.startsWith('/')
              ? `${process.env.NEXT_PUBLIC_BASE_URL || ''}${harvest.imageData}`
              : `data:image/jpeg;base64,${harvest.imageData}`
          }
          alt={harvest.name}
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
        <p className="text-gray-700 mb-4 leading-relaxed">
          {harvest.description}
        </p>
        <p className="text-gray-600 text-lg mb-2">
          場所: <span className="font-semibold">{harvest.location}</span>
        </p>
        <p className="text-green-800 font-extrabold text-2xl">
          価格: {harvest.price}円
        </p>
      </div>
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
