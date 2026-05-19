import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UiState {
  sidebarCollapsed: boolean;
  sidebarPinned: boolean;
  mobileSidebarOpen: boolean;
  activeModal: string | null;

  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSidebarPinned: (pinned: boolean) => void;
  setMobileSidebarOpen: (open: boolean) => void;
  openModal: (id: string) => void;
  closeModal: () => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      sidebarPinned: false,
      mobileSidebarOpen: false,
      activeModal: null,

      toggleSidebar: () =>
        set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setSidebarPinned: (pinned) => set({ sidebarPinned: pinned }),
      setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),
      openModal: (id) => set({ activeModal: id }),
      closeModal: () => set({ activeModal: null }),
    }),
    {
      name: 'lingoura-ui',
      // Only persist pin preference — collapse state resets on reload
      partialize: (s) => ({ sidebarPinned: s.sidebarPinned }),
    }
  )
);
