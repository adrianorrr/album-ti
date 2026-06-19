(function () {
  const teamDefinitions = [
    {
      id: "team-1",
      team: "Time 1",
      title: "L\u00edderes",
      leader: { id: "time1-bruno", name: "Bruno", role: "Diretor de DI" },
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
      title: "Opera\u00e7\u00f5es",
      leader: { id: "time4-guglielmo", name: "Guglielmo" },
      members: [
        { id: "time4-vandrin", name: "Vandrin" },
        { id: "time4-donadi", name: "Donadi" },
        { id: "time4-hernan", name: "Hernan" },
        { id: "time4-noel", name: "Noel" },
        { id: "time4-murilo", name: "Murilo" },
      ],
    },
    {
      id: "team-5",
      team: "Time 5",
      title: "NOC",
      leader: { id: "time5-johan", name: "Johan" },
      members: [
        { id: "time5-lucas", name: "Lucas" },
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
      title: "Governan\u00e7a",
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
    // Para colar uma foto no album, adicione a imagem em assets/stickers
    // e cadastre pelo id da pessoa:
    // "time1-bruno": { src: "./assets/stickers/time1-bruno.jpg", alt: "Bruno" },
    // "time1-wagner": { src: "./assets/stickers/time1-wagner.gif", alt: "Wagner", type: "gif" },
    "time1-bruno": {
      src: "./assets/22684a6b-fd58-4520-ad41-1d55cf9ffd68.jpg",
      alt: "Bruno",
    },
    "time2-gustavo": {
      src: "./assets/pack-001-gustavo.jpg",
      alt: "Gustavo",
    },
    "time3-carlos": {
      src: "./assets/pack-001-carlos.jpg",
      alt: "Carlos",
    },
    "time6-vandao": {
      src: "./assets/pack-001-vandao.jpg",
      alt: "Vand\u00e3o",
    },
    "time8-miguel": {
      src: "./assets/pack-001-miguel.jpg",
      alt: "Miguel",
    },
    "time2-adriano": {
      src: "./assets/pack002-adriano.jpg",
      alt: "Adriano",
    },
    "time4-guglielmo": {
      src: "./assets/pack002-guglielmo.jpg",
      alt: "Guglielmo",
    },
    "time6-marcus": {
      src: "./assets/pack002-marcus.mp4",
      alt: "Marcus",
      type: "video",
    },
    "time4-noel": {
      src: "./assets/pack002-noel.jpg?v=20260619-1552",
      alt: "Noel",
    },
  };

  function getPeople() {
    return teamDefinitions.flatMap((team) => {
      const leader = team.leader
        ? [
            {
              ...team.leader,
              teamId: team.id,
              team: team.team,
              teamTitle: team.title,
              role: team.leader.role || "Capit\u00e3o",
            },
          ]
        : [];

      const members = team.members.map((person) => ({
        ...person,
        teamId: team.id,
        team: team.team,
        teamTitle: team.title,
        role: "Integrante",
      }));

      return [...leader, ...members];
    });
  }

  window.albumTiData = {
    teamDefinitions,
    stickerImages,
    getPeople,
  };
})();
