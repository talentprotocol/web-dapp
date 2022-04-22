import create from "zustand";

const messagesStore = create((set) => ({
  messageCount: 0,
  increaseMessageCount: () =>
    set((state) => ({ messageCount: state.messageCount + 1 })),
  clearMessageCount: () => set({ messageCount: 0 }),
}));

const railsContextStore = create((set) => ({
  railsContext: {},
  setRailsContext: (newRailsContext) => set({ railsContext: newRailsContext }),
}));

const urlStore = create((set) => ({
  url: "",
  changeURL: (newURL) => set({ url: newURL }),
}));

export { messagesStore, railsContextStore, urlStore };
