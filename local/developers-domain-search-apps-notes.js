const domainSearchShotList = document.getElementById('scene1-shot-list');
const domainSearchSceneCounter = document.getElementById('scene-counter');

function renderDomainSearchShotDetails(shots) {
  domainSearchShotList.innerHTML = shots.map((shot) => `
    <article class="shot-detail">
      <div class="shot-detail-number">${shot.id}</div>
      <div>
        <strong>${shot.title}</strong>
        <p>${shot.description}</p>
        <dl>
          <div><dt>LOCATION</dt><dd>${shot.location}</dd></div>
          <div><dt>ACTORS</dt><dd>${shot.actors.join(', ')}</dd></div>
        </dl>
      </div>
    </article>
  `).join('');
}

function syncDomainSearchShotDetails() {
  if (scenes[active]?.id === 2) {
    renderDomainSearchShotDetails(scene2Shots);
    domainSearchShotList.hidden = false;
  }
}

new MutationObserver(syncDomainSearchShotDetails).observe(domainSearchSceneCounter, { childList: true, subtree: true });
syncDomainSearchShotDetails();
