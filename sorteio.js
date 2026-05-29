const STORAGE_KEYS = {
  drawnIds: "album-ti-drawn-ids-v1",
  history: "album-ti-draw-history-v1",
};

const PACK_SIZE = 4;
const albumData = window.albumTiData || {};
const people = typeof albumData.getPeople === "function" ? albumData.getPeople() : [];
const stickerImages = albumData.stickerImages || {};

const resultGrid = document.getElementById("resultGrid");
const drawButton = document.getElementById("drawButton");
const resetButton = document.getElementById("resetButton");
const remainingCount = document.getElementById("remainingCount");
const drawnCount = document.getElementById("drawnCount");
const packCount = document.getElementById("packCount");
const historyList = document.getElementById("historyList");
const statusMessage = document.getElementById("statusMessage");

let currentSelection = [];

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.warn("Nao foi possivel ler o armazenamento local.", error);
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn("Nao foi possivel salvar o sorteio.", error);
  }
}

function getDrawnIds() {
  const ids = readStorage(STORAGE_KEYS.drawnIds, []);
  return Array.isArray(ids) ? ids : [];
}

function getHistory() {
  const history = readStorage(STORAGE_KEYS.history, []);
  return Array.isArray(history) ? history : [];
}

function getAvailablePeople() {
  const drawnIds = new Set(getDrawnIds());
  return people.filter((person) => !drawnIds.has(person.id));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getInitials(name) {
  return String(name)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] || "")
    .join("")
    .toUpperCase();
}

function randomIndex(max) {
  if (window.crypto && typeof window.crypto.getRandomValues === "function") {
    const values = new Uint32Array(1);
    window.crypto.getRandomValues(values);
    return values[0] % max;
  }

  return Math.floor(Math.random() * max);
}

function shuffle(items) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = randomIndex(index + 1);
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

function renderPhoto(person) {
  const image = stickerImages[person.id];

  if (!image) {
    return `<div class="player-photo" aria-hidden="true">${escapeHtml(getInitials(person.name))}</div>`;
  }

  const src = escapeHtml(image.src);
  const alt = escapeHtml(image.alt || person.name);
  return `
    <div class="player-photo">
      <img src="${src}" alt="${alt}" loading="lazy" />
    </div>
  `;
}

function renderPersonCard(person, index) {
  return `
    <article class="player-card" style="animation-delay: ${index * 70}ms">
      <span class="player-index">${index + 1}</span>
      <div class="player-main">
        ${renderPhoto(person)}
        <div class="player-copy">
          <strong>${escapeHtml(person.name)}</strong>
          <span>${escapeHtml(person.team)} | ${escapeHtml(person.teamTitle)}</span>
        </div>
      </div>
      <div class="player-role">${escapeHtml(person.role)}</div>
    </article>
  `;
}

function renderSlots(selection = []) {
  const slots = Array.from({ length: PACK_SIZE }, (_, index) => {
    const person = selection[index];

    if (person) {
      return renderPersonCard(person, index);
    }

    const label = selection.length === 0 ? "Aguardando sorteio" : "Fim do album";
    return `<div class="empty-slot">${label}</div>`;
  });

  resultGrid.innerHTML = slots.join("");
}

function renderHistory() {
  const history = getHistory();

  if (history.length === 0) {
    historyList.innerHTML = '<p class="history-empty">Nenhum pacote sorteado</p>';
    return;
  }

  historyList.innerHTML = history
    .slice()
    .reverse()
    .map((pack, index, list) => {
      const packNumber = list.length - index;
      const names = pack.people.map((person) => person.name).join(", ");
      const date = new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(pack.drawnAt));

      return `
        <article class="history-item">
          <strong>Pacote ${packNumber} | ${date}</strong>
          <span>${escapeHtml(names)}</span>
        </article>
      `;
    })
    .join("");
}

function updateStatus() {
  const drawnIds = getDrawnIds();
  const available = getAvailablePeople();
  const history = getHistory();

  remainingCount.textContent = available.length;
  drawnCount.textContent = drawnIds.length;
  packCount.textContent = history.length;

  const nextSize = Math.min(PACK_SIZE, available.length);
  drawButton.disabled = available.length === 0;
  drawButton.textContent = available.length === 0 ? "Sorteio encerrado" : `Sortear ${nextSize} nomes`;

  if (available.length === 0) {
    statusMessage.textContent = "Todas as pessoas ja foram sorteadas. O monte esta encerrado.";
    return;
  }

  if (currentSelection.length > 0) {
    statusMessage.textContent = "Pacote sorteado e removido do monte.";
    return;
  }

  statusMessage.textContent = `${available.length} pessoas ainda podem sair no sorteio.`;
}

function drawNextPack() {
  const available = getAvailablePeople();

  if (available.length === 0) {
    updateStatus();
    return;
  }

  const selection = shuffle(available).slice(0, Math.min(PACK_SIZE, available.length));
  const drawnIds = [...new Set([...getDrawnIds(), ...selection.map((person) => person.id)])];
  const history = getHistory();

  history.push({
    drawnAt: new Date().toISOString(),
    people: selection.map((person) => ({
      id: person.id,
      name: person.name,
      team: person.team,
      teamTitle: person.teamTitle,
      role: person.role,
    })),
  });

  currentSelection = selection;
  writeStorage(STORAGE_KEYS.drawnIds, drawnIds);
  writeStorage(STORAGE_KEYS.history, history);
  renderSlots(selection);
  renderHistory();
  updateStatus();
}

function resetDraw() {
  const confirmed = window.confirm("Reiniciar todo o historico de sorteio?");

  if (!confirmed) {
    return;
  }

  currentSelection = [];
  writeStorage(STORAGE_KEYS.drawnIds, []);
  writeStorage(STORAGE_KEYS.history, []);
  renderSlots();
  renderHistory();
  updateStatus();
}

drawButton.addEventListener("click", drawNextPack);
resetButton.addEventListener("click", resetDraw);

const savedHistory = getHistory();
currentSelection = savedHistory.length > 0 ? savedHistory[savedHistory.length - 1].people : [];
renderSlots(currentSelection);
renderHistory();
updateStatus();
