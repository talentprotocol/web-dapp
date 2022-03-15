import create from "zustand";

const useStore = create((set) => ({
  messageCount: 0,
  increaseMessageCount: () =>
    set((state) => ({ messageCount: state.messageCount + 1 })),
  clearMessageCount: () => set({ messageCount: 0 }),
}));

export { useStore };
