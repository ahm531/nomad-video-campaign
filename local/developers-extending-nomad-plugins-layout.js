const pluginsSceneCounter = document.getElementById('scene-counter');
const pluginsShotList = document.getElementById('scene1-shot-list');
const pluginsSplitPreview = document.getElementById('triangle-preview');
const pluginsSpeakerPreview = document.getElementById('victoria-preview');
const pluginsStandardFootage = document.getElementById('standard-footage');

function pluginsShotDetails(shots) {
  return shots.map((shot) => `<article class="shot-detail"><div class="shot-detail-number">${shot.id}</div><div><strong>${shot.title}</strong><p>${shot.description}</p><dl><div><dt>LOCATION</dt><dd>${shot.location}</dd></div><div><dt>ACTORS</dt><dd>${shot.actors.join(', ')}</dd></div></dl></div></article>`).join('');
}

function syncPluginsSceneLayout() {
  const sceneId = scenes[active]?.id;
  if (sceneId === 2) {
    pluginsShotList.hidden = false;
    pluginsShotList.innerHTML = pluginsShotDetails(scene2Shots);
    pluginsStandardFootage.hidden = true;
  }
  if (sceneId === 3) {
    pluginsSpeakerPreview.hidden = true;
    pluginsSplitPreview.className = 'triangle-preview two-shot-array';
    pluginsSplitPreview.hidden = false;
    pluginsSplitPreview.innerHTML = scene3Shots.map((shot) => `<figure class="triangle-shot"><img src="${shot.image}" alt="${shot.title}"><figcaption><b>FOOTAGE ${shot.id}</b><span>${shot.title}</span></figcaption></figure>`).join('');
    pluginsShotList.hidden = false;
    pluginsShotList.innerHTML = pluginsShotDetails(scene3Shots);
    pluginsStandardFootage.hidden = true;
  }
}

new MutationObserver(syncPluginsSceneLayout).observe(pluginsSceneCounter, { childList: true, subtree: true });
syncPluginsSceneLayout();
