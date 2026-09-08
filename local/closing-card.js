const closingCards = {
  'central.html': { product: 'central', speaker: 'Victoria Coors', image: 'speaker-victoria-coors-lab.png' },
  'oasis.html': { product: 'oasis', speaker: 'Christoph Koch', image: 'speaker-christoph-koch-lab.png' },
  'developers-nomad.html': { product: 'central', speaker: 'Lauri Himanen', image: 'speaker-lauri-himanen-camera.png' },
  'developers-designing-experience.html': { product: 'central', speaker: 'Berfin Güner', image: 'speaker-berfin-guener-camera.png' },
  'developers-data-modeling-computations.html': { product: 'central', speaker: 'Esma Boydas', image: 'speaker-esma-boydas-camera.png' },
  'developers-data-modeling-experiments.html': { product: 'central', speaker: 'Lukas Pielsticker', image: 'speaker-lukas-pielsticker-camera.png' },
  'developers-domain-search-apps.html': { product: 'central', speaker: 'Julia Schumann', image: 'speaker-julia-schumann-camera.png' },
  'developers-trusted-platform.html': { product: 'central', speaker: 'Raphael Ritz' },
  'developers-automating-research-workflows.html': { product: 'oasis', speaker: 'Ilyas', image: 'speaker-ilyas-camera.png' },
  'developers-extending-nomad-plugins.html': { product: 'oasis', speaker: 'Hampus Näsström', image: 'speaker-hampus-naesstroem-camera.png' },
  'developers-synthesis-eln-data-modeling.html': { product: 'oasis', speaker: 'Sarthak Kapoor', image: 'speaker-sarthak-kapoor-camera.png' },
  'developers-setting-up-oasis.html': { product: 'oasis', speaker: 'Martin Kuban' },
  'developers-production-ready-oasis.html': { product: 'oasis', speaker: 'Joseph Rudzinski' }
};

const pageName = location.pathname.split('/').pop() || 'index.html';
const closingCard = closingCards[pageName];

if (closingCard) {
  const endCard = document.getElementById('end-card');
  const preview = document.getElementById('preview');
  const counter = document.getElementById('scene-counter');
  const next = document.getElementById('next');
  const logo = closingCard.product === 'central' ? 'brand-nomad-horizontal.png' : 'brand-oasis-horizontal.png';
  const logoAlt = closingCard.product === 'central' ? 'NOMAD' : 'NOMAD Oasis';
  const statement = closingCard.product === 'central'
    ? 'From research data to shared knowledge.'
    : 'One platform, built around your laboratory.';

  const speakerMarkup = closingCard.image
    ? `<img src="../public/${closingCard.image}" alt="${closingCard.speaker} speaking to camera">`
    : `<div class="end-card-speaker-placeholder"><strong>${closingCard.speaker}</strong><span>Speaker image pending</span></div>`;

  endCard.querySelector('.end-card-speaker').innerHTML = speakerMarkup;
  endCard.querySelector('.end-card-message').innerHTML = `
    <img class="closing-logo ${closingCard.product === 'oasis' ? 'oasis-closing-logo' : ''}" src="../public/${logo}" alt="${logoAlt}">
    <h3>${statement}</h3>
    <div class="developed-by"><span>Developed by</span><img src="../public/brand-fairmat-with-text.png" alt="FAIRmat"></div>`;

  const syncClosingCard = () => {
    const match = counter.textContent.match(/SCENE\s+(\d+)\s+OF\s+(\d+)/i);
    const isProductClosing = match && Number(match[1]) === Number(match[2]) - 1;
    endCard.hidden = !isProductClosing;
    preview.classList.toggle('final-scene-preview', Boolean(isProductClosing));
    if (isProductClosing) {
      ['normal-preview', 'victoria-preview', 'triangle-preview'].forEach((id) => {
        const element = document.getElementById(id);
        if (element) element.hidden = true;
      });
    }
  };

  new MutationObserver(syncClosingCard).observe(counter, { childList: true, subtree: true });
  new MutationObserver(syncClosingCard).observe(next, { attributes: true, attributeFilter: ['disabled'] });
  syncClosingCard();
}
