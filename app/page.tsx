import { PostFeed } from '@/components/feed/PostFeed';

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          AI Destekli Bitki Sağlığı Platformu
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Bitkilerinizin Sağlığı
          <span className="text-green-600"> AgroKlinik</span>&apos;te
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Yapay zeka ile bitki hastalıklarını teşhis edin, topluluktan destek alın 
          ve tarımsal verimliliğinizi artırın.
        </p>
      </section>

      {/* Feature Cards */}
      <section className="grid md:grid-cols-3 gap-6 mb-12">
        <FeatureCard
          icon="🔬"
          title="AI Teşhis"
          description="Fotoğraf yükleyin, saniyeler içinde hastalık teşhisi alın"
        />
        <FeatureCard
          icon="👥"
          title="Topluluk"
          description="Deneyimli çiftçiler ve uzmanlardan destek alın"
        />
        <FeatureCard
          icon="📊"
          title="Takip"
          description="Tedavi süreçlerinizi izleyin ve analiz edin"
        />
      </section>

      {/* Public Feed */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Genel Paylaşımlar
          </h2>
          <select className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent">
            <option>En Yeni</option>
            <option>En Popüler</option>
            <option>Çözülenler</option>
          </select>
        </div>

        <PostFeed />
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { 
  icon: string; 
  title: string; 
  description: string;
}) {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-green-100 hover:border-green-300 hover:shadow-lg hover:shadow-green-100 transition-all duration-300">
      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}
