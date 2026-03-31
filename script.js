const coverStage = document.getElementById("coverStage");
const albumStage = document.getElementById("albumStage");
const book = document.getElementById("book");
const coverCard = document.querySelector(".cover-card");
const openAlbumButton = document.getElementById("openAlbum");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const spreadCounter = document.getElementById("spreadCounter");
const progressDotsContainer = document.getElementById("progressDots");

const teamDefinitions = [
  {
    id: "team-1",
    team: "Time 1",
    title: "Lideres",
    leader: { id: "time1-bruno", name: "Bruno" },
    members: [
      { id: "time1-wagner", name: "Wagner" },
      { id: "time1-paty", name: "Paty" },
      { id: "time1-derso", name: "Derso" },
    ],
  },
  {
    id: "team-2",
    team: "Time 2",
    title: "Dados",
    leader: { id: "time2-gustavo", name: "Gustavo" },
    members: [
      { id: "time2-adriano", name: "Adriano" },
      { id: "time2-deiviny", name: "Deiviny" },
    ],
  },
  {
    id: "team-3",
    team: "Time 3",
    title: "Central",
    leader: { id: "time3-carlos", name: "Carlos" },
    members: [
      { id: "time3-firmino", name: "Firmino" },
      { id: "time3-gustavo", name: "Gustavo" },
      { id: "time3-carine", name: "Carine" },
    ],
  },
  {
    id: "team-4",
    team: "Time 4",
    title: "Operacoes",
    leader: { id: "time4-guglielmo", name: "Guglielmo" },
    members: [
      { id: "time4-vandrin", name: "Vandrin" },
      { id: "time4-donadi", name: "Donadi" },
      { id: "time4-hernan", name: "Hernan" },
      { id: "time4-noel", name: "Noel" },
    ],
  },
  {
    id: "team-5",
    team: "Time 5",
    title: "NOC",
    leader: { id: "time5-johan", name: "Johan" },
    members: [
      { id: "time5-lucas", name: "Lucas" },
      { id: "time5-pericaro", name: "Peri\u00e7aro" },
      { id: "time5-elaine", name: "Elaine" },
    ],
  },
  {
    id: "team-6",
    team: "Time 6",
    title: "ERP",
    leader: null,
    members: [
      { id: "time6-marcus", name: "Marcus" },
      { id: "time6-vandao", name: "Vand\u00e3o" },
      { id: "time6-leo", name: "Leo" },
    ],
  },
  {
    id: "team-7",
    team: "Time 7",
    title: "Governanca",
    leader: null,
    members: [
      { id: "time7-igor", name: "Igor" },
      { id: "time7-joao", name: "Jo\u00e3o" },
      { id: "time7-elton", name: "Elton" },
    ],
  },
  {
    id: "team-8",
    team: "Time 8",
    title: "AI Lab",
    leader: null,
    members: [
      { id: "time8-juan", name: "Juan" },
      { id: "time8-leandro", name: "Leandro" },
      { id: "time8-rafael", name: "Rafael" },
      { id: "time8-miguel", name: "Miguel" },
    ],
  },
  {
    id: "team-9",
    team: "Time 9",
    title: "Staff",
    leader: null,
    members: [
      { id: "time9-robson", name: "Robson" },
      { id: "time9-pedro-thome", name: "Pedro Thome" },
      { id: "time9-wesley", name: "Wesley" },
      { id: "time9-jackson", name: "Jackson" },
      { id: "time9-burnes", name: "Burnes" },
      { id: "time9-cris", name: "Cris" },
    ],
  },
  {
    id: "team-10",
    team: "Time 10",
    title: "Super Pro",
    leader: { id: "time10-mari", name: "Mari" },
    members: [{ id: "time10-adrieli", name: "Adrieli" }],
  },
];

const stickerImages = {
  // Exemplo para figurinha animada:
  // "time1-bruno": { src: "./assets/stickers/time1-bruno.gif", alt: "Bruno", type: "gif" },
};

let albumPages = [];
let sheets = [];
let progressDots = [];
let totalSpreads = 0;
let currentSpread = 0;

