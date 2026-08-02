const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const head = (title, desc) => `<!doctype html>
<html lang="pl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} — Rustam Barbershop Warszawa</title>
<meta name="description" content="${desc}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400;1,6..72,500&family=Archivo:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../assets/css/style.css">
</head>
<body>

<header class="site-header">
  <a href="../index.html" class="brand">RUSTAM <strong>barbershop</strong><span>Warszawa</span></a>
  <nav class="main-nav">
    <a href="../index.html#o-nas">O nas</a>
    <a href="../index.html#cennik">Cennik</a>
    <a href="../index.html#portfolio">Portfolio</a>
    <a href="../index.html#zespol">Zespół</a>
    <a href="../index.html#opinie">Opinie</a>
    <a href="../school.html">Szkoła barberska</a>
    <a href="https://barberschoolrustam.booksy.com" target="_blank" rel="noopener" class="btn btn-primary">Umów wizytę</a>
  </nav>
  <button class="nav-toggle" aria-label="Menu"><span></span><span></span><span></span></button>
</header>
`;

const foot = `
<footer class="site-footer">
  <div class="wrap footer-top">
    <div class="footer-brand">
      <a href="../index.html" class="brand">RUSTAM <strong>barbershop</strong></a>
      <p>Barbershop i szkoła barberska w Warszawie. Jakość gwarantowana, 7 dni w tygodniu.</p>
      <div class="social-row">
        <a href="https://www.instagram.com/barbershop.rustam/" target="_blank" rel="noopener" aria-label="Instagram">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.4" cy="6.6" r="1"/></svg>
        </a>
      </div>
    </div>
    <div>
      <h4>Chmielna 106</h4>
      <ul><li>00-801 Warszawa</li><li><a href="tel:+48780040752">+48 780 040 752</a></li></ul>
    </div>
    <div>
      <h4>Al. Jerozolimskie 49</h4>
      <ul><li>00-696 Warszawa · Szkoła</li><li><a href="tel:+48571999669">+48 571 999 669</a></li></ul>
    </div>
    <div>
      <h4>Nawigacja</h4>
      <ul>
        <li><a href="../index.html#zespol">Cały zespół</a></li>
        <li><a href="../school.html">Szkoła barberska</a></li>
        <li><a href="../privacy.html">Polityka prywatności</a></li>
      </ul>
    </div>
  </div>
  <div class="wrap footer-bottom">
    <span>© 2026 Rustam Barbershop</span>
    <a href="../privacy.html">Polityka prywatności i cookies</a>
  </div>
</footer>

<script src="../assets/js/main.js"></script>
</body>
</html>
`;

function galleryBlock(indices, note) {
  const imgs = indices.map(i => `        <img src="../img/portfolio/work-${i}.webp" loading="lazy" alt="Realizacja Rustam Barbershop">`).join('\n');
  return `
  <section class="person-gallery section section-dark">
    <div class="wrap">
      <span class="eyebrow">Realizacje</span>
      <div class="grid" data-reveal-stagger style="margin-top:24px">
${imgs}
      </div>
      <p class="note">${note}</p>
    </div>
  </section>`;
}

function personPage(p) {
  const figure = p.img
    ? `<img src="../img/team/${p.img}" alt="${p.name} — ${p.role}">`
    : `<div class="figure is-empty"><span>Zdjęcie ${p.name} — wkrótce</span></div>`;
  const figureWrap = p.img ? `<div class="figure">${figure}</div>` : figure;

  return head(`${p.name} — ${p.role}`, p.lead) + `
<main>
  <section class="person-hero wrap">
    ${figureWrap}
    <div class="person-copy" data-reveal>
      <span class="eyebrow role">${p.role}</span>
      <h1>${p.name}</h1>
      <p class="lead">${p.lead}</p>
      <div class="person-specialties">
        ${p.specialties.map(s => `<span>${s}</span>`).join('\n        ')}
      </div>
      <div class="person-cta">
        <a href="https://barberschoolrustam.booksy.com" target="_blank" rel="noopener" class="btn btn-primary">Umów się do ${p.name}</a>
        <a href="../index.html#zespol" class="btn btn-ghost">Cały zespół</a>
      </div>
    </div>
  </section>
${galleryBlock(p.gallery, p.galleryNote)}
</main>
` + foot;
}

