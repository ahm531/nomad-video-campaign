const fairmatScene = {
  id: scenes.length + 1,
  title: 'FAIRmat closing card',
  start: totalRuntime - 4,
  duration: 4,
  sentence: '',
  footage: 'Full-screen FAIRmat logo on a white background.',
  location: 'Graphic',
  actors: ['No speaker'],
  type: 'screen'
};

scenes.push(fairmatScene);

const fairmatEndCard = document.createElement('div');
fairmatEndCard.id = 'fairmat-end-card';
fairmatEndCard.className = 'fairmat-end-card';
fairmatEndCard.hidden = true;
fairmatEndCard.innerHTML = '<img src="../public/brand-fairmat-end-card.png" alt="FAIRmat">';
document.getElementById('preview').appendChild(fairmatEndCard);

const syncFairmatEndCard = () => {
  const isFinal = active === scenes.length - 1;
  fairmatEndCard.hidden = !isFinal;
  if (isFinal) {
    const productEndCard = document.getElementById('end-card');
    if (productEndCard) productEndCard.hidden = true;
    ['normal-preview', 'victoria-preview', 'triangle-preview'].forEach((id) => {
      const element = document.getElementById(id);
      if (element) element.hidden = true;
    });
    document.getElementById('preview').classList.add('final-scene-preview');
  }
};

new MutationObserver(syncFairmatEndCard).observe(document.getElementById('scene-counter'), { childList: true, subtree: true });
render();
syncFairmatEndCard();
