import { state } from './state.js';
import {
  showToast,
  updateStats,
  updateVersionFilter,
  applyFilters,
  updateHostDisplay,
  closeServerOverlay,
} from './ui.js';
import { getEl } from './dom.js';

async function checkServer(port, timeoutMs) {
  const url = `https://api.mcstatus.io/v2/status/java/${state.host}:${port}`;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);

    if (!response.ok) throw new Error('HTTP ' + response.status);

    const data = await response.json();
    return {
      port,
      checked: true,
      online: data.online === true,
      version: data.version?.name_clean || data.version?.name || null,
      players: data.players?.online ?? 0,
      maxPlayers: data.players?.max ?? 0,
      motd: data.motd?.clean || '',
      samplePlayers: (data.players?.list || [])
        .map((player) => player.name_clean || player.name_raw || player.name)
        .filter(Boolean),
    };
  } catch (_) {
    return {
      port,
      checked: true,
      online: false,
      version: null,
      players: 0,
      maxPlayers: 0,
      motd: '',
      samplePlayers: [],
    };
  }
}

export async function startScan() {
  const host = getEl('host-input').value.trim();
  const portStart = parseInt(getEl('port-start').value, 10);
  const portEnd = parseInt(getEl('port-end').value, 10);
  const concurrency = parseInt(getEl('concurrency').value, 10);
  const timeout = parseInt(getEl('timeout').value, 10);

  if (!host || /\s/.test(host)) {
    showToast('Host invalido', 'red');
    return;
  }

  if (Number.isNaN(portStart) || Number.isNaN(portEnd) || portStart > portEnd) {
    showToast('Intervalo de portas inválido', 'red');
    return;
  }

  if (portEnd - portStart > 2000) {
    showToast('Máximo de 2000 portas por varredura', 'red');
    return;
  }

  state.host = host;
  updateHostDisplay();

  clearResults();
  state.scanning = true;
  state.stopRequested = false;

  getEl('host-input').disabled = true;
  getEl('btn-scan').disabled = true;
  getEl('btn-stop').disabled = false;
  getEl('btn-stop').style.display = '';
  getEl('progress-wrap').classList.add('visible');

  const ports = [];
  for (let port = portStart; port <= portEnd; port += 1) {
    ports.push(port);
  }

  const total = ports.length;
  state.allResults = ports.map((port) => ({ port, checked: false }));
  state.versions.clear();

  let done = 0;
  let index = 0;

  async function worker() {
    while (index < ports.length && !state.stopRequested) {
      const port = ports[index];
      index += 1;

      const result = await checkServer(port, timeout);
      const resultIndex = state.allResults.findIndex((item) => item.port === port);
      if (resultIndex !== -1) state.allResults[resultIndex] = result;
      if (result.online && result.version) state.versions.add(result.version);

      done += 1;
      const pct = Math.round((done / total) * 100);

      getEl('progress-fill').style.width = pct + '%';
      getEl('progress-pct').textContent = pct + '%';
      getEl('progress-text').textContent = `Verificando porta ${port} · ${done}/${total} · Online: ${
        state.allResults.filter((item) => item.online).length
      }`;

      updateStats();
      updateVersionFilter();
      applyFilters();
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, total) }, () => worker());
  await Promise.all(workers);

  state.scanning = false;
  getEl('host-input').disabled = false;
  getEl('btn-scan').disabled = false;
  getEl('btn-stop').style.display = 'none';

  if (state.stopRequested) {
    showToast('Varredura interrompida', 'red');
    getEl('progress-text').textContent = `Interrompido · ${done}/${total} verificados`;
  } else {
    const onlineCount = state.allResults.filter((item) => item.online).length;
    showToast(`Varredura concluída · ${onlineCount} online de ${total}`, 'green');
    getEl('progress-text').textContent = `Concluído · ${onlineCount} servidores online de ${total}`;
  }

  applyFilters();
}

export function stopScan() {
  state.stopRequested = true;
  getEl('btn-stop').disabled = true;
}

export function clearResults() {
  state.allResults = [];
  state.filteredResults = [];
  state.currentPage = 1;
  state.versions.clear();

  updateStats();
  updateVersionFilter();

  getEl('results-count').textContent = '0';
  getEl('page-info').textContent = '';
  getEl('progress-wrap').classList.remove('visible');
  getEl('servers-grid').innerHTML =
    '<div class="empty-state"><div class="big">⛏</div><p>Configure o intervalo de portas e inicie a varredura</p></div>';
  getEl('pagination').innerHTML = '';

  closeServerOverlay();
}
