'use client';

import { useState, useCallback } from 'react';
import { useAnalysisStore } from '@/store/analysisStore';

const severityColors: Record<string, string> = {
  'düşük': 'bg-green-100 text-green-700 border-green-200',
  'orta': 'bg-amber-100 text-amber-700 border-amber-200',
  'yüksek': 'bg-red-100 text-red-700 border-red-200',
};

export default function SorunEklePage() {
  const [isPublic, setIsPublic] = useState(true);
  const [plantName, setPlantName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const { analyzeImage, currentAnalysis, isAnalyzing, error } = useAnalysisStore();

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleAnalyze = async () => {
    if (file) {
      await analyzeImage(file, isPublic, plantName || undefined);
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔬 AI Analiz Merkezi
          </h1>
          <p className="text-gray-600">
            Bitki fotoğrafınızı yükleyin, yapay zeka hastalığı tespit etsin
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            {/* Plant Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bitki Adı (opsiyonel)
              </label>
              <input
                type="text"
                value={plantName}
                onChange={(e) => setPlantName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                placeholder="örn: Domates, Gül, Buğday..."
              />
            </div>

            {/* Dropzone */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
              onDragLeave={() => setIsDragActive(false)}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                isDragActive
                  ? 'border-green-500 bg-green-50'
                  : preview
                  ? 'border-green-300 bg-green-50/50'
                  : 'border-gray-300 hover:border-green-400 hover:bg-green-50/30'
              }`}
            >
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                {preview ? (
                  <div className="space-y-4">
                    <img src={preview} alt="Yüklenen bitki" className="w-full max-h-64 object-contain rounded-xl mx-auto" />
                    <p className="text-sm text-gray-500">Farklı bir fotoğraf yüklemek için tıklayın</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-3xl">📷</span>
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-700">
                        {isDragActive ? 'Bırakın!' : 'Fotoğraf yükleyin'}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">JPEG, PNG, WebP veya GIF (maks 10MB)</p>
                    </div>
                  </div>
                )}
              </label>
            </div>

            {/* Privacy Toggle */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Paylaşım Ayarı</p>
                  <p className="text-sm text-gray-500">
                    {isPublic ? 'Herkes görebilir' : 'Sadece siz görebilirsiniz'}
                  </p>
                </div>
                <button
                  onClick={() => setIsPublic(!isPublic)}
                  className={`relative w-14 h-8 rounded-full transition-colors ${isPublic ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${isPublic ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={!file || isAnalyzing}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 text-white py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-3"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analiz Ediliyor...
                </>
              ) : (
                <>🔍 Analizi Başlat</>
              )}
            </button>

            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                <span>⚠️</span>
                {error}
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {isAnalyzing && (
              <div className="bg-white rounded-2xl border border-green-200 p-8 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
                </div>
                <p className="text-lg font-medium text-gray-900">Yapay Zeka Çalışıyor</p>
                <p className="text-gray-500 mt-2">Bitkiniz analiz ediliyor...</p>
              </div>
            )}

            {currentAnalysis && !isAnalyzing && (
              <>
                {/* Diagnosis + Severity */}
                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border border-red-200 p-6">
                  <div className="flex items-start gap-4 mb-3">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">🦠</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">Tespit Edilen Sorun</h3>
                      <p className="text-red-700 font-medium text-lg">{currentAnalysis.diagnosis}</p>
                    </div>
                  </div>
                  {currentAnalysis.severity && (
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-sm text-gray-600">Şiddet:</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${severityColors[currentAnalysis.severity] || severityColors['orta']}`}>
                        {currentAnalysis.severity}
                      </span>
                    </div>
                  )}
                </div>

                {/* Solutions */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">💊</div>
                    <h3 className="font-semibold text-gray-900">Önerilen Çözümler</h3>
                  </div>
                  <ol className="space-y-3">
                    {(currentAnalysis.solutions || []).map((solution, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center text-sm font-semibold text-green-700 flex-shrink-0">{index + 1}</span>
                        <span className="text-gray-700">{solution}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Prevention */}
                {(currentAnalysis.prevention || []).length > 0 && (
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">🛡️</div>
                      <h3 className="font-semibold text-gray-900">Önleme Önerileri</h3>
                    </div>
                    <ul className="space-y-2">
                      {(currentAnalysis.prevention || []).map((tip, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="text-blue-500 flex-shrink-0">•</span>
                          <span className="text-gray-700">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Similar Cases */
                {(currentAnalysis.similarCases || []).length > 0 && (
                  <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">👥</div>
                      <h3 className="font-semibold text-gray-900">Benzer Sorunu Yaşayanlar</h3>
                    </div>
                    <div className="space-y-3">
                      {(currentAnalysis.similarCases || []).map((caseItem) => (
                        <div key={caseItem.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg">{caseItem.userAvatar}</div>
                            <div>
                              <p className="font-medium text-gray-900">{caseItem.userName}</p>
                              <p className="text-sm text-gray-500">{caseItem.diagnosis}</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            caseItem.status === 'çözüldü' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {caseItem.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {!currentAnalysis && !isAnalyzing && (
              <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8 text-center">
                <span className="text-5xl mb-4 block">🌿</span>
                <p className="text-gray-600">Fotoğraf yükleyip analizi başlattığınızda sonuçlar burada görünecek</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
