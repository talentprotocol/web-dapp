import create from "zustand";
import createContext from "zustand/context";

const messagesStore = create((set) => ({
  messageCount: 0,
  increaseMessageCount: () =>
    set((state) => ({ messageCount: state.messageCount + 1 })),
  clearMessageCount: () => set({ messageCount: 0 }),
}));

const railsContextStore = (railsContext) =>
  create(() => ({ railsContext: railsContext }));

const { Provider, useStore } = createContext();

export { useStore, Provider, messagesStore, railsContextStore };
