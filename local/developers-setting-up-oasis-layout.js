const oasisSetupSceneCounter = document.getElementById('scene-counter');
const oasisSetupNormalPreview = document.getElementById('normal-preview');
const oasisSetupSinglePreview = document.getElementById('victoria-preview');
const oasisSetupSplitPreview = document.getElementById('triangle-preview');
const oasisSetupShotList = document.getElementById('scene1-shot-list');
const oasisSetupStandardFootage = document.getElementById('standard-footage');

function oasisSetupDetails(shots) {
  return shots.map((shot) => `<article class="shot-detail"><div class="shot-detail-number">${shot.id}</div><div><strong>${shot.title}</strong><p>${shot.description}</p><dl><div><dt>LOCATION</dt><dd>${shot.location}</dd></div><div><dt>ACTORS</dt><dd>${shot.actors.join(', ')}</dd></div></dl></div></article>`).join('');
}

function syncOasisSetupLayout() {
  const sceneId = scenes[active]?.id;
  const shots = oasisSetupShots[sceneId];
  if (!shots) return;

  oasisSetupNormalPreview.hidden = true;
  oasisSetupShotList.hidden = false;
  oasisSetupShotList.innerHTML = oasisSetupDetails(shots);
  oasisSetupStandardFootage.hidden = true;

  if (sceneId === 1) {
    oasisSetupSinglePreview.src = shots[0].image;
    oasisSetupSinglePreview.alt = shots[0].title;
    oasisSetupSinglePreview.style.objectFit = 'contain';
    oasisSetupSinglePreview.style.objectPosition = 'center';
    oasisSetupSinglePreview.hidden = false;
    oasisSetupSplitPreview.hidden = true;
    return;
  }

  oasisSetupSinglePreview.hidden = true;
  oasisSetupSplitPreview.className = 'triangle-preview two-shot-array';
  oasisSetupSplitPreview.hidden = false;
  oasisSetupSplitPreview.innerHTML = shots.map((shot) => `<figure class="triangle-shot"><img src="${shot.image}" alt="${shot.title}"><figcaption><b>FOOTAGE ${shot.id}</b><span>${shot.title}</span></figcaption></figure>`).join('');
}

new MutationObserver(syncOasisSetupLayout).observe(oasisSetupSceneCounter, { childList: true, subtree: true });
syncOasisSetupLayout();
