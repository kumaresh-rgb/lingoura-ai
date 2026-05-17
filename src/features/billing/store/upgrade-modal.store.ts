import { create } from 'zustand';

interface UpgradeModalState {
  isOpen: boolean;
  featureLabel: string;
  featureContext: string;

  openModal: (featureLabel: string, featureContext?: string) => void;
  closeModal: () => void;
}

export const useUpgradeModalStore = create<UpgradeModalState>()((set) => ({
  isOpen: false,
  featureLabel: '',
  featureContext: '',

  openModal: (featureLabel, featureContext = '') =>
    set({ isOpen: true, featureLabel, featureContext }),

  closeModal: () => set({ isOpen: false, featureLabel: '', featureContext: '' }),
}));
