const totalRuntime = 29;

const scene1Shots = [
  { id: '1.1', image: '../public/developers-nomad-scene-01-team-meeting.png', title: 'Developers in a meeting', description: 'Lauri Himanen discusses with developers in a meeting, with code visible on the screen.', location: 'Room 1.108', actors: ['Lauri Himanen', 'Sascha', 'Amir', 'Thea'],}
];

const scene2Shots = [
  { id: '2.1', image: '../public/speaker-lauri-himanen-camera.png', title: 'Lauri speaks to camera', description: 'Lauri speaks to camera with NOMAD performance and metrics shown on the screen.', location: 'Office 1.108', actors: ['Lauri Himanen'] },
  { id: '2.2', image: '../public/developers-nomad-scene-02-coding-workspace.png', title: 'Developer coding', description: 'Developer at a desk working on a coding activity.', location: 'Office 1.106', actors: ['Sascha'] }
];

const raw = [
  [1,'Building the NOMAD ecosystem',0,6,'NOMAD brings together diverse research data, workflows, and scientific communities.','Lauri Himanen discusses with developers in a meeting, with code visible on the screen.','Room 1.108',['Lauri Himanen', 'Sascha', 'Amir', 'Thea'],'camera'],
  [2,'Managing complexity behind NOMAD',6,15,'Our job as the development team is to manage the complexity behind the platform, making sure it remains stable, secure, and reliable so researchers can focus on the science.','Lauri speaks to camera with NOMAD performance and metrics shown on the screen, while Ahmed I works on code in parallel.','Office 1.108; Office 1.106',['Lauri Himanen','Ahmed I'],'camera'],
  [3,'Join the community',21,4,'For more information visit our website and join us on Discord.','Lauri Himanen speaks to camera as the final framing settles into the screen.','Room 1.108',['Lauri Himanen'],'camera']
];

const scenes = raw.map(([id,title,start,duration,sentence,footage,location,actors,type]) => ({id,title,start,duration,sentence,footage,location,actors,type}));

