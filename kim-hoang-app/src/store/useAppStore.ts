import { create } from 'zustand';

import { PALETTE } from '../data/palette';
import { PIG_INK_ORDER, type PigInkId } from '../data/pigInk';
import { ROOSTER_INK_ORDER, type RoosterInkId } from '../data/roosterInk';
import { type GuideId } from '../data/stepGuides';
import { DEFAULT_POEM_POS, DEFAULT_PRINT_POS } from '../utils/rect';

export type Motif = 'pig' | 'rooster' | 'custom';
export type ActiveMotif = 'pig' | 'rooster';
export type PaperColor = 'chuSa' | 'son';
export type AppStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

interface AppState {
  motif: Motif | null;
  carved: boolean;
  inked: boolean;
  paperColor: PaperColor | null;
  printed: boolean;
  /** Centre of the woodblock impression on the paper (0–1). */
  printPos: { nx: number; ny: number };
  /** Degrees the block was rotated when pressed. */
  printRot: number;
  /** Color step finished: all sequential plates rubbed in. */
  handColored: boolean;
  /** Pig reserved-white plate, rubbed in after the black stamp. */
  pigInkLayers: PigInkId[];
  /** Rooster ink plates revealed by sequential rubs on the paper. */
  roosterInkLayers: RoosterInkId[];
  /** Rooster only — scanned poem stamped onto the finished sheet. */
  poemAdded: boolean;
  poemPos: { nx: number; ny: number };
  currentStep: AppStep;
  selectedColor: string | null;
  soundEnabled: boolean;
  seenGuides: Partial<Record<GuideId, boolean>>;

  setMotif: (motif: Motif) => void;
  setCarved: () => void;
  setInked: () => void;
  setPaperColor: (color: PaperColor) => void;
  setPrintPos: (pos: { nx: number; ny: number }) => void;
  setPrintRot: (rot: number) => void;
  setPrinted: () => void;
  revealPigInkLayer: (layer: PigInkId) => void;
  undoPigInkLayer: () => void;
  revealRoosterInkLayer: (layer: RoosterInkId) => void;
  undoRoosterInkLayer: () => void;
  addPoem: () => void;
  setPoemPos: (pos: { nx: number; ny: number }) => void;
  setSelectedColor: (color: string | null) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setCurrentStep: (step: AppStep) => void;
  markGuideSeen: (id: GuideId) => void;
  reset: () => void;
}

const initialState = {
  motif: null as Motif | null,
  carved: false,
  inked: false,
  paperColor: null as PaperColor | null,
  printed: false,
  printPos: DEFAULT_PRINT_POS,
  printRot: 0,
  handColored: false,
  pigInkLayers: [] as PigInkId[],
  roosterInkLayers: [] as RoosterInkId[],
  poemAdded: false,
  poemPos: DEFAULT_POEM_POS,
  currentStep: 1 as AppStep,
  selectedColor: PALETTE.red as string | null,
  soundEnabled: true,
  seenGuides: {} as Partial<Record<GuideId, boolean>>,
};

/**
 * After stamping the B&W block onto red paper, both motifs paint on that
 * sheet (not on the wood). Pig rubs reserved white only; red is the paper.
 * The rooster then adds its scanned poem.
 */
export const useAppStore = create<AppState>((set, get) => ({
  ...initialState,

  setMotif: (motif) =>
    set({
      motif,
      currentStep: 2,
      carved: false,
      inked: false,
      paperColor: null,
      printed: false,
      printPos: DEFAULT_PRINT_POS,
      printRot: 0,
      handColored: false,
      pigInkLayers: [],
      roosterInkLayers: [],
      poemAdded: false,
      poemPos: DEFAULT_POEM_POS,
    }),

  setCarved: () => set({ carved: true, currentStep: 4 }),

  setInked: () => set({ inked: true, currentStep: 5 }),

  setPaperColor: (paperColor) => set({ paperColor, currentStep: 6 }),

  setPrintPos: (printPos) => set({ printPos }),

  setPrintRot: (printRot) => set({ printRot }),

  setPrinted: () => set({ currentStep: 7, printed: true }),

  revealPigInkLayer: (layer) => {
    if (get().motif !== 'pig') return;
    const cur = get().pigInkLayers;
    if (cur.includes(layer)) return;
    const next = [...cur, layer];
    set({
      pigInkLayers: next,
      handColored: next.length >= PIG_INK_ORDER.length,
    });
  },

  undoPigInkLayer: () => {
    if (get().motif !== 'pig') return;
    const next = get().pigInkLayers.slice(0, -1);
    set({
      pigInkLayers: next,
      handColored: next.length >= PIG_INK_ORDER.length,
    });
  },

  revealRoosterInkLayer: (layer) => {
    if (get().motif !== 'rooster') return;
    const cur = get().roosterInkLayers;
    if (cur.includes(layer)) return;
    const next = [...cur, layer];
    set({
      roosterInkLayers: next,
      handColored: next.length >= ROOSTER_INK_ORDER.length,
    });
  },

  undoRoosterInkLayer: () => {
    if (get().motif !== 'rooster') return;
    const next = get().roosterInkLayers.slice(0, -1);
    set({
      roosterInkLayers: next,
      handColored: next.length >= ROOSTER_INK_ORDER.length,
    });
  },

  addPoem: () => {
    if (get().motif !== 'rooster') return;
    set({ poemAdded: true, currentStep: 9 });
  },

  setPoemPos: (poemPos) => set({ poemPos }),

  setSelectedColor: (selectedColor) => set({ selectedColor }),

  setSoundEnabled: (soundEnabled) => set({ soundEnabled }),

  setCurrentStep: (currentStep) => set({ currentStep }),

  markGuideSeen: (id) =>
    set((s) => ({ seenGuides: { ...s.seenGuides, [id]: true } })),

  reset: () => set({ ...initialState }),
}));