const people = [
  {
    slug: 'rustam',
    name: 'Rustam',
    role: 'Chief Barber · właściciel',
    img: 'rustam-portrait.webp',
    lead: 'Chief barber i założyciel. Zna się na tym, co robi — prowadzi dwa barbershopy w Warszawie i szkoli kolejnych barberów. Nie ma rzeczy, z którymi sobie nie poradzi.',
    specialties: ['Wieloletnie doświadczenie', '2 barbershopy w Warszawie', 'Prowadzi szkolenia', 'Strzyżenie · Combo'],
    gallery: [1, 2, 3, 4],
    galleryNote: 'Zdjęcia z realizacji zespołu Rustam Barbershop.'
  },
  {
    slug: 'ilja',
    name: 'Ilja',
    role: 'Top Barber · nauczyciel szkoły',
    img: 'portrait-ilja.webp',
    lead: 'Doświadczony barber, który i Ciebie może nauczyć. Prowadzi szkolenia w Barber School Rustam — jego uczniowie kończą kurs z realnym certyfikatem, nie tylko papierem.',
    specialties: ['Top Barber', 'Wieloletnie doświadczenie', 'Prowadzi szkolenia', 'Nauczyciel Barber School Rustam'],
    gallery: [5, 6, 7, 8],
    galleryNote: 'Zdjęcia z realizacji zespołu Rustam Barbershop.'
  },
  {
    slug: 'maria',
    name: 'Maria',
    role: 'Top Barber · Team Leader',
    img: 'portrait-maria.webp',
    lead: 'Doświadczona barberka, u której wszystko zawsze pod kontrolą. Team leader zespołu — czuwa nad jakością każdej wizyty.',
    specialties: ['Top Barber', 'Wieloletnie doświadczenie', 'Team leader'],
    gallery: [9, 10, 11, 12],
    galleryNote: 'Zdjęcia z realizacji zespołu Rustam Barbershop.'
  },
  {
    slug: 'daria',
    name: 'Daria',
    role: 'Barber',
    img: 'portrait-daria.webp',
    lead: 'Doświadczona barberka, która zna się nie tylko na męskich, ale i na damskich strzyżeniach. Nie ma rzeczy, z którymi sobie nie poradzi.',
    specialties: ['Wieloletnie doświadczenie', 'Strzyżenia męskie i damskie'],
    gallery: [13, 14, 1, 2],
    galleryNote: 'Zdjęcia z realizacji zespołu Rustam Barbershop.'
  },
  {
    slug: 'varvara',
    name: 'Varvara',
    role: 'Barber',
    img: 'portrait-varvara.webp',
    lead: 'Dobry vibe, precyzyjne cięcie i fryzura, która naprawdę do Ciebie pasuje — tak właśnie wyglądają wizyty u Varvary.',
    specialties: ['Dokładność i wyczucie stylu', 'Indywidualne podejście do każdego klienta'],
    gallery: [3, 4, 5, 6],
    galleryNote: 'Zdjęcia z realizacji zespołu Rustam Barbershop.'
  },
  {
    slug: 'sandra',
    name: 'Sandra',
    role: 'Barber',
    img: 'portrait-sandra.webp',
    lead: 'Połączenie wyczucia stylu, dokładności i luźnego vibe’u, dzięki któremu wizyta mija w świetnej atmosferze.',
    specialties: ['Precyzja i doświadczenie', 'Look dopasowany właśnie do Ciebie'],
    gallery: [7, 8, 9, 10],
    galleryNote: 'Zdjęcia z realizacji zespołu Rustam Barbershop.'
  },
  {
    slug: 'nikita',
    name: 'Nikita',
    role: 'Barber',
    img: 'portrait-nikita.webp',
    lead: 'Barber od urodzenia — profesjonalizm połączony z dobrym poczuciem humoru. Strzyżenia jakiegokolwiek rodzaju, precyzja i dokładność.',
    specialties: ['Strzyżenia jakiegokolwiek rodzaju', 'Precyzja i dokładność', 'Ciągle się rozwija'],
    gallery: [11, 12, 13, 14],
    galleryNote: 'Zdjęcia z realizacji zespołu Rustam Barbershop.'
  }
];

const dir = path.join(ROOT, 'team');
fs.mkdirSync(dir, { recursive: true });
for (const p of people) {
  fs.writeFileSync(path.join(dir, `${p.slug}.html`), personPage(p));
  console.log('wrote', p.slug);
}
