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
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function HarvestDetailPage({ params }: PageProps) {
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
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center text-green-700 mb-10">
        {harvest.name}
      </h1>
      <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
        <p className="text-gray-700 mb-4">{harvest.description}</p>
        <p className="text-gray-600 text-lg mb-2">場所: {harvest.location}</p>
        <p className="text-green-800 font-bold text-2xl">
          価格: {harvest.price}円
        </p>
      </div>
      <div className="text-center mt-8">
        <Link href="/" className="text-blue-500 hover:underline">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
