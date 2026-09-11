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

const footageVideoNumbers = {
  'central.html':'01','oasis.html':'02','developers-nomad.html':'03','developers-designing-experience.html':'04',
  'developers-data-modeling-computations.html':'05','developers-data-modeling-experiments.html':'06',
  'developers-domain-search-apps.html':'07','developers-trusted-platform.html':'08',
  'developers-automating-research-workflows.html':'09','developers-extending-nomad-plugins.html':'10',
  'developers-synthesis-eln-data-modeling.html':'11','developers-setting-up-oasis.html':'12',
  'developers-production-ready-oasis.html':'13','users-from-calculations-to-published-datasets.html':'14',
  'users-nomad-data-for-ai-driven-materials-discovery.html':'15','users-connecting-samples-experiments-data.html':'16',
  'users-bringing-photovoltaics-data-together.html':'17','users-incorporating-data-literacy-in-lab-courses.html':'18'
};

const footagePageName = location.pathname.split('/').pop() || 'central.html';
const footageVideoNumber = footageVideoNumbers[footagePageName];
const footageTypeName = type => ({camera:'CAMERA FOOTAGE',screen:'SCREEN RECORDING',mixed:'MIXED MEDIA'}[type]||String(type).toUpperCase());
const footageIdentifier = (sceneId,footageNumber=1) => `V${footageVideoNumber}-S${String(sceneId).padStart(2,'0')}-F${String(footageNumber).padStart(2,'0')}`;
const sceneIdentifier = sceneId => `V${footageVideoNumber}-S${String(sceneId).padStart(2,'0')}`;

const sceneDetailsId=document.createElement('div');
sceneDetailsId.className='scene-details-id';
const detailsContent=document.getElementById('details');
if(detailsContent)detailsContent.insertBefore(sceneDetailsId,detailsContent.firstChild);

const syncFootageIdentifiers = () => {
  if(!footageVideoNumber||!scenes[active])return;
  const scene=scenes[active];
  const visibleShotList=document.getElementById('scene1-shot-list');
  const shotCount=visibleShotList&&!visibleShotList.hidden?visibleShotList.querySelectorAll('.shot-detail').length:0;
  const hasMultipleFootages=shotCount>1;
  const mainLabel=document.getElementById('shot-label');
  if(mainLabel)mainLabel.textContent=`${hasMultipleFootages?sceneIdentifier(scene.id):footageIdentifier(scene.id)} · ${footageTypeName(scene.type)}`;
  sceneDetailsId.textContent=sceneIdentifier(scene.id);

  const standardFootageLabel=document.querySelector('#standard-footage .detail-block:first-child span');
  if(standardFootageLabel)standardFootageLabel.textContent='PRODUCTION DETAILS';

  document.querySelectorAll('.triangle-shot figcaption b').forEach((label,index)=>{
    const original=label.textContent;
    const match=original.match(/(?:FOOTAGE\s+)?\d+(?:\.(\d+))?/i);
    const footageNumber=Number(match?.[1])||index+1;
    const suffix=original.includes(':')?`:${original.split(':').slice(1).join(':')}`:'';
    label.textContent=`${footageIdentifier(scene.id,footageNumber)}${suffix}`;
  });

  document.querySelectorAll('.shot-detail-number').forEach((label,index)=>{
    const match=label.textContent.match(/\d+(?:\.(\d+))?/);
    const footageNumber=Number(match?.[1])||index+1;
    label.textContent=`F${String(footageNumber).padStart(2,'0')}`;
  });

  document.querySelectorAll('.shot-detail').forEach(detail=>{
    const description=detail.querySelector('div > p');
    if(description&&!description.previousElementSibling?.classList.contains('shot-production-label')){
      const label=document.createElement('span');
      label.className='shot-production-label';
      label.textContent='PRODUCTION DETAILS';
      description.before(label);
    }
  });
};

new MutationObserver(syncFairmatEndCard).observe(document.getElementById('scene-counter'), { childList: true, subtree: true });
new MutationObserver(syncFootageIdentifiers).observe(document.getElementById('scene-counter'), { childList: true, subtree: true });
render();
syncFairmatEndCard();
syncFootageIdentifiers();
