import { DEFAULT_HOST } from './config.js';

export const state = {
  host: DEFAULT_HOST,
  allResults: [],
  filteredResults: [],
  currentPage: 1,
  scanning: false,
  stopRequested: false,
  versions: new Set(),
  activeOverlayServer: null,
};
