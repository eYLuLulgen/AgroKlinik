'use client';

import { useEffect, useState } from 'react';

interface PostItem {
  id: string;
  plantName: string;
  description: string;
  imageUrl: string;
  status: string;
  likes: number;
  createdAt: string;
  user: { firstName: string; lastName: string; profession: string; avatar: string | null };
  analysis?: { diagnosis: string } | null;
  _count: { comments: number };
}

const statusColors: Record<string, string> = {
  'çözüldü': 'bg-green-100 text-green-700',
  'devam ediyor': 'bg-amber-100 text-amber-700',
  'beklemede': 'bg-gray-100 text-gray-600',
};

export function PostFeed() {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/posts')
      .then(async (res) => {
        if (!res.ok) throw new Error('Veriler alınamadı');
        const data = await res.json();
        setPosts(data.posts || []);
      })
      .catch(() => setError('Paylaşımlar yüklenirken bir hata oluştu'))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-center">
        {error}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-500">
        Henüz bir paylaşım yok. İlk paylaşımı sen yap!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <article key={post.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-green-200 hover:shadow-lg transition-all">
          <div className="p-5 pb-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
                {post.user.avatar || '🌱'}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">
                  {post.user.firstName} {post.user.lastName}
                </p>
                <p className="text-sm text-gray-500">{post.user.profession}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[post.status] || 'bg-gray-100 text-gray-600'}`}>
                {post.status}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-green-50 text-green-700 px-2 py-1 rounded text-sm font-medium">
                🌱 {post.plantName}
              </span>
              {post.analysis?.diagnosis && (
                <span className="bg-red-50 text-red-700 px-2 py-1 rounded text-sm font-medium">
                  🦠 {post.analysis.diagnosis}
                </span>
              )}
            </div>
            <p className="text-gray-700 mb-4">{post.description}</p>
            {post.imageUrl.startsWith('data:') ? (
              <img src={post.imageUrl} alt={post.plantName} className="w-full max-h-64 object-cover rounded-xl mb-4" />
            ) : (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl h-48 flex items-center justify-center mb-4 border border-green-100">
                <span className="text-6xl">{post.imageUrl || '🌱'}</span>
              </div>
            )}
          </div>
          <div className="px-5 py-3 border-t border-gray-100 flex items-center gap-6">
            <span className="flex items-center gap-2 text-gray-500 font-medium">
              ❤️ {post.likes}
            </span>
            <span className="flex items-center gap-2 text-gray-500 font-medium">
              💬 {post._count.comments} yorum
            </span>
            <span className="ml-auto text-sm text-gray-400">
              {new Date(post.createdAt).toLocaleDateString('tr-TR')}
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}
