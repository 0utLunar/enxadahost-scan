function getEl(id) {
  return document.getElementById(id);
}

export const overlayEl = getEl('server-overlay');
export const overlayCloseBtn = getEl('overlay-close');
export const overlayTitleEl = getEl('overlay-title');
export const overlayStatusEl = getEl('overlay-status');
export const overlayPlayersEl = getEl('overlay-players');
export const overlayPlayerListEl = getEl('overlay-player-list');
export const overlayCopyBtn = getEl('overlay-copy');

export { getEl };