function pad(value) {
  return String(value).padStart(2, "0");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function paginateTeams(teams, maxPeoplePerPage = 4) {
  const pages = [];

  teams.forEach((team) => {
    const totalPeople = team.members.length + (team.leader ? 1 : 0);
    const pageCount = Math.max(1, Math.ceil(totalPeople / maxPeoplePerPage));
    const remainingMembers = [...team.members];

    for (let partIndex = 1; partIndex <= pageCount; partIndex += 1) {
      const leader = partIndex === 1 ? team.leader : null;
      const remainingPages = pageCount - partIndex + 1;
      const memberSlots = leader ? maxPeoplePerPage - 1 : maxPeoplePerPage;
      const targetMembers = Math.ceil(remainingMembers.length / remainingPages);
      const takeCount = Math.min(memberSlots, targetMembers);
      const members = remainingMembers.splice(0, takeCount);

      pages.push({
        id: pageCount === 1 ? team.id : `${team.id}-part-${partIndex}`,
        baseTeamId: team.id,
        team: team.team,
        title: team.title,
        leader,
        members,
        partIndex,
        partCount: pageCount,
      });
    }
  });

  if (pages.length % 2 !== 0) {
    pages.push({
      id: "album-reserva",
      baseTeamId: "album-reserva",
      team: "Album da TI",
      title: "Espaco reservado",
      leader: null,
      members: [],
      partIndex: 1,
      partCount: 1,
      isReserved: true,
    });
  }

  return pages.map((page, index) => ({
    ...page,
    page: index + 1,
  }));
}

function buildBookStructure() {
  if (albumPages.length === 0) {
    book.innerHTML = "";
    progressDotsContainer.innerHTML = "";
    sheets = [];
    progressDots = [];
    totalSpreads = 0;
    return;
  }

  const firstPage = albumPages[0];
  const lastPage = albumPages[albumPages.length - 1];
  const middlePages = albumPages.slice(1, -1);

  let markup = `
    <div class="page-base page-base-left">
      <div class="page render-page" data-page-id="${escapeHtml(firstPage.id)}"></div>
    </div>
  `;

  for (let index = 0; index < middlePages.length; index += 2) {
    const frontPage = middlePages[index];
    const backPage = middlePages[index + 1];

    markup += `
      <div class="sheet" data-sheet="${index / 2}">
        <div class="page front render-page" data-page-id="${escapeHtml(frontPage.id)}"></div>
        <div class="page back render-page" data-page-id="${escapeHtml(backPage.id)}"></div>
      </div>
    `;
  }

  markup += `
    <div class="page-base page-base-right">
      <div class="page render-page" data-page-id="${escapeHtml(lastPage.id)}"></div>
    </div>
  `;

  book.innerHTML = markup;
  sheets = [...book.querySelectorAll(".sheet")];
  totalSpreads = Math.max(1, sheets.length + 1);
  currentSpread = Math.min(currentSpread, totalSpreads - 1);

  progressDotsContainer.innerHTML = Array.from({ length: totalSpreads }, (_, index) => {
    const activeClass = index === currentSpread ? " is-active" : "";
    return `<button class="dot${activeClass}" data-spread="${index}" aria-label="Abrir spread ${index + 1}"></button>`;
  }).join("");

  progressDots = [...progressDotsContainer.querySelectorAll(".dot")];
}

function renderMediaBadge(media) {
  if (!media || media.type !== "gif") {
    return "";
  }

  return '<span class="media-badge">GIF</span>';
}

function renderPhotoFrame(person, leader = false) {
  const image = stickerImages[person.id];
  const isAnimated = image?.type === "gif";
  const frameClass = leader
    ? `photo-frame leader-frame${isAnimated ? " is-animated" : ""}`
    : `photo-frame${isAnimated ? " is-animated" : ""}`;

  if (image) {
    const alt = escapeHtml(image.alt || person.name);
    const src = escapeHtml(image.src);
    return `
      <div class="${frameClass} has-photo">
        ${renderMediaBadge(image)}
        <img src="${src}" alt="${alt}" loading="lazy" />
      </div>
    `;
  }

  return `
    <div class="${frameClass}">
      <div class="photo-placeholder" aria-hidden="true"></div>
    </div>
  `;
}

function renderPersonCard(person, leader = false) {
  const cardClass = leader ? "person-card leader-card" : "person-card";
  const ribbon = leader ? '<span class="leader-ribbon" aria-label="Capitao">C</span>' : "";

  return `
    <article class="${cardClass}" data-sticker="${escapeHtml(person.id)}">
      ${ribbon}
      ${renderPhotoFrame(person, leader)}
      <strong class="person-name">${escapeHtml(person.name)}</strong>
    </article>
  `;
}

function renderReservedPage(pageData) {
  return `
    <div class="page-chip">Pagina ${pad(pageData.page)}</div>
    <div class="team-head">
      <p class="team-kicker">${escapeHtml(pageData.team)}</p>
      <h3>${escapeHtml(pageData.title)}</h3>
    </div>
    <p class="page-note">
      Esta pagina fica reservada para manter a montagem do album equilibrada
      quando a quantidade total de paginas for impar.
    </p>
  `;
}

function getRosterLayoutClass(count) {
  if (count <= 1) {
    return "is-single";
  }

  if (count === 2) {
    return "is-two";
  }

  if (count === 3) {
    return "is-three";
  }

  return "is-four";
}

function renderTeamPage(teamPage) {
  const roster = [];

  if (teamPage.leader) {
    roster.push(renderPersonCard(teamPage.leader, true));
  }

  roster.push(...teamPage.members.map((person) => renderPersonCard(person)));

  const partMarkup =
    teamPage.partCount > 1
      ? `<p class="team-part">Parte ${teamPage.partIndex} de ${teamPage.partCount}</p>`
      : "";
  const gridClass = getRosterLayoutClass(roster.length);

  return `
    <div class="page-chip">Pagina ${pad(teamPage.page)}</div>
    <div class="team-head">
      <p class="team-kicker">${escapeHtml(teamPage.team)}</p>
      <h3>${escapeHtml(teamPage.title)}</h3>
      ${partMarkup}
    </div>
    <section class="person-grid ${gridClass}">
      ${roster.join("")}
    </section>
  `;
}

function renderAlbumPages() {
  const pageMap = new Map(albumPages.map((page) => [page.id, page]));

  document.querySelectorAll("[data-page-id]").forEach((pageNode) => {
    const pageData = pageMap.get(pageNode.dataset.pageId);

    if (!pageData) {
      return;
    }

    pageNode.innerHTML = pageData.isReserved ? renderReservedPage(pageData) : renderTeamPage(pageData);
  });
}

function updateBook() {
  sheets.forEach((sheet, index) => {
    const isFlipped = index < currentSpread;
    const isCurrent = index === currentSpread;
    const depth = sheets.length - index;

    sheet.classList.toggle("flipped", isFlipped);
    sheet.classList.toggle("is-current", isCurrent);
    sheet.style.zIndex = isFlipped ? index + 1 : depth + 10;
  });

  if (spreadCounter) {
    spreadCounter.textContent = `${pad(currentSpread + 1)} / ${pad(totalSpreads)}`;
  }
  prevBtn.disabled = currentSpread === 0;
  nextBtn.disabled = currentSpread === totalSpreads - 1;

  progressDots.forEach((dot, index) => {
    dot.classList.toggle("is-active", index === currentSpread);
  });
}

function goToSpread(targetSpread) {
  currentSpread = Math.max(0, Math.min(targetSpread, totalSpreads - 1));
  updateBook();
}

function openAlbum() {
  coverStage.classList.add("is-hidden");
  albumStage.classList.remove("is-hidden");
  requestAnimationFrame(() => {
    albumStage.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

coverCard.addEventListener("click", openAlbum);
coverCard.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openAlbum();
  }
});

openAlbumButton.addEventListener("click", (event) => {
  event.stopPropagation();
  openAlbum();
});

prevBtn.addEventListener("click", () => goToSpread(currentSpread - 1));
nextBtn.addEventListener("click", () => goToSpread(currentSpread + 1));

progressDotsContainer.addEventListener("click", (event) => {
  const dot = event.target.closest(".dot");

  if (!dot) {
    return;
  }

  goToSpread(Number(dot.dataset.spread));
});

book.addEventListener("click", (event) => {
  if (event.target.closest("input, label, button, .person-card")) {
    return;
  }

  const bounds = book.getBoundingClientRect();
  const clickedOnRightSide = event.clientX > bounds.left + bounds.width / 2;
  goToSpread(currentSpread + (clickedOnRightSide ? 1 : -1));
});

window.addEventListener("keydown", (event) => {
  if (albumStage.classList.contains("is-hidden")) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openAlbum();
    }
    return;
  }

  if (event.key === "ArrowRight") {
    goToSpread(currentSpread + 1);
  }

  if (event.key === "ArrowLeft") {
    goToSpread(currentSpread - 1);
  }
});

let touchStartX = 0;
let touchEndX = 0;

albumStage.addEventListener(
  "touchstart",
  (event) => {
    touchStartX = event.changedTouches[0].screenX;
  },
  { passive: true },
);

albumStage.addEventListener(
  "touchend",
  (event) => {
    touchEndX = event.changedTouches[0].screenX;
    const swipeDistance = touchEndX - touchStartX;

    if (Math.abs(swipeDistance) < 60) {
      return;
    }

    if (swipeDistance < 0) {
      goToSpread(currentSpread + 1);
      return;
    }

    goToSpread(currentSpread - 1);
  },
  { passive: true },
);

albumPages = paginateTeams(teamDefinitions);
buildBookStructure();
renderAlbumPages();
updateBook();
