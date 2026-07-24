import { create } from 'zustand';
import { useAuthStore } from './authStore';

interface SimilarCase {
  id: string;
  userName: string;
  userAvatar: string | null;
  diagnosis: string;
  status: string;
}

interface AnalysisResult {
  id: string;
  imageUrl: string;
  diagnosis: string;
  solutions: string[];
  severity?: string;
  prevention?: string[];
  similarCases: SimilarCase[];
  isPublic: boolean;
  status: string;
  createdAt: string;
}

interface AnalysisState {
  currentAnalysis: AnalysisResult | null;
  history: AnalysisResult[];
  isAnalyzing: boolean;
  error: string;
  analyzeImage: (file: File, isPublic: boolean, plantName?: string) => Promise<void>;
  fetchHistory: () => Promise<void>;
  clearCurrentAnalysis: () => void;
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  currentAnalysis: null,
  history: [],
  isAnalyzing: false,
  error: '',

  analyzeImage: async (file, isPublic, plantName) => {
    set({ isAnalyzing: true, error: '' });
    try {
      const token = useAuthStore.getState().token;
      if (!token) {
        set({ isAnalyzing: false, error: 'Giriş yapmanız gerekiyor' });
        return;
      }
      const formData = new FormData();
      formData.append('image', file);
      formData.append('isPublic', String(isPublic));
      if (plantName) formData.append('plantName', plantName);

      const res = await fetch('/api/analysis', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        set({ isAnalyzing: false, error: data.error || 'Analiz başarısız oldu' });
        return;
      }
      set({
        currentAnalysis: {
          ...data.analysis,
          similarCases: data.similarCases || [],
        },
        isAnalyzing: false,
      });
    } catch {
      set({ isAnalyzing: false, error: 'Bir bağlantı hatası oluştu' });
    }
  },

  fetchHistory: async () => {
    try {
      const token = useAuthStore.getState().token;
      if (!token) return;
      const res = await fetch('/api/analysis', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        set({ history: data.analyses || [] });
      }
    } catch {
      // sessizce geç
    }
  },

  clearCurrentAnalysis: () => set({ currentAnalysis: null }),
}));
