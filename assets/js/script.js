import { applyFilters, bindGridClickHandler, goPage, initOverlayHandlers } from './ui.js';
import { clearResults, startScan, stopScan } from './scanner.js';

window.startScan = startScan;
window.stopScan = stopScan;
window.clearResults = clearResults;
window.applyFilters = applyFilters;
window.goPage = goPage;

bindGridClickHandler();
initOverlayHandlers();
