const productionReadySceneCounter = document.getElementById('scene-counter');
const productionReadyNormalPreview = document.getElementById('normal-preview');
const productionReadySinglePreview = document.getElementById('victoria-preview');
const productionReadySplitPreview = document.getElementById('triangle-preview');
const productionReadyShotList = document.getElementById('scene1-shot-list');
const productionReadyStandardFootage = document.getElementById('standard-footage');

function productionReadyDetails(shots) {
  return shots.map((shot) => `<article class="shot-detail"><div class="shot-detail-number">${shot.id}</div><div><strong>${shot.title}</strong><p>${shot.description}</p><dl><div><dt>LOCATION</dt><dd>${shot.location}</dd></div><div><dt>ACTORS</dt><dd>${shot.actors.join(', ')}</dd></div></dl></div></article>`).join('');
}

function syncProductionReadyLayout() {
  const sceneId = scenes[active]?.id;
  const shots = productionReadyShots[sceneId];
  if (!shots) return;

  productionReadyNormalPreview.hidden = true;
  productionReadyShotList.hidden = false;
  productionReadyShotList.innerHTML = productionReadyDetails(shots);
  productionReadyStandardFootage.hidden = true;

  if (shots.length === 1) {
    productionReadySinglePreview.src = shots[0].image;
    productionReadySinglePreview.alt = shots[0].title;
    productionReadySinglePreview.style.objectFit = 'contain';
    productionReadySinglePreview.style.objectPosition = 'center';
    productionReadySinglePreview.hidden = false;
    productionReadySplitPreview.hidden = true;
    return;
  }

  productionReadySinglePreview.hidden = true;
  productionReadySplitPreview.className = 'triangle-preview two-shot-array';
  productionReadySplitPreview.hidden = false;
  productionReadySplitPreview.innerHTML = shots.map((shot) => `<figure class="triangle-shot"><img src="${shot.image}" alt="${shot.title}"><figcaption><b>FOOTAGE ${shot.id}</b><span>${shot.title}</span></figcaption></figure>`).join('');
}

new MutationObserver(syncProductionReadyLayout).observe(productionReadySceneCounter, { childList: true, subtree: true });
syncProductionReadyLayout();
