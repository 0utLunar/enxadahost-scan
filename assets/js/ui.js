import { PAGE_SIZE } from './config.js';
import { state } from './state.js';
import { escHtml } from './utils.js';
import {
  getEl,
  overlayEl,
  overlayCloseBtn,
  overlayTitleEl,
  overlayStatusEl,
  overlayPlayersEl,
  overlayPlayerListEl,
  overlayCopyBtn,
} from './dom.js';

export function showToast(msg, type = '') {
  const toast = getEl('toast');
  toast.textContent = msg;
  toast.className = 'toast show' + (type ? ' ' + type : '');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.className = 'toast';
  }, 3000);
}

export function updateHostDisplay() {
  const hostInput = getEl('host-input');
  const hostBadge = getEl('host-badge');

  if (hostInput) hostInput.value = state.host;
  if (hostBadge) hostBadge.textContent = `${state.host} · varredura de portas`;
}

export function updateStats() {
  const online = state.allResults.filter((item) => item.online).length;
  const offline = state.allResults.filter((item) => !item.online && item.checked).length;
  const players = state.allResults
    .filter((item) => item.online)
    .reduce((sum, item) => sum + (item.players || 0), 0);
  const scanned = state.allResults.filter((item) => item.checked).length;

  getEl('stat-online').textContent = online;
  getEl('stat-offline').textContent = offline;
  getEl('stat-players').textContent = players;
  getEl('stat-scanned').textContent = scanned;
}

export function updateVersionFilter() {
  const versionSelect = getEl('filter-version');
  const selectedValue = versionSelect.value;
  versionSelect.innerHTML = '<option value="">Todas as versões</option>';

  [...state.versions].sort().forEach((version) => {
    const option = document.createElement('option');
    option.value = version;
    option.textContent = version;
    if (version === selectedValue) option.selected = true;
    versionSelect.appendChild(option);
  });
}

export function applyFilters() {
  const versionFilter = getEl('filter-version').value;
  const minPlayers = parseInt(getEl('filter-min-players').value, 10) || 0;
  const maxPlayers =
    getEl('filter-max-players').value !== ''
      ? parseInt(getEl('filter-max-players').value, 10)
      : Infinity;
  const statusFilter = getEl('filter-status').value;
  const sortBy = getEl('filter-sort').value;

  state.filteredResults = state.allResults.filter((result) => {
    if (!result.checked) return false;
    if (statusFilter === 'online' && !result.online) return false;
    if (statusFilter === 'offline' && result.online) return false;

    if (result.online) {
      if (versionFilter && result.version !== versionFilter) return false;
      if ((result.players || 0) < minPlayers) return false;
      if ((result.players || 0) > maxPlayers) return false;
    } else if (statusFilter === 'online') {
      return false;
    }

    return true;
  });

  if (sortBy === 'players-desc') {
    state.filteredResults.sort((a, b) => (b.players || 0) - (a.players || 0));
  } else if (sortBy === 'players-asc') {
    state.filteredResults.sort((a, b) => (a.players || 0) - (b.players || 0));
  } else if (sortBy === 'version') {
    state.filteredResults.sort((a, b) => (a.version || '').localeCompare(b.version || ''));
  } else {
    state.filteredResults.sort((a, b) => a.port - b.port);
  }

  state.currentPage = 1;
  renderGrid();
  renderPagination();
  getEl('results-count').textContent = state.filteredResults.length;
}

function serverCard(result) {
  if (!result.checked) {
    return `<div class="server-card checking">
      <div class="card-top">
        <span class="card-ip">${state.host}:${result.port}</span>
        <span class="status-dot checking"></span>
      </div>
      <span class="card-skeleton" style="width:80px;height:14px;display:block;margin-bottom:8px;border-radius:4px"></span>
      <span class="card-skeleton" style="width:40px;height:20px;display:block;border-radius:4px"></span>
    </div>`;
  }

  if (!result.online) {
    return `<div class="server-card offline is-clickable" data-port="${result.port}">
      <div class="card-top">
        <span class="card-ip">${state.host}:${result.port}</span>
        <span class="status-dot offline"></span>
      </div>
      <span style="font-size:11px;color:var(--red);font-family:'JetBrains Mono',monospace">offline</span>
    </div>`;
  }

  const motdClean = (result.motd || '')
    .replace(/§./g, '')
    .replace(/[\x00-\x1F]/g, '')
    .trim();

  return `<div class="server-card online is-clickable" data-port="${result.port}">
    <div class="card-top">
      <span class="card-ip">${state.host}:${result.port}</span>
      <span class="status-dot online"></span>
    </div>
    ${result.version ? `<span class="card-version">${escHtml(result.version)}</span>` : ''}
    <div class="card-players">
      <span class="players-num">${result.players}</span>
      <span class="players-max">/${result.maxPlayers}</span>
      <span class="players-label">jogadores</span>
    </div>
    ${motdClean ? `<div class="card-motd">${escHtml(motdClean)}</div>` : ''}
  </div>`;
}

