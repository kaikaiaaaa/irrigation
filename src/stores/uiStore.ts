import { create } from 'zustand';

interface UIState {
  isLoading: boolean;
  error: string | null;
  success: string | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSuccess: (success: string | null) => void;
  clearMessages: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  isLoading: false,
  error: null,
  success: null,

  setLoading: (loading: boolean) => set({ isLoading: loading }),
  
  setError: (error: string | null) => set({ error, success: null }),
  
  setSuccess: (success: string | null) => set({ success, error: null }),
  
  clearMessages: () => set({ error: null, success: null }),
}));