let active = 0, time = 0, playing = false, timer = null;
const $ = (id) => document.getElementById(id);
const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2,'0')}`;

function renderList() {
  const q = $('search').value.toLowerCase();
  const visible = scenes.filter((s) => `${s.title} ${s.sentence} ${s.location}`.toLowerCase().includes(q));
  $('count').textContent = visible.length;
  $('sentence-list').innerHTML = visible.map((s) => `
    <button data-id="${s.id}" class="sentence-item ${s.id === scenes[active].id ? 'is-active' : ''}">
      <span class="scene-number">${String(s.id).padStart(2,'0')}</span>
      <span class="sentence-copy">
        <strong>${s.title}</strong>
        <span>${s.sentence}</span>
        <small>${fmt(s.start)} – ${fmt(s.start + s.duration)}</small>
      </span>
    </button>
  `).join('') || '<div class="empty">No matching sentences</div>';

  document.querySelectorAll('.sentence-item').forEach((b) => {
    b.onclick = () => select(Number(b.dataset.id) - 1);
  });
}

function renderTrack() {
  $('track').innerHTML = scenes.map((s, i) => `
    <button data-index="${i}" aria-label="Scene ${s.id}: ${s.title}" class="clip clip-${s.type} ${i === active ? 'is-active' : ''}" style="width:${(s.duration / totalRuntime) * 100}%">
      <span>${s.id}</span>
    </button>
  `).join('');

  $('scene-dots').innerHTML = scenes.map((s, i) => `
    <button data-index="${i}" aria-label="Go to scene ${s.id}" class="${i === active ? 'active' : ''}"></button>
  `).join('');

  document.querySelectorAll('[data-index]').forEach((b) => {
    b.onclick = () => select(Number(b.dataset.index));
  });
}

function render() {
  const s = scenes[active];
  const percent = (time / totalRuntime) * 100;
  const isSceneOne = active === 0;
  const isSceneTwo = active === 1;
  const isSceneThree = active === 2;
  const isClosing = active === scenes.length - 1;

  $('timecode').textContent = fmt(time);
  $('playhead').style.left = `${percent}%`;
  $('scrubber').value = time;
  $('scene-counter').textContent = `SCENE ${String(s.id).padStart(2,'0')} OF ${scenes.length}`;
  $('duration').textContent = `${s.duration} SEC`;
  $('preview').className = `preview preview-${s.type}`;
  $('shot-label').textContent=`FOOTAGE ${String(s.id).padStart(2,'0')} · ${s.type==='screen'?'SCREEN RECORDING':s.type==='mixed'?'MIXED MEDIA':'CAMERA FOOTAGE'}`;
  $('normal-preview').hidden = true;
  $('preview-location').textContent = s.location;
  $('victoria-preview').hidden = true;
  $('triangle-preview').hidden = true;
  $('end-card').hidden = true;
  $('scene1-shot-list').hidden = true;
  $('standard-footage').hidden = false;
  $('footage').textContent = s.footage;
  $('location').textContent = s.location;
  $('actors').innerHTML = s.actors.map((a) => `<em>${a}</em>`).join('');
  $('preview-time').textContent = `${fmt(s.start)} – ${fmt(s.start + s.duration)}`;
  $('quote').textContent = `“${s.sentence}”`;
  $('detail-duration').textContent = `${s.duration} seconds`;
  $('previous').disabled = active === 0;
  $('next').disabled = active === scenes.length - 1;

  if (isSceneOne) {
    $('victoria-preview').src = '../public/developers-nomad-scene-01-team-meeting.png';
    $('victoria-preview').alt = 'Lauri Himanen discussing with developers in a meeting with code on the screen';
    $('victoria-preview').hidden = false;
    $('scene1-shot-list').hidden = false;
    $('scene1-shot-list').innerHTML = scene1Shots.map((shot) => `
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

  if (isSceneTwo) {
    $('triangle-preview').className = 'triangle-preview two-shot-array';
    $('triangle-preview').hidden = false;
    $('triangle-preview').innerHTML = scene2Shots.map((shot) => `
      <figure class="triangle-shot">
        <img src="${shot.image}" alt="${shot.title}">
        <figcaption><b>FOOTAGE ${shot.id}</b><span>${shot.title}</span></figcaption>
      </figure>
    `).join('');
    $('standard-footage').hidden = true;
    $('scene1-shot-list').hidden = false;
    $('scene1-shot-list').innerHTML = scene2Shots.map((shot) => `
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

  if (isSceneThree) {
    $('victoria-preview').src = '../public/speaker-lauri-himanen-camera.png';
    $('victoria-preview').alt = 'Lauri Himanen speaking to camera';
    $('victoria-preview').style.objectFit = 'cover';
    $('victoria-preview').style.objectPosition = 'center';
    $('victoria-preview').hidden = false;
    $('triangle-preview').hidden = true;
    $('normal-preview').hidden = true;
    $('preview').classList.add('preview-camera');
  } else {
    $('victoria-preview').style.objectFit = 'contain';
    $('victoria-preview').style.objectPosition = 'center';
    $('preview').classList.remove('preview-camera');
  }

  if (isClosing) {
    $('preview').classList.add('final-scene-preview');
    $('victoria-preview').hidden = true;
    $('normal-preview').hidden = true;
    $('triangle-preview').hidden = true;
  } else {
    $('preview').classList.remove('final-scene-preview');
  }

  renderList();
  renderTrack();
}

function select(i) {
  active = Math.max(0, Math.min(scenes.length - 1, i));
  time = scenes[active].start;
  render();
}

function seek(value) {
  time = Math.max(0, Math.min(totalRuntime, value));
  active = Math.max(0, scenes.findLastIndex((s) => s.start <= time));
  render();
}

$('play').onclick = () => {
  playing = !playing;
  $('play').textContent = playing ? 'Ⅱ' : '▶';

  if (playing) {
    timer = setInterval(() => {
      time = Math.min(totalRuntime, time + 0.1);
      active = Math.max(0, scenes.findLastIndex((s) => s.start <= time));
      render();

      if (time >= totalRuntime) {
        playing = false;
        $('play').textContent = '▶';
        clearInterval(timer);
      }
    }, 100);
  } else {
    clearInterval(timer);
  }
};

$('scrubber').max = totalRuntime;
$('scrubber').oninput = (e) => seek(Number(e.target.value));
$('previous').onclick = () => select(active - 1);
$('next').onclick = () => select(active + 1);
$('search').oninput = renderList;
$('toggle').onclick = () => {
  const open = $('toggle').getAttribute('aria-checked') === 'true';
  $('toggle').setAttribute('aria-checked', String(!open));
  $('details').hidden = open;
  $('reopen').hidden = !open;
};
$('reopen').onclick = () => $('toggle').click();

render();
