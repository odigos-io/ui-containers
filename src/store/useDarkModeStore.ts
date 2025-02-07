import { create } from 'zustand'

interface DarkModeStoreState {
  darkMode: boolean
}

interface DarkModeStoreStateSetters {
  setDarkMode: (bool: boolean) => void
}

export const useDarkModeStore = create<DarkModeStoreState & DarkModeStoreStateSetters>((set) => ({
  darkMode: true,
  setDarkMode: (bool) => set({ darkMode: bool }),
}))
