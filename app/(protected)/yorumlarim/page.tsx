'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';

interface CommentItem {
  id: string;
  content: string;
  createdAt: string;
  post: {
    id: string;
    plantName: string;
    user: { firstName: string; lastName: string; avatar: string | null };
    analysis?: { diagnosis: string } | null;
  };
}

export default function YorumlarimPage() {
  const { token } = useAuthStore();
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    fetch('/api/users/me/comments', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Veriler alınamadı');
        const data = await res.json();
        setComments(data.comments || []);
      })
      .catch(() => setError('Yorumlar yüklenirken bir hata oluştu'))
      .finally(() => setIsLoading(false));
  }, [token]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Yorumlarım</h1>

      {isLoading && <p className="text-gray-500">Yükleniyor...</p>}
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-4">{error}</div>
      )}
      {!isLoading && !error && comments.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-500">
          Henüz yorum yapmamışsınız.
        </div>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-white rounded-2xl border border-gray-200 p-5">
            <Link href={`/paylasim`} className="text-sm text-green-600 hover:underline mb-2 block">
              {comment.post.plantName} paylaşımına yaptığınız yorum
            </Link>
            <p className="text-gray-700 mb-3">{comment.content}</p>
            <p className="text-xs text-gray-400">
              {new Date(comment.createdAt).toLocaleDateString('tr-TR')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