export function renderGrid() {
  const grid = getEl('servers-grid');
  const start = (state.currentPage - 1) * PAGE_SIZE;
  const pageResults = state.filteredResults.slice(start, start + PAGE_SIZE);

  const total = state.filteredResults.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  getEl('page-info').textContent =
    total > 0
      ? `Pág ${state.currentPage}/${totalPages} · ${start + 1}–${Math.min(start + PAGE_SIZE, total)} de ${total}`
      : '';

  if (!pageResults.length) {
    grid.innerHTML =
      '<div class="empty-state"><div class="big">🔍</div><p>Nenhum servidor encontrado com esses filtros</p></div>';
    return;
  }

  grid.innerHTML = pageResults.map((item) => serverCard(item)).join('');
}

export function renderPagination() {
  const total = state.filteredResults.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const pagination = getEl('pagination');

  if (totalPages <= 1) {
    pagination.innerHTML = '';
    return;
  }

  let html = `<button class="page-btn" onclick="goPage(${state.currentPage - 1})" ${
    state.currentPage === 1 ? 'disabled' : ''
  }>← Ant</button>`;

  for (let page = 1; page <= totalPages; page += 1) {
    if (totalPages > 10 && Math.abs(page - state.currentPage) > 2 && page !== 1 && page !== totalPages) {
      if (page === state.currentPage - 3 || page === state.currentPage + 3) {
        html += '<span style="color:var(--text-dim);padding:0 4px">…</span>';
      }
      continue;
    }

    html += `<button class="page-btn${page === state.currentPage ? ' active' : ''}" onclick="goPage(${page})">${page}</button>`;
  }

  html += `<button class="page-btn" onclick="goPage(${state.currentPage + 1})" ${
    state.currentPage === totalPages ? 'disabled' : ''
  }>Próx →</button>`;

  pagination.innerHTML = html;
}

export function goPage(page) {
  const totalPages = Math.ceil(state.filteredResults.length / PAGE_SIZE);
  if (page < 1 || page > totalPages) return;

  state.currentPage = page;
  renderGrid();
  renderPagination();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function getServerByPort(port) {
  return state.allResults.find((result) => result.port === port && result.checked) || null;
}

function renderOverlayPlayers(sample = []) {
  if (!sample.length) {
    overlayPlayerListEl.innerHTML = '<li class="overlay-empty">Nenhum nick visivel no momento</li>';
    return;
  }

  overlayPlayerListEl.innerHTML = sample.map((name) => `<li>${escHtml(name)}</li>`).join('');
}

export function openServerOverlay(server) {
  state.activeOverlayServer = server;
  overlayTitleEl.textContent = `${state.host}:${server.port}`;
  overlayStatusEl.textContent = server.online ? 'online' : 'offline';
  overlayStatusEl.className = `overlay-chip ${server.online ? 'online' : 'offline'}`;
  overlayPlayersEl.textContent = `${server.players || 0}/${server.maxPlayers || 0} jogadores`;
  renderOverlayPlayers(server.samplePlayers || []);

  overlayEl.classList.add('visible');
  overlayEl.setAttribute('aria-hidden', 'false');
}

export function closeServerOverlay() {
  overlayEl.classList.remove('visible');
  overlayEl.setAttribute('aria-hidden', 'true');
  state.activeOverlayServer = null;
}

export async function copyActiveServerAddress() {
  if (!state.activeOverlayServer) return;

  const address = `${state.host}:${state.activeOverlayServer.port}`;

  try {
    await navigator.clipboard.writeText(address);
    showToast('IP e porta copiados', 'green');
  } catch (_) {
    const input = document.createElement('input');
    input.value = address;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    input.remove();
    showToast('IP e porta copiados', 'green');
  }
}

export function bindGridClickHandler() {
  getEl('servers-grid').addEventListener('click', (event) => {
    const card = event.target.closest('.server-card.is-clickable[data-port]');
    if (!card) return;

    const port = Number(card.dataset.port);
    if (!Number.isFinite(port)) return;

    const server = getServerByPort(port);
    if (!server) return;

    openServerOverlay(server);
  });
}

export function initOverlayHandlers() {
  overlayCloseBtn.addEventListener('click', closeServerOverlay);
  overlayCopyBtn.addEventListener('click', copyActiveServerAddress);

  overlayEl.addEventListener('click', (event) => {
    if (event.target === overlayEl) closeServerOverlay();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && overlayEl.classList.contains('visible')) {
      closeServerOverlay();
    }
  });

  updateHostDisplay();
}
