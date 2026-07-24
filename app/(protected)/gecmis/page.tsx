'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useAnalysisStore } from '@/store/analysisStore';

export default function GecmisPage() {
  const { token } = useAuthStore();
  const { fetchHistory, history } = useAnalysisStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    fetchHistory()
      .then(() => setIsLoading(false))
      .catch(() => {
        setError('Veriler yüklenirken hata oluştu');
        setIsLoading(false);
      });
  }, [token, fetchHistory]);

  const statusColors: Record<string, string> = {
    'çözüldü': 'bg-green-100 text-green-700',
    'devam ediyor': 'bg-amber-100 text-amber-700',
    'beklemede': 'bg-gray-100 text-gray-600',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Geçmiş Veriler</h1>

      {isLoading && <p className="text-gray-500">Yükleniyor...</p>}
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-4">{error}</div>
      )}
      {!isLoading && !error && history.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-500">
          Henüz bir analiz kaydınız yok.
        </div>
      )}

      <div className="space-y-4">
        {history.map((item: any) => (
          <div key={item.id} className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-900">{item.diagnosis}</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[item.status] || 'bg-gray-100 text-gray-600'}`}>
                {item.status}
              </span>
            </div>
            {item.imageUrl && item.imageUrl.startsWith('data:') && (
              <img src={item.imageUrl} alt="Analiz" className="w-full max-h-48 object-cover rounded-xl mb-3" />
            )}
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 mb-3">
              {item.solutions?.map((s: string, i: number) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
            <p className="text-xs text-gray-400">
              {new Date(item.createdAt).toLocaleDateString('tr-TR')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
