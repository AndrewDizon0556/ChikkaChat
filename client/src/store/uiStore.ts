import { create } from "zustand";

interface UIState {
  searchModalOpen: boolean;
  groupModalOpen: boolean;

  openSearchModal: () => void;
  closeSearchModal: () => void;
  openGroupModal: () => void;
  closeGroupModal: () => void;
}

/**
 * Lightweight store for cross-component UI state — lets surfaces like the
 * welcome screen trigger the "new chat" / "new group" modals that are rendered
 * by the sidebar, without prop-drilling through the page.
 */
export const useUIStore = create<UIState>((set) => ({
  searchModalOpen: false,
  groupModalOpen: false,

  openSearchModal: () => set({ searchModalOpen: true }),
  closeSearchModal: () => set({ searchModalOpen: false }),
  openGroupModal: () => set({ groupModalOpen: true }),
  closeGroupModal: () => set({ groupModalOpen: false }),
}));
