import { create } from 'zustand';

interface StoreValues {
  isAwaitingInstrumentation: boolean;

  sourcesCreated: number;
  sourcesToCreate: number;
}

interface StoreSetters {
  setInstrumentAwait: (v: boolean) => void;
  setInstrumentCount: (k: keyof StoreValues, v: number) => void;
}

export const useInstrumentStore = create<StoreValues & StoreSetters>((set) => ({
  isAwaitingInstrumentation: false,

  sourcesCreated: 0,
  sourcesToCreate: 0,

  setInstrumentAwait: (v) => set({ isAwaitingInstrumentation: v }),
  setInstrumentCount: (k, v) => set({ [k]: v }),
}));
